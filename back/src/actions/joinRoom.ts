import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import usersManager from '../tools/usersManager/usersManager'
import roomManager from '../tools/roomManager/roomManager'

interface Params {
    login: string
    roomId: number
}

export const joinRoom = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    try {
        let userId = usersManager.getUserIdFromLogin(data.login)
        roomManager.join(data.roomId, userId, data.login)

        response.body = {
            ok: true
        }
    } catch (err) {
        console.log(err)
        throw 'Не удалось войти в комнату'
    }
}
