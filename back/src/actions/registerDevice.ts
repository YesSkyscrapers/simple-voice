import { skyes, entityManager, PaginationSettings, Filters, FilterTypes } from 'skyes'
import { Device } from '../entity/Device'
import { v4 } from 'uuid'

interface Params {
    login: string
}

const getFreeDeviceId = async () => {
    let id = v4()

    let exists = (
        await entityManager.read(Device, { pageIndex: 0, pageSize: 1 }, [
            { type: FilterTypes.EQUAL, key: 'deviceId', value: id }
        ])
    ).data[0]

    while (exists) {
        id = v4()
        exists = (
            await entityManager.read(Device, { pageIndex: 0, pageSize: 1 }, [
                { type: FilterTypes.EQUAL, key: 'deviceId', value: id }
            ])
        ).data[0]
    }

    return id
}

export const registerDevice = async ({ httpRequest, request, httpResponse, response }) => {
    const data: Params = request.body.data

    let device: Device = new Device()
    device.login = data.login
    device.deviceId = await getFreeDeviceId()

    response.body = await entityManager.create(Device, device)
}
