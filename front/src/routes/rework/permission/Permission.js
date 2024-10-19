import { useCallback, useEffect, useRef, useState } from 'react'
import './Permission.css'
import { useNavigate } from 'react-router-dom'
import { askMicrophonePermissions, checkMicrophonePermission } from '../../../tools/permissions'
import { ROUTES } from '../../../Router'
import { Spinner } from 'react-activity'
import { waitFor } from '../../../tools/tools'

const Permission = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [permission, setPermission] = useState(null)

    const loopPermission = useCallback(() => {
        checkMicrophonePermission().then((res) => {
            if (res == 'granted') {
                navigate(ROUTES.ROOMS, { replace: true })
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
                navigate(ROUTES.ROOMS, { replace: true })
            } else {
                loopPermission()
                setPermission(res)
                setLoading(false)
                if (res == 'prompt') {
                    askMicrophonePermissions()
                }
            }
        })
    }, [])

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
