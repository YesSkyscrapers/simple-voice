import config from '../../../config'
import { getDefaultActionUrl, makeAction, uploadFile } from '../tools'

const provider = {
    register: (login) => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'device.register',
            data: {
                login
            }
        })
    },
    check: (device) => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'device.check',
            data: {
                device
            }
        })
    },
    createRoom: () => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'rooms.create',
            data: {}
        })
    }
}

export default provider
