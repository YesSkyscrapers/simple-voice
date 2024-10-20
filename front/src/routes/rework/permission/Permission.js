import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Permission.css'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { askMicrophonePermissions, checkMicrophonePermission } from '../../../tools/permissions'
import { ROUTES } from '../../../Router'
import { Spinner } from 'react-activity'
import { waitFor } from '../../../tools/tools'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'

const Permission = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])
    const [loading, setLoading] = useState(true)
    const [permission, setPermission] = useState(null)

    const loopPermission = useCallback(() => {
        checkMicrophonePermission().then((res) => {
            if (res == 'granted') {
                let preferRoomId = cacheManager.load(CACHE_KEYS.PREFER_PERMISSION_ROOM_ID)
                console.log({
                    roomId: preferRoomId && preferRoomId.id ? preferRoomId.id : null
                })
                navigate(
                    {
                        pathname: ROUTES.ROOMS,
                        search: createSearchParams({
                            roomId: preferRoomId && preferRoomId.id ? preferRoomId.id : null
                        }).toString()
                    },
                    { replace: true }
                )
                cacheManager.save(CACHE_KEYS.PREFER_PERMISSION_ROOM_ID, { id: null })
            } else {
                setPermission(res)
                waitFor(1000).then(() => {
                    loopPermission()
                })
            }
        })
    }, [])

    useEffect(() => {
        checkMicrophonePermission().then((res) => {
            if (res == 'granted') {
                cacheManager.save(CACHE_KEYS.PREFER_PERMISSION_ROOM_ID, { id: null })
                navigate(
                    {
                        pathname: ROUTES.ROOMS,
                        search: createSearchParams({ roomId }).toString()
                    },
                    { replace: true }
                )
            } else {
                cacheManager.save(CACHE_KEYS.PREFER_PERMISSION_ROOM_ID, { id: roomId })
                loopPermission()
                setPermission(res)
                setLoading(false)
                if (res == 'prompt') {
                    askMicrophonePermissions()
                }
            }
        })
    }, [roomId])

    return (
        <div className="flex center">
            {loading ? (
                <Spinner size={15} color="white" />
            ) : permission == 'prompt' ? (
                <div className="infoMessage">
                    <div className="infoMessageTitle">Внимание</div>
                    <div>
                        Сейчас как то всплывет плашка с запросом на доступ к микрофону. Выдайте заранее, ибо впадлу
                        обрабатывать отсутствие доступа потом на каждом экранах.
                    </div>
                </div>
            ) : (
                <div className="infoMessage">
                    <div className="infoMessageTitle">Ошибка</div>
                    <div>
                        Вот вы заходите в голосовую, мать его, связь, и не выдаете пермишен на микрофон... Все в порядке
                        с головой?
                    </div>
                </div>
            )}
        </div>
    )
}

export default Permission
