import JoinSound from '../assets/audio/join.mp3'
import ExitSound from '../assets/audio/exit.mp3'
import NewEnterSound from '../assets/audio/newenter.mp3'
import NewMessageSound from '../assets/audio/newmessage.mp3'

const SOUNDS = {
    NEWENTER: 0,
    JOIN: 1,
    EXIT: 2,
    NEW_MESSAGE: 3
}

const SOUND_MAPPING = {
    [SOUNDS.EXIT]: ExitSound,
    [SOUNDS.JOIN]: JoinSound,
    [SOUNDS.NEWENTER]: NewEnterSound,
    [SOUNDS.NEW_MESSAGE]: NewMessageSound
}

const play = (sound) => {
    try {
        let audio = new Audio(SOUND_MAPPING[sound])
        audio.play().catch((err) => {})
    } catch (err) {}
}

export default {
    play
}
export { SOUNDS }
