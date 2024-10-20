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

const startStream = async (onData, parametrs, techParams) => {
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
                    channelId: techParams.channelId,
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

const startFromCycle = (func, duration) => {
    let stopFunc
    let forceStop = false

    func().then((_stopFunc) => {
        if (forceStop) {
            _stopFunc()
        }
        stopFunc = _stopFunc
    })

    waitFor(duration).then(() => {
        if (!forceStop) {
            if (stopFunc) {
                stopFunc()
            }
            stopFunc = startFromCycle(func, duration)
        }
    })

    return () => {
        forceStop = true
        if (stopFunc) {
            stopFunc()
        }
    }
}

const cycleStartup = (func, delay, duration) => {
    let stopFunc
    let forceStop = false

    waitFor(delay).then(() => {
        if (!forceStop) {
            if (stopFunc) {
                stopFunc()
            }
            stopFunc = startFromCycle(func, duration)
        }
    })

    return () => {
        forceStop = true
        if (stopFunc) {
            stopFunc()
        }
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
    },
    techParams = {
        channelTime: 1000
    }
) => {
    let stops = []

    stops.push(
        cycleStartup(
            async () => {
                return startStream(onData, parametrs, {
                    channelId: 1
                })
            },
            0,
            techParams.channelTime
        )
    )

    stops.push(
        cycleStartup(
            async () => {
                return startStream(onData, parametrs, {
                    channelId: 2
                })
            },
            techParams.channelTime / 2,
            techParams.channelTime
        )
    )

    return () => {
        stops.forEach((stop) => {
            stop()
        })
    }
}

export default {
    start
}
