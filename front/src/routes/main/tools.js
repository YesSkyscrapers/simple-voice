import React, { useEffect, useRef } from 'react'

export const useAudioStream = (sendBlob, timeSlice = 500) => {
    const stream = useRef(null)
    const startStream = async () => {
        let recorder

        try {
            //wait for the stream promise to resolve
            stream.current = await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: false,
                    channelCount: 4,
                    echoCancellation: false,
                    noiseSuppression: false
                }
            })
            recorder = new MediaRecorder(stream.current)

            recorder.ondataavailable = (e) => {
                sendBlob(e.data)
            }
            recorder.start(200)

            // setTimeout(() => {
            //     recorder.stop()
            // }, 2000)
        } catch (e) {
            console.log('error getting stream', e)
        }
    }
    const stopStream = () => {
        if (stream.current) {
            stream.current.getTracks().forEach(function (track) {
                track.stop()
            })
        }
    }

    return {
        startStream,
        stopStream
    }
}
