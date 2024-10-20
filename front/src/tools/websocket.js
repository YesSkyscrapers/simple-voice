import systemSound, { SOUNDS } from './systemSound'
import { waitFor } from './tools'

const ACTIONS = {
    CONNECT: 1,
    CONNECTED_SUCCESS: 2,
    CALL_UPDATE_ROOM_LIST: 3,
    UPDATE_ROOM_LIST: 4,
    JOIN_ROOM: 5,
    UPDATE_USERS_LIST: 6,
    CALL_UPDATE_USERS_LOGINS: 7,
    UPDATE_USERS_LOGINS: 8,
    SEND_VOICE_DATA: 9,
    RECEIVE_VOICE_DATA: 10
}

const createWSSocket = (idForConnect, handler, closeHandler) => {
    return new Promise((resolve) => {
        const ws = new WebSocket('wss://yessky.ru/simplevoiceweb/')
        let connected = false
        ws.onclose = (e) => {
            console.log('onClose', e)
            connected = false
            closeHandler()
        }

        ws.onerror = (e) => {
            console.log('error', e)
        }

        ws.onmessage = (data) => {
            try {
                const _data = JSON.parse(`${data.data}`)
                if (_data.action == ACTIONS.CONNECTED_SUCCESS) {
                    connected = true
                    console.log(connected, 'connected')
                    resolve(ws)
                } else {
                    if (connected) {
                        handler(_data)
                    }
                }
            } catch (err) {}
        }

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    action: ACTIONS.CONNECT,
                    payload: idForConnect
                })
            )
        }
    })
}

let socket = null
let subscribers = []

const onData = (data) => {
    subscribers
        .filter((sub) => {
            return sub.action == data.action
        })
        .forEach((sub) => sub.handler(data.payload))
}

const init = async (auth) => {
    socket = await createWSSocket(
        auth.id,
        (data) => {
            onData(data)
        },
        () => {
            socket = null
            systemSound.play(SOUNDS.EXIT)
            waitFor(200).then(() => {
                window.location.reload()
            })
        }
    )
}

const isConnected = () => {
    return !!socket
}

const send = (action, payload) => {
    try {
        socket.send(
            JSON.stringify({
                action: action,
                payload: payload ? payload : null
            })
        )
    } catch (err) {}
}

const subscribe = (action, handler) => {
    let subscriber = {
        action,
        handler
    }

    subscribers.push(subscriber)

    return () => {
        subscribers = subscribers.filter((sub) => sub != subscriber)
    }
}

export default {
    init,
    isConnected,
    send,
    subscribe
}
export { ACTIONS }
