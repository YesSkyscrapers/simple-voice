import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RoomInList.css'
import Button from '../../../theme/Button/Button'

const RoomInList = ({ room, index, onSelect, isSelected }) => {
    const onPress = useCallback(() => {
        onSelect(room)
    }, [room])

    return (
        <Button onPress={onPress} className={`roomRowButton ${isSelected ? 'roomRowButtonSelected' : ''}`}>
            <div className={`roomRow ${index == 0 ? 'roomRowFirst' : ''}`}>
                <div className="roomRowCount">{`Участников: ${room.users.length}`}</div>
                <div className="roomRowUsers">{room.users.map((user) => user.id).join(', ')}</div>
            </div>
        </Button>
    )
}

export default RoomInList
