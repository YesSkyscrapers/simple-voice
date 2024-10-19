import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Room.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import websocket, { ACTIONS } from '../../../tools/websocket'
import { ROUTES } from '../../../Router'
import { Spinner } from 'react-activity'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import RoomUser from './RoomUser'

const Room = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])

    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])

    useEffect(() => {
        if (!websocket.isConnected()) {
            navigate(ROUTES.MAIN, { replace: true })
        } else {
            websocket.subscribe(ACTIONS.UPDATE_USERS_LIST, (newUsersArray) => {
                setUsers((prev) => {
                    // удаляем тех кого уже нет
                    let newState = prev.filter((prevUser) => newUsersArray.includes(prevUser.id))

                    //добавляем новых
                    newUsersArray.forEach((userInNewUsersArray) => {
                        let exists = newState.find((user) => user.id == userInNewUsersArray)
                        if (!exists) {
                            newState.push({
                                id: userInNewUsersArray
                            })
                        }
                    })

                    return newState
                })
            })

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

            websocket.send(ACTIONS.JOIN_ROOM, roomId)
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

    useEffect(() => {
        if (loading && users.length > 0) {
            setLoading(false)
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
                </div>
            )}
        </div>
    )
}

export default Room
