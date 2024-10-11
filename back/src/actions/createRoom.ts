import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import roomManager from '../tools/roomManager/roomManager'

interface Params {
    prefId: any
}

export const createRoom = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    response.body = {
        id: roomManager.create(data.prefId)
    }
}
