import moment from 'moment'
import { waitFor } from './tools'

let storage = []
let syncRunning = false

const sync = async () => {
    await waitFor(10000)

    // storage.forEach((item) => {
    //     item.audio.currentTime = moment().diff(item.startTime, 'milliseconds') / 1000
    // })

    sync()
}

const init = () => {
    if (!syncRunning) {
        syncRunning = true
        sync()
    }
}

const play = (url, by) => {
    let exists = storage.find((item) => item.by == by)
    if (exists) {
        exists.audio.pause()
        storage = storage.filter((item) => item != exists)
    }

    const audio = new Audio()
    audio.src = url
    audio.play()
    let newItem = {
        by: by,
        audio: audio,
        startTime: moment()
    }
    audio.onended = () => {
        storage = storage.filter((item) => item != newItem)
    }
    storage.push(newItem)

    init()

    return () => {
        audio.pause()
        storage = storage.filter((item) => item != newItem)
    }
}

export default {
    play
}
