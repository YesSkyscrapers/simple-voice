import moment from 'moment'
import { waitFor } from './tools'

let context = null
const getPickLevelFunc = async (stream) => {
    if (!context) {
        context = new AudioContext()
    }
    await context.resume()
    const source = context.createMediaStreamSource(stream)
    const analyzer = context.createAnalyser()
    source.connect(analyzer)

    const array = new Uint8Array(analyzer.fftSize)

    return () => {
        analyzer.getByteTimeDomainData(array)
        return array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128
    }
}

const startStream = async (onData, parametrs, channelId) => {
    try {
        let stopCalled = false

        let stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                autoGainControl: parametrs.autoGainControl,
                channelCount: parametrs.channelCount,
                echoCancellation: parametrs.echoCancellation,
                noiseSuppression: parametrs.noiseSuppression
            }
        })

        let recorder = new MediaRecorder(stream)
        const getPeakLevel = await getPickLevelFunc(stream)

        let startTime
        let startSent = false

        recorder.ondataavailable = (e) => {
            e.data.arrayBuffer().then((arrayBuffer) => {
                if (stopCalled) {
                    return
                }

                if (!startTime) {
                    startTime = moment()
                }

                const uint8Array = new Uint8Array(arrayBuffer)
                const dataToSend = {
                    data: Array.from(uint8Array),
                    peakLevel: getPeakLevel(),
                    channelId: channelId,
                    time: moment().diff(startTime, 'milliseconds') / 1000,
                    isStart: !startSent
                }

                startSent = true

                onData(dataToSend)
            })
        }
        recorder.start(parametrs.delay)

        return () => {
            stopCalled = true
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop()
                })
            }
        }
    } catch (err) {
        console.log('error getting stream', err)
    }
}

const start = (
    onData,
    parametrs = {
        autoGainControl: false,
        channelCount: 4,
        echoCancellation: false,
        noiseSuppression: true,
        delay: 200
    }
) => {
    let stops = {
        1: null,
        2: null
    }
    let currentChannel = 1
    let stopCalled = false
    let changeActive = false

    const changeChannel = () => {
        if (changeActive) {
            return
        }
        changeActive = true
        let newChannel = 3 - currentChannel
        setTimeout(() => {
            console.log(newChannel)
            if (stops[3 - newChannel]) {
                stops[3 - newChannel]()
            }
        }, 500)

        startStream(onData, parametrs, newChannel).then((stop) => {
            if (stopCalled) {
                stop()
            }
            stops[newChannel] = stop
            currentChannel = newChannel
            changeActive = false
        })
    }

    changeChannel()

    return {
        stop: () => {
            stopCalled = true
            if (stops[1]) {
                stops[1]()
            }
            if (stops[2]) {
                stops[2]()
            }
        },
        changeChannel: changeChannel
    }
}

export default {
    start
}
