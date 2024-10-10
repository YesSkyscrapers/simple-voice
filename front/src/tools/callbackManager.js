import { v4 as uuid } from 'uuid'

let storage = []

const createCallback = (func) => {
    const id = uuid()

    storage.push({
        func,
        id
    })

    return id
}

const callCallback = (id) => {
    return (...args) => {
        const callback = storage.find((item) => item.id === id)
        if (callback) {
            return callback.func(...args)
        }
    }
}

export { callCallback, createCallback }
