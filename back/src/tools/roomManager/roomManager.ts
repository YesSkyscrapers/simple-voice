import usersManager from '../usersManager/usersManager'

let globalId = 0
let storage = []

const create = (prefId) => {
    if (prefId) {
        let exists = storage.find((item) => item.id == prefId)
        if (exists) {
            throw 'Exists room'
        } else {
            storage.push({
                id: prefId,
                users: []
            })

            return prefId
        }
    } else {
        let id = globalId++
        storage.push({
            id,
            users: []
        })

        return id
    }
}

const getList = () => {
    return storage.map((item) => ({ id: item.id, users: item.users.map((item) => item.login) }))
}

const join = (roomId, userId, login) => {
    let room = storage.find((item) => item.id == roomId)
    let existsUser = room.users.find((user) => user.id == userId)
    if (!existsUser) {
        room.users.push({
            id: userId,
            login: login
        })
    }

    usersManager.clearInOutByIds(room.users.map((user) => user.id))
    let usersIdsForNotify = room.users.map((user) => user.id)

    let fullUsers = usersManager.getUsersByIds(usersIdsForNotify)

    for (let user of fullUsers) {
        try {
            user.events.send(
                JSON.stringify({
                    action: 'RECREATE',
                    payload: room
                })
            )
        } catch (err) {
            console.log(err)
        }
    }
}

const remove = (login) => {
    storage.forEach((item) => {
        let existUser = item.users.find((item) => item.login == login)
        item.users = item.users.filter((item) => item != existUser)
    })
    storage = storage.filter((room) => room.users.length != 0)
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

const checkName = (name) => {
    return !!storage.find((room) => {
        return !!room.users.find((user) => user.login == name)
    })
}

const roomManager = {
    create,
    getList,
    join,
    remove,
    getRoomMates,
    checkName
}

export default roomManager
