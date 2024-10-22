import { entityManager, FilterTypes } from 'skyes'
import { Message } from '../../entity/Message'
import * as moment from 'moment'

const getLastMessages = async () => {
    const messages = await entityManager.read(Message, { pageIndex: 0, pageSize: 50 }, [
        { type: FilterTypes.ORDER, key: 'id', value: 'DESC' }
    ])
    return messages
}

const sendMessage = async (userId, message) => {
    let messageObj = new Message()
    messageObj.authorId = userId
    messageObj.time = moment().format()
    messageObj.message = message

    let createResult = await entityManager.create(Message, messageObj)

    messageObj = createResult.entity

    if (createResult.count > 50) {
        let messages = await entityManager.read(Message, { pageIndex: 0, pageSize: 1 }, [])
        await entityManager.deleteEntities(Message, messages.data)
    }

    return messageObj
}

export default {
    getLastMessages,
    sendMessage
}
