import { useCallback, useEffect, useState } from 'react'
import './Main.css'
import SetupUserName from './SetupUserName'
import ListRooms from './ListRooms'
import Room from './Room'

const Main = () => {
    const [state, setState] = useState(0)
    const [login, setLogin] = useState('')
    const [roomId, setRoomId] = useState(null)
    const [preferRoomId, setPreferRoomId] = useState(null)

    const onSetLogin = useCallback((name) => {
        setLogin(name)
        if (window.location.search.includes('?roomid=')) {
            let preferRoomId = Number(window.location.search.slice('?roomid='.length))
            setPreferRoomId(preferRoomId)
        }
        setState(1)
    }, [])

    const onSelectRoom = useCallback((id) => {
        setRoomId(id)
        setState(2)
    }, [])

    return (
        <div>
            {state == 0 ? (
                <SetupUserName onSetLogin={onSetLogin} />
            ) : state == 1 ? (
                <ListRooms preferRoomId={preferRoomId} onSelectRoom={onSelectRoom} />
            ) : state == 2 ? (
                <Room roomId={roomId} login={login} />
            ) : null}
        </div>
    )
}

export default Main
