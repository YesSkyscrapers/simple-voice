import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Rooms.css'
import websocket, { ACTIONS } from '../../../tools/websocket'
import { ROUTES } from '../../../Router'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../../theme/Button/Button'
import CheckIcon from '../../../assets/icons/check.png'
import CreateIcon from '../../../assets/icons/create.png'
import JoinIcon from '../../../assets/icons/join.png'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import RoomInList from './RoomInList'

const Rooms = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [rooms, setRooms] = useState([])
    const intervalRef = useRef(null)

    useEffect(() => {
        if (!websocket.isConnected()) {
            navigate(ROUTES.MAIN, { replace: true })
        } else {
            if (roomId && roomId != 'null') {
                console.log('connect', roomId)
                connectToRoom(roomId)
            }
        }
    }, [roomId])

    const updateRooms = useCallback(() => {
        if (websocket.isConnected()) {
            websocket.send(ACTIONS.CALL_UPDATE_ROOM_LIST)
        }
    }, [])

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            updateRooms()
        }, 1000)

        let unsub = websocket.subscribe(ACTIONS.UPDATE_ROOM_LIST, (payload) => {
            setRooms((prev) => payload)
        })

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            unsub()
        }
    }, [])

    useEffect(() => {
        if (selectedRoom) {
            if (!rooms.find((room) => room.id == selectedRoom.id)) {
                setSelectedRoom(null)
            }
        }
    }, [rooms, selectedRoom])

    const connectToRoom = useCallback((roomId) => {
        navigate({
            pathname: ROUTES.ROOM,
            search: createSearchParams({ roomId }).toString()
        })
    }, [])

    const onCreate = useCallback((toggleLoad) => {
        toggleLoad(true)
        dataProvider
            .createRoom()
            .then((response) => {
                connectToRoom(response.roomId)
            })
            .finally(() => {
                toggleLoad(false)
            })
    }, [])

    const onJoin = useCallback(() => {
        connectToRoom(selectedRoom.id)
    }, [selectedRoom])

    const onTest = useCallback(() => {
        navigate(ROUTES.TEST_SOUND)
    }, [selectedRoom])

    const onSelect = useCallback((room) => {
        setSelectedRoom(room)
    }, [])

    return (
        <div className="roomcontainer">
            <div className="gridButtonsContainer">
                <Button onPress={onCreate} className="gridButton">
                    <div className="gridButtonContent">
                        <img className="gridButtonImage" src={CreateIcon} />
                        <div className="gridButtonText">Создать</div>
                    </div>
                </Button>
                <Button
                    onPress={onJoin}
                    disabled={!selectedRoom}
                    className="gridButton"
                    addChilds={selectedRoom ? null : <div className="warningInGrid">Не выбрана комната</div>}
                >
                    <div className="gridButtonContent">
                        <img className="gridButtonImage" src={JoinIcon} />
                        <div className="gridButtonText">Войти</div>
                    </div>
                </Button>
                <Button onPress={onTest} className="gridButton">
                    <div className="gridButtonContent">
                        <img className="gridButtonImage" src={CheckIcon} />
                        <div className="gridButtonText">Проверка звука</div>
                    </div>
                </Button>
            </div>
            <div className="roomsContainer">
                {rooms.map((room, index) => {
                    return (
                        <RoomInList
                            onSelect={onSelect}
                            key={room.id}
                            room={room}
                            index={index}
                            isSelected={selectedRoom?.id == room.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Rooms
