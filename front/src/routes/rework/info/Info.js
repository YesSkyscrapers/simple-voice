import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Info.css'
import Button from '../../../theme/Button/Button'
import ImageScreen from '../../../assets/1.png'

const Info = () => {
    const onDownload = useCallback(() => {
        const newWindow = window.open('https://teamspeak.com/en/downloads/', '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    return (
        <div className="container">
            <div className="margin">
                TeamSpeak разблокирован на текущий момент Роскомнадзором и не планируется повторно влетать в бан (в
                прошлый раз его забанили, пока банили адреса Discord-а)
            </div>
            <div className="divider" />
            <Button main onPress={onDownload}>
                Скачать
            </Button>

            <div className="divider" />
            <div style={{ fontWeight: 'bold' }}>Адрес сервера:</div>

            <div className="divider" />
            <div>ts5.voice-server.ru:10160</div>
            <div className="divider" />

            <img className="image" src={ImageScreen} />
            <div className="divider" />
            <div className="margin">{'1) Кликаете по Плюсику'}</div>
            <div className="margin">{'2) Вводите адрес выше'}</div>
            <div className="margin">{'3) Сервер появится в списке серверов'}</div>
        </div>
    )
}

export default Info
