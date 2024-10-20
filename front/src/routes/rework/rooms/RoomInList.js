import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RoomInList.css'
import Button from '../../../theme/Button/Button'
import websocket, { ACTIONS } from '../../../tools/websocket'

const RoomInList = ({ room, index, onSelect, isSelected }) => {
    const [usersLogins, setUsersLogin] = useState([])

    const onPress = useCallback(() => {
        onSelect(room)
    }, [room])

    useEffect(() => {
        websocket.subscribe(ACTIONS.UPDATE_USERS_LOGINS, (users) => {
            setUsersLogin((prev) => {
                return prev.concat(users)
            })
        })
    })

    useEffect(() => {
        let usersWithoutName = room.users.filter((roomUser) => {
            let exists = usersLogins.find((user) => user.id == roomUser.id)
            return !exists
        })

        if (usersWithoutName.length > 0) {
            websocket.send(
                ACTIONS.CALL_UPDATE_USERS_LOGINS,
                usersWithoutName.map((user) => user.id)
            )
        }
    }, [room, usersLogins])

    const usersRow = useMemo(() => {
        return room.users
            .map((roomUser) => {
                let exists = usersLogins.find((user) => user.id == roomUser.id)
                if (exists) {
                    return {
                        ...roomUser,
                        login: exists.login
                    }
                } else {
                    return {
                        ...roomUser,
                        login: 'Загрузка'
                    }
                }
            })
            .map((user) => user.login)
            .join(', ')
    }, [usersLogins, room])

    return (
        <Button onPress={onPress} className={`roomRowButton ${isSelected ? 'roomRowButtonSelected' : ''}`}>
            <div className={`roomRow ${index == 0 ? 'roomRowFirst' : ''}`}>
                <div className="roomRowCount">{`Участников: ${room.users.length}`}</div>
                <div className="roomRowUsers">{usersRow}</div>
            </div>
        </Button>
    )
}

export default RoomInList
