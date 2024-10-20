// import moment from 'moment'
// import { waitFor } from './tools'

import moment from 'moment'

// let storage = []

// const play = (url, by) => {
//     let exists = storage.find((item) => item.by == by)
//     if (exists) {
//         exists.audio.pause()
//         storage = storage.filter((item) => item != exists)
//     }

//     const audio = new Audio()
//     audio.src = url
//     audio.play()
//     let newItem = {
//         by: by,
//         audio: audio
//     }
//     audio.onended = () => {
//         storage = storage.filter((item) => item != newItem)
//     }
//     storage.push(newItem)

//     return () => {
//         audio.pause()
//         storage = storage.filter((item) => item != newItem)
//     }
// }

let storage = []
const CHANNELS = [1, 2]

const play = () => {
    let stops = []
    let context = {}

    const onDataFunc = (data) => {
        if (data.isStart) {
            if (!context[data.channelId]) {
                context[data.channelId] = {}
            }
            context[data.channelId].mediaSource = new MediaSource()
            context[data.channelId].url = URL.createObjectURL(context[data.channelId].mediaSource)
            context[data.channelId].sourceBuffer = null

            const onSourceOpen = () => {
                context[data.channelId].sourceBuffer =
                    context[data.channelId].mediaSource.addSourceBuffer('audio/webm;codecs=opus')

                if (context[data.channelId] && context[data.channelId].sourceBuffer) {
                    const uint8Array = new Uint8Array(data.data)
                    const arrayBuffer = uint8Array.buffer

                    context[data.channelId].sourceBuffer.appendBuffer(arrayBuffer)
                }
            }

            if (context[data.channelId].mediaSource.readyState === 'open') {
                onSourceOpen()
            } else {
                context[data.channelId].mediaSource.addEventListener('sourceopen', () => {
                    onSourceOpen()
                })
            }

            context[data.channelId].audio = new Audio()
            context[data.channelId].audio.src = context[data.channelId].url
            context[data.channelId].audio.preload = 'auto'

            context[data.channelId].audio.oncanplaythrough = () => {
                context[data.channelId].muted = false
                context[data.channelId].audio.play()

                if (context[3 - data.channelId] && context[3 - data.channelId].audio) {
                    context[3 - data.channelId].audio.muted = true
                }
            }
        } else {
            if (context[data.channelId] && context[data.channelId].sourceBuffer) {
                const uint8Array = new Uint8Array(data.data)
                const arrayBuffer = uint8Array.buffer

                context[data.channelId].sourceBuffer.appendBuffer(arrayBuffer)
            }
        }
    }

    const stop = () => {
        stops.forEach((stop) => {
            stop()
        })
    }

    return {
        onDataFunc,
        stop
    }
}

export default {
    play
}
