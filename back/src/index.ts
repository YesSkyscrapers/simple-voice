import { skyes } from 'skyes'
import { ormconfig, serverConfig } from '../config'
import { createRoom } from './actions/createRoom'
import { getRooms } from './actions/getRooms'
import { joinRoom } from './actions/joinRoom'
import websocket from './tools/websocket/websocket'
import { checkName } from './actions/checkName'

const runApp = async () => {
    skyes.addAction({
        name: 'room.get',
        action: getRooms
    })

    skyes.addAction({
        name: 'room.create',
        action: createRoom
    })

    skyes.addAction({
        name: 'room.join',
        action: joinRoom
    })

    skyes.addAction({
        name: 'name.check',
        action: checkName
    })

    websocket.init()

    skyes.init({
        ormconfig: ormconfig as any,
        serverConfig: serverConfig
    })
}

export default runApp
