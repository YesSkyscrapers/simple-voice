import JoinSound from '../assets/audio/join.mp3'
import ExitSound from '../assets/audio/exit.mp3'
import NewEnterSound from '../assets/audio/newenter.mp3'

const SOUNDS = {
    NEWENTER: 0,
    JOIN: 1,
    EXIT: 2
}

const SOUND_MAPPING = {
    [SOUNDS.EXIT]: ExitSound,
    [SOUNDS.JOIN]: JoinSound,
    [SOUNDS.NEWENTER]: NewEnterSound
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
