import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RoomUser.css'
import UserImage from '../../../assets/icons/userlight.png'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import websocket, { ACTIONS } from '../../../tools/websocket'
import Reactplayer from '../../../tools/reactplayer'

const RoomUser = ({ user }) => {
    const [volume, setVolume] = useState(() => {
        let volumesCache = cacheManager.load(CACHE_KEYS.VOLUMES)
        return user.id && volumesCache && typeof volumesCache[user.id] == 'number' ? volumesCache[user.id] : 1
    })
    const [myUserId, setMyUserId] = useState(() => cacheManager.load(CACHE_KEYS.AUTH).id)
    const playerRef = useRef(null)

    const onChangeVolume = useCallback(
        (value) => {
            setVolume(value)
            let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
            volumes[user.id] = value
            cacheManager.save(CACHE_KEYS.VOLUMES, volumes)
        },
        [user]
    )

    const onPeakUpdate = useCallback(
        (peak) => {
            let visual = document.getElementById(`userImagePlaceholderAnim_${user.id}`)
            if (visual) {
                visual.style.outlineWidth = `${peak * 50}px`
            }
        },
        [user]
    )

    useEffect(() => {
        if (volume == null) {
            let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
            setVolume(volumes[user.id] ? volumes[user.id] : 1)
        }
    }, [volume])

    useEffect(() => {
        let unsub = websocket.subscribe(ACTIONS.RECEIVE_VOICE_DATA, (data) => {
            if (data.by != user.id) {
                return
            }

            playerRef.current.onDataFunc(data)
        })

        return () => {
            if (unsub) {
                unsub()
            }
        }
    }, [user])

    return (
        <div className="userCardContainer">
            <div className="userImageContainer">
                <div id={`userImagePlaceholderAnim_${user?.id}`} className="userImagePlaceholderAnim">
                    <div className="userImagePlaceholder">
                        <img className="userimage" src={UserImage} />
                    </div>
                </div>
            </div>
            <div className={`userVolume ${volume != null && myUserId != user.id ? '' : 'userVolumeHidden'}`}>
                <Slider min={0} max={1} step={0.01} onChange={onChangeVolume} value={volume} />
            </div>
            <div>{user?.login}</div>
            <Reactplayer peakUpdate={onPeakUpdate} ref={playerRef} volume={volume} />
        </div>
    )
}

export default RoomUser
