import { useCallback, useEffect, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'

const ListItem = ({ item, onSelectRoom }) => {
    const onSelect = useCallback(() => {
        onSelectRoom(item.id)
    }, [])

    return (
        <Button onPress={onSelect} main>
            {item.users.join(', ')}
        </Button>
    )
}

const ListRooms = ({ onSelectRoom, preferRoomId }) => {
    const [list, setList] = useState([])

    useEffect(() => {
        dataProvider.getList().then((list) => {
            setList(list)

            if (preferRoomId) {
                onSelectRoom(preferRoomId)
            }
        })
    }, [])

    const onCreate = useCallback((setLoader) => {
        setLoader(true)
        dataProvider.create().then((response) => {
            onSelectRoom(response.id)
        })
    }, [])

    return (
        <div className="ListRooms">
            <Button onPress={onCreate} main>
                Создать
            </Button>
            {list.map((item) => {
                return <ListItem key={item.id} item={item} onSelectRoom={onSelectRoom} />
            })}
        </div>
    )
}

export default ListRooms
