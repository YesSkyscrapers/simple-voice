import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Messages.css'
import Button from '../../../theme/Button/Button'
import LetterImage from '../../../assets/icons/letter.png'
import TextInput from '../../../theme/TextInput/TextInput'
import websocket, { ACTIONS } from '../../../tools/websocket'
import Message from './Message'

const Messages = ({}) => {
    const [opened, setOpened] = useState(false)
    const [messages, setMessages] = useState([])
    const shiftPressed = useRef(false)
    const [messageForSend, setMessageForSend] = useState('')
    const [showNotif, setShowNotif] = useState(false)
    let wasAskRef = useRef(false)
    const elementRef = useRef()

    const onOpen = useCallback(() => {
        setOpened(true)
        setShowNotif(false)
        if (!wasAskRef.current) {
            websocket.send(ACTIONS.GET_LAST_MESSAGES)
            wasAskRef.current = true
        }
    }, [])

    useEffect(() => {
        let unsubs = []
        unsubs.push(
            websocket.subscribe(ACTIONS.GET_LAST_MESSAGES, (response) => {
                setMessages((prev) => response.data.reverse())
            })
        )

        unsubs.push(
            websocket.subscribe(ACTIONS.ON_NEW_MESSAGE, (message) => {
                if (!opened) {
                    setShowNotif(true)
                } else {
                    setTimeout(() => {
                        elementRef.current.scrollIntoView()
                    }, 100)
                }
                setMessages((prev) => prev.concat([message]))
            })
        )

        return () => {
            unsubs.forEach((unsub) => {
                unsub()
            })
        }
    }, [opened, messages])

    const onSend = useCallback(() => {
        let textForSend = `${messageForSend}`
        setMessageForSend('')
        websocket.send(ACTIONS.SEND_MESSAGE, {
            message: textForSend
        })
    }, [messageForSend])

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                if (!shiftPressed.current) {
                    onSend()
                }
            }
            if (event.key === 'Shift') {
                shiftPressed.current = true
            }
        },
        [messageForSend]
    )

    const handleKeyUp = useCallback((event) => {
        if (event.key === 'Shift') {
            shiftPressed.current = false
        }
    }, [])

    useEffect(() => {
        if (opened) {
            setTimeout(() => {
                elementRef.current.scrollIntoView()
            }, [100])
        }
    }, [opened])

    const onClose = useCallback(() => {
        setOpened(false)
    }, [])

    if (opened) {
        return (
            <div className="openedBlockContainer">
                <div className="header">
                    <Button main onPress={onClose} className="closeButton">
                        Закрыть
                    </Button>
                </div>
                <div className="messagesContainer">
                    {messages.map((message) => {
                        return <Message message={message} key={message.id} />
                    })}
                    <div ref={elementRef} />
                </div>
                <div className="inputContainer">
                    <TextInput
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        useTextarea
                        className="messageInput"
                        onChangeText={setMessageForSend}
                        value={messageForSend}
                    />
                    <Button onPress={onSend} className="sendContainer">
                        <img className="letterimage" src={LetterImage} />
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <Button onPress={onOpen} className="blockcontainer">
                <img className="letterimage" src={LetterImage} />
                {showNotif ? <div className="letternotification" /> : null}
            </Button>
        )
    }
}

export default Messages
