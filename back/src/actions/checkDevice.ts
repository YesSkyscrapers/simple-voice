import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import { Device } from '../entity/Device'
import { v4 } from 'uuid'

interface Params {
    device: Device
}

export const checkDevice = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    let exists = (
        await entityManager.read(Device, { pageIndex: 0, pageSize: 1 }, [
            { type: FilterTypes.EQUAL, key: 'id', value: data.device.id }
        ])
    ).data[0]
    if (!exists) {
        throw 'Device not found'
    }

    if (exists.deviceId == data.device.deviceId && exists.login == data.device.login && exists.id == data.device.id) {
        response.body = {
            ok: true
        }
    } else {
        throw 'Data changed'
    }
}
