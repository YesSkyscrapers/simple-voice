import { WebSocketServer } from 'ws'
import { createServer } from 'https'
import usersManager from '../usersManager/usersManager'
import { CHANNEL_TYPES } from '../../constants/constants'
import roomManager from '../roomManager/roomManager'
import { readFileSync } from 'fs'

let server: WebSocketServer = null

const init = () => {
    // const _server = createServer({
    //     cert: readFileSync('/etc/nginx/ssl/yessky.ru.crt'),
    //     key: readFileSync('/etc/nginx/ssl/yessky.ru.key')
    // })
    server = new WebSocketServer({ port: 8778 })
    server.on('error', console.log)
    server.on('listening', (e) => {
        console.log('listenings', e)
    })
    server.on('connection', function connection(connection) {
        let isConnected = false
        let login = null
        let type = null
        let forUser = null
        let userId = null

        connection.on('error', (err) => {
            if (isConnected) {
                usersManager.enrichUserInfo(login, null, type, forUser)
            }
            connection.close()
        })

        connection.on('close', () => {
            if (isConnected) {
                usersManager.enrichUserInfo(login, null, type, forUser)
            }
        })

        connection.on('message', (data) => {
            if (!isConnected) {
                let splitedData = data.toString().split(':')
                login = splitedData[0]
                type = Number(splitedData[1])
                if (type == CHANNEL_TYPES.AUDIO_IN) {
                    forUser = splitedData[2]
                }
                usersManager.enrichUserInfo(login, connection, type, forUser)
                userId = usersManager.getUserIdFromLogin(login)
                isConnected = true
            } else {
                // найти свою комнату, перебрать всех юзеров и отправить на них данные
                try {
                    let users = roomManager.getRoomMates(userId)
                    let fullUsers = usersManager.getUsersByIds(users.map((user) => user.id))
                    let usersForSend = fullUsers
                        .map((fullUser) => {
                            return fullUser && fullUser.ins && fullUser.ins[login] ? fullUser.ins[login] : null
                        })
                        .filter((item) => !!item)
                    usersForSend.forEach((userConnection) => {
                        try {
                            userConnection.send(data)
                        } catch (err) {
                            console.log('2', err)
                        }
                    })
                } catch (err) {
                    console.log('1', err)
                }
            }
        })
    })

    // _server.listen(8778, '0.0.0.0')
}

export default {
    init
}
