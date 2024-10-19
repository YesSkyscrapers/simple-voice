import moment from 'moment'

const start = (
    onData,
    delay,
    parametrs = {
        autoGainControl: false,
        channelCount: 4,
        echoCancellation: false,
        noiseSuppression: true
    }
) => {
    let stopCalled = false
    let stream = null
    let recorder = null

    navigator.mediaDevices
        .getUserMedia({
            audio: parametrs
        })
        .then((_stream) => {
            if (stopCalled) {
                return
            }
            stream = _stream
            recorder = new MediaRecorder(stream)

            recorder.ondataavailable = (e) => {
                e.data.arrayBuffer().then((arrayBuffer) => {
                    if (stopCalled) {
                        return
                    }

                    const uint8Array = new Uint8Array(arrayBuffer)
                    const dataToSend = {
                        audioData: Array.from(uint8Array)
                    }

                    onData(JSON.stringify(dataToSend))
                })
            }

            recorder.start(delay)
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
