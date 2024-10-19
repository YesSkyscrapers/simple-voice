const CACHE_KEYS = {
    AUTH: 'AUTH',
    STASH: 'STASH',
    VOLUMES: 'VOLUMES',
    AUDIO_PARAMS: 'AUDIO_PARAMS'
}

const load = (key) => {
    try {
        const content = localStorage.getItem(key)
        return content ? JSON.parse(content) : {}
    } catch (err) {
        return {}
    }
}

const save = (key, data) => {
    const currentState = load(key)
    const newState = {
        ...currentState,
        ...data
    }
    localStorage.setItem(key, JSON.stringify(newState))
}

const drop = (key) => {
    localStorage.removeItem(key)
}

const cacheManager = {
    save,
    load,
    drop
}

export default cacheManager

export { CACHE_KEYS }
