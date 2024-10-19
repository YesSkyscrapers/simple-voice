import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import { Device } from '../entity/Device'
import { v4 } from 'uuid'
import roomOrc from '../tools/roomOrc/roomOrc'

interface Params {}

export const createRoom = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    response.body = {
        roomId: roomOrc.create()
    }
}
