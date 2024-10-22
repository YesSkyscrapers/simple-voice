import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Message.css'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import moment from 'moment'

const Message = ({ message }) => {
    const [myUserId, setMyUserId] = useState(() => cacheManager.load(CACHE_KEYS.AUTH).id)

    const isMyMessage = useMemo(() => {
        return message.authorId == myUserId
    }, [myUserId, message])

    return (
        <div className={isMyMessage ? 'MyMessage' : 'Message'}>
            <div className="messagetime">{moment(message.time).format('DD.MM.YYYY HH:mm')}</div>
            <div>{message.message}</div>
        </div>
    )
}

export default Message
