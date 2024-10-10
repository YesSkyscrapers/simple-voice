import usersManager from '../usersManager/usersManager'

let globalId = 0
let storage = []

const create = () => {
    let id = globalId++
    storage.push({
        id,
        users: []
    })

    return id
}

const getList = () => {
    return storage.map((item) => ({ id: item.id, users: item.users.map((item) => item.login) }))
}

const join = (roomId, userId, login) => {
    let room = storage.find((item) => item.id == roomId)
    let existsUser = room.users.find((user) => user.id == userId)
    if (!existsUser) {
        let usersIdsForNotify = room.users.map((user) => user.id)

        room.users.push({
            id: userId,
            login: login
        })
        let fullUsers = usersManager.getUsersByIds(usersIdsForNotify)
        for (let user of fullUsers) {
            try {
                user.events.send(login)
            } catch (err) {
                console.log(err)
            }
        }
    }

    return room
}

const remove = (login) => {
    storage.forEach((item) => {
        let existUser = item.users.find((item) => item.login == login)
        item.users = item.users.filter((item) => item != existUser)
    })
}

const getRoomMates = (userId) => {
    let room = storage.find((room) => {
        return room.users.find((user) => user.id == userId)
    })

    if (room) {
        return room.users.filter((user) => user.id != userId)
    } else {
        return []
    }
}

const roomManager = {
    create,
    getList,
    join,
    remove,
    getRoomMates
}

export default roomManager
