import { skyes } from 'skyes'
import { ormconfig, serverConfig } from '../config'
import websocket from './tools/websocket/websocket'
import { registerDevice } from './actions/registerDevice'
import { checkDevice } from './actions/checkDevice'
import { createRoom } from './actions/createRoom'

const runApp = async () => {
    skyes.addAction({
        name: 'device.register',
        action: registerDevice
    })

    skyes.addAction({
        name: 'device.check',
        action: checkDevice
    })

    skyes.addAction({
        name: 'rooms.create',
        action: createRoom
    })

    websocket.init()

    skyes.init({
        serverConfig: serverConfig,
        ormconfig: ormconfig as any
    })
}

export default runApp
