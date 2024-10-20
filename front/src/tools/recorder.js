import moment from 'moment'

const applyGainParam = (stream, gainParam) => {
    let audioTrack = stream.getAudioTracks()[0]
    let ctx = new AudioContext()
    let src = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
    let dst = ctx.createMediaStreamDestination()
    let gainNode = ctx.createGain()
    gainNode.gain.value = gainParam
    let arr = [src, gainNode, dst]
    arr.reduce((a, b) => a && a.connect(b))
    stream.removeTrack(audioTrack)
    stream.addTrack(dst.stream.getAudioTracks()[0])
    return stream
}

const getPickLevelFunc = (stream) => {
    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyzer = context.createAnalyser()
    source.connect(analyzer)

    const array = new Uint8Array(analyzer.fftSize)

    return () => {
        analyzer.getByteTimeDomainData(array)
        return array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128
    }
}

const start = (
    onData,
    parametrs = {
        autoGainControl: false,
        channelCount: 4,
        echoCancellation: false,
        noiseSuppression: true,
        microVolume: 1,
        delay: 200
    }
) => {
    let stopCalled = false
    let stream = null
    let recorder = null

    navigator.mediaDevices
        .getUserMedia({
            audio: {
                autoGainControl: parametrs.autoGainControl,
                channelCount: parametrs.channelCount,
                echoCancellation: parametrs.echoCancellation,
                noiseSuppression: parametrs.noiseSuppression
            }
        })
        .then((stream) => applyGainParam(stream, parametrs.microVolume))
        .then((stream) => {
            if (stopCalled) {
                return
            }

            recorder = new MediaRecorder(stream)

            const getPeakLevel = getPickLevelFunc(stream)

            recorder.ondataavailable = (e) => {
                e.data.arrayBuffer().then((arrayBuffer) => {
                    if (stopCalled) {
                        return
                    }

                    const uint8Array = new Uint8Array(arrayBuffer)
                    const dataToSend = {
                        data: Array.from(uint8Array),
                        peakLevel: getPeakLevel()
                    }

                    onData(dataToSend)
                })
            }

            recorder.start(parametrs.delay)
        })
        .catch((e) => console.log('error getting stream', e))

    return () => {
        stopCalled = true
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }
}

export default {
    start
}
