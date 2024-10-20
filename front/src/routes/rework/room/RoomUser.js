import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RoomUser.css'
import UserImage from '../../../assets/icons/userlight.png'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const RoomUser = ({ user }) => {
    const [volume, setVolume] = useState(null)
    const [myUserId, setMyUserId] = useState(() => cacheManager.load(CACHE_KEYS.AUTH).id)

    const onChangeVolume = useCallback(
        (value) => {
            setVolume(value)
            let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
            volumes[user.id] = value
            cacheManager.save(CACHE_KEYS.VOLUMES, volumes)
        },
        [user]
    )

    useEffect(() => {
        if (volume == null) {
            let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
            setVolume(volumes[user.id] ? volumes[user.id] : 1)
        }
    }, [volume])

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
        </div>
    )
}

export default RoomUser
