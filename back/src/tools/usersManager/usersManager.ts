import { CHANNEL_TYPES } from '../../constants/constants'
import roomManager from '../roomManager/roomManager'

let users = []
let globalId = 0

const enrichUserInfo = (login, connection, type, forUser = null) => {
    let existsUser = users.find((user) => user.login == login)
    if (existsUser) {
        if (type == CHANNEL_TYPES.AUDIO_IN) {
            if (existsUser.ins) {
                existsUser.ins[forUser] = connection
            } else {
                existsUser.ins = {
                    [forUser]: connection
                }
            }
        } else if (type == CHANNEL_TYPES.AUDIO_OUT) {
            existsUser.out = connection
        } else if (type == CHANNEL_TYPES.EVENTS) {
            existsUser.events = connection
        }

        if (
            connection == null &&
            (!existsUser.ins || Object.values(existsUser.ins).filter((inP) => inP != null).length == 0) &&
            existsUser.out == null &&
            existsUser.events == null
        ) {
            roomManager.remove(login)
        }
    } else {
        if (type == CHANNEL_TYPES.AUDIO_IN) {
            users.push({
                login,
                ins: {
                    [forUser]: connection
                },
                id: globalId++
            })
        } else if (type == CHANNEL_TYPES.AUDIO_OUT) {
            users.push({
                login,
                out: connection,
                id: globalId++
            })
        } else if (type == CHANNEL_TYPES.EVENTS) {
            users.push({
                login,
                events: connection,
                id: globalId++
            })
        }
    }
}

const getUserIdFromLogin = (login) => {
    let user = users.find((item) => item.login == login)
    return user ? user.id : null
}

const clearInOutByIds = (ids: Array<any>) => {
    users = users.map((user) => {
        if (ids.includes(user.id)) {
            if (user.out) {
                try {
                    user.out.close()
                } catch (err) {}
            }
            if (user.ins) {
                Object.values(user.ins).forEach((connection: any) => {
                    try {
                        connection.close()
                    } catch (err) {}
                })
            }

            return {
                ...user,
                out: null,
                ins: {}
            }
        } else {
            return user
        }
    })
}

const getUsersByIds = (ids: Array<any>) => {
    if (ids.length == 0) {
        return []
    } else {
        return users.filter((user) => {
            return ids.includes(user.id)
        })
    }
}

export default {
    enrichUserInfo,
    getUserIdFromLogin,
    getUsersByIds,
    clearInOutByIds
}
