import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import roomManager from '../tools/roomManager/roomManager'

interface Params {}

export const getRooms = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    response.body = roomManager.getList()
}
