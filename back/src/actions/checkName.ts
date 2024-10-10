import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import roomManager from '../tools/roomManager/roomManager'

interface Params {
    name: string
}

export const checkName = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    response.body = {
        isTaken: roomManager.checkName(data.name)
    }
}
