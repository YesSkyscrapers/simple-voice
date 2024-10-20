import { WebSocketServer } from 'ws'
import roomOrc from '../roomOrc/roomOrc'
import { entityManager, FilterTypes } from 'skyes'
import { Device } from '../../entity/Device'

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

let server: WebSocketServer = null

let connections = {}

const init = () => {
    server = new WebSocketServer({ port: 8778 })
    server.on('error', console.log)
    server.on('listening', (e) => {
        console.log('listenings', e)
    })
    server.on('connection', function connection(connection) {
        let isConnected = false
        let userId = null

        connection.on('error', (err) => {
            if (isConnected) {
                connections[userId] = null
                roomOrc.left(userId)
            }
            connection.close()
        })

        connection.on('close', () => {
            if (isConnected) {
                connections[userId] = null
                roomOrc.left(userId)
            }
        })

        connection.on('message', (data) => {
            try {
                let parsed = JSON.parse(data.toString())

                if (isConnected) {
                    switch (parsed.action) {
                        case ACTIONS.CALL_UPDATE_ROOM_LIST: {
                            send(userId, ACTIONS.UPDATE_ROOM_LIST, roomOrc.getRooms())
                            break
                        }
                        case ACTIONS.JOIN_ROOM: {
                            roomOrc.join(parsed.payload, userId)
                            break
                        }
                        case ACTIONS.CALL_UPDATE_USERS_LOGINS: {
                            entityManager
                                .read(Device, { pageIndex: 0, pageSize: parsed.payload.length }, [
                                    { type: FilterTypes.IN, key: 'id', value: [parsed.payload] }
                                ])
                                .then((result) => {
                                    if (result.data.length > 0) {
                                        send(userId, ACTIONS.UPDATE_USERS_LOGINS, result.data)
                                    }
                                })
                            break
                        }
                        case ACTIONS.SEND_VOICE_DATA: {
                            const roommates = roomOrc.getRoommates(userId)
                            let dataForSend = {
                                ...parsed.payload,
                                by: userId
                            }
                            roommates.forEach((roommateId) => {
                                send(roommateId, ACTIONS.RECEIVE_VOICE_DATA, dataForSend)
                            })
                            break
                        }
                    }
                } else {
                    if (parsed.action == ACTIONS.CONNECT) {
                        let connectionUserId = parsed.payload
                        isConnected = true
                        userId = connectionUserId
                        connections[connectionUserId] = connection

                        send(userId, ACTIONS.CONNECTED_SUCCESS)
                    }
                }
            } catch (err) {}
        })
    })
}

const send = (targetId, action, payload = null) => {
    try {
        connections[targetId].send(
            JSON.stringify({
                action,
                payload: payload ? payload : null
            })
        )
    } catch (err) {}
}

export default {
    init,
    send
}

export { ACTIONS }
