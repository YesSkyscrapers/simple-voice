import websocket, { ACTIONS } from '../websocket/websocket'

let rooms = []
let globalId = 0

const create = () => {
    let id = ++globalId
    rooms.push({
        id,
        users: []
    })

    return id
}

const getRooms = () => {
    return [...rooms]
}

const join = (roomId, userId) => {
    left(userId)

    let room = rooms.find((room) => room.id == roomId)
    if (room) {
        room.users.push({
            id: userId
        })

        let newUsersArray = room.users.map((user) => user.id)

        room.users.forEach((user) => {
            websocket.send(user.id, ACTIONS.UPDATE_USERS_LIST, newUsersArray)
        })
    }
}

const left = (userId) => {
    let roomsForDelete = []

    rooms.forEach((room) => {
        let exists = room.users.find((user) => user.id == userId)
        if (exists) {
            room.users = room.users.filter((user) => user.id != userId)
            if (room.users.length > 0) {
                let newUsersArray = room.users.map((user) => user.id)
                room.users.forEach((user) => {
                    websocket.send(user.id, ACTIONS.UPDATE_USERS_LIST, newUsersArray)
                })
            } else {
                roomsForDelete.push(room.id)
            }
        }
    })

    if (roomsForDelete.length > 0) {
        rooms = rooms.filter((room) => !roomsForDelete.includes(room.id))
    }
}

export default {
    create,
    getRooms,
    join,
    left
}
