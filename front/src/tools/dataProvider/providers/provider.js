import config from '../../../config'
import { getDefaultActionUrl, makeAction, uploadFile } from '../tools'

const provider = {
    getList: (token) => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'room.get',
            data: {}
        })
    },
    create: () => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'room.create',
            data: {}
        })
    },
    join: (roomId, login) => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'room.join',
            data: {
                roomId,
                login
            }
        })
    },
    checkName: (name) => {
        return makeAction({
            url: getDefaultActionUrl(config.api),
            action: 'name.check',
            data: {
                name
            }
        })
    }
}

export default provider
