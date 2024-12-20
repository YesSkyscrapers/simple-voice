import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Room.css'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import websocket, { ACTIONS } from '../../../tools/websocket'
import { ROUTES } from '../../../Router'
import { Spinner } from 'react-activity'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import RoomUser from './RoomUser'
import { getParametrsFromCache } from '../testsound/RecorderParams'
import recorder from '../../../tools/recorder'
import player from '../../../tools/player'
import { waitFor } from '../../../tools/tools'
import systemSound, { SOUNDS } from '../../../tools/systemSound'
import Messages from './Messages'

const Room = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const stopFuncs = useRef([])
    const [showButtons, setShowButtons] = useState(false)
    const changeChannelRef = useRef(null)

    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])

    useEffect(() => {
        if (!websocket.isConnected()) {
            navigate(
                {
                    pathname: ROUTES.MAIN,
                    search: createSearchParams({ roomId }).toString()
                },
                { replace: true }
            )
        } else {
            setUsers((prev) => [])
            setLoading((prev) => true)
            stopFuncs.current = []
            player.current = []
            let unsubs = []
            waitFor(100).then(() => {
                unsubs.push(
                    websocket.subscribe(ACTIONS.UPDATE_USERS_LIST, (newUsersArray) => {
                        setUsers((prev) => {
                            let wasDelete = false
                            // удаляем тех кого уже нет
                            let newState = prev.filter((prevUser) => {
                                let result = newUsersArray.includes(prevUser.id)
                                if (!result) {
                                    wasDelete = true
                                }
                                return result
                            })

                            if (wasDelete) {
                                systemSound.play(SOUNDS.EXIT)
                            }

                            let wasAdd = false

                            //добавляем новых
                            newUsersArray.forEach((userInNewUsersArray) => {
                                let exists = newState.find((user) => user.id == userInNewUsersArray)
                                if (!exists) {
                                    wasAdd = true
                                    newState.push({
                                        id: userInNewUsersArray
                                    })
                                }
                            })

                            if (wasAdd && prev.length > 0) {
                                systemSound.play(SOUNDS.NEWENTER)
                                changeChannelRef.current()
                            }

                            return newState
                        })
                    })
                )

                unsubs.push(
                    websocket.subscribe(ACTIONS.UPDATE_USERS_LOGINS, (users) => {
                        setUsers((prev) => {
                            return prev.map((prevUser) => {
                                let newDataExists = users.find((user) => user.id == prevUser.id)
                                if (newDataExists) {
                                    return {
                                        ...prevUser,
                                        login: newDataExists.login
                                    }
                                } else {
                                    return prevUser
                                }
                            })
                        })
                    })
                )
                websocket.send(ACTIONS.JOIN_ROOM, roomId)
            })

            return () => {
                unsubs.forEach((unsub) => {
                    unsub()
                })
            }
        }
    }, [roomId])

    useEffect(() => {
        let usersWithoutName = users.filter((user) => !user.login)

        if (usersWithoutName.length > 0) {
            websocket.send(
                ACTIONS.CALL_UPDATE_USERS_LOGINS,
                usersWithoutName.map((user) => user.id)
            )
        }
    }, [users])

    const startVoice = useCallback(() => {
        let parametrs = getParametrsFromCache()

        const onRecorderData = (data) => {
            websocket.send(ACTIONS.SEND_VOICE_DATA, data)
        }

        const { stop, changeChannel } = recorder.start(onRecorderData, parametrs)
        changeChannelRef.current = changeChannel
        stopFuncs.current.push(stop)
    }, [])

    useEffect(() => {
        if (loading && users.length > 0) {
            setLoading(false)
            systemSound.play(SOUNDS.JOIN)

            startVoice()
            setShowButtons(true)
        }
    }, [users, loading])

    return (
        <div className="flex">
            {loading ? (
                <div className="flex center">
                    <Spinner size={15} color="white" />
                </div>
            ) : (
                <div className="usersContainer">
                    {users.map((user) => {
                        return <RoomUser key={user.id} user={user} />
                    })}
                    {showButtons ? (
                        <div className="buttonsContainer">
                            <Messages />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default Room
