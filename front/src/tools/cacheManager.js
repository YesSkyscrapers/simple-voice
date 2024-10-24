const CACHE_KEYS = {
    AUTH: 'AUTH',
    STASH: 'STASH',
    VOLUMES: 'VOLUMES_NEW',
    AUDIO_PARAMS: 'AUDIO_PARAMS',
    PREFER_PERMISSION_ROOM_ID: 'PREFER_PERMISSION_ROOM_ID'
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
