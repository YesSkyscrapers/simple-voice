import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Message.css'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import moment from 'moment'

const Message = ({ message, userLogins }) => {
    const [myUserId, setMyUserId] = useState(() => cacheManager.load(CACHE_KEYS.AUTH).id)

    const isMyMessage = useMemo(() => {
        return message.authorId == myUserId
    }, [myUserId, message])

    const userLogin = useMemo(() => {
        let user = userLogins.find((user) => user.id == message.authorId)
        return user ? user.login : 'Загрузка'
    }, [message, userLogins])

    return (
        <div className={isMyMessage ? 'MyMessage' : 'Message'}>
            <div className="messagetime">{moment(message.time).format('DD.MM.YYYY HH:mm')}</div>
            <div className="authorMessage">{`${userLogin}:`}</div>
            <div>{message.message}</div>
        </div>
    )
}

export default Message
