import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RoomUser.css'
import UserImage from '../../../assets/icons/userlight.png'

const RoomUser = ({ user }) => {
    return (
        <div className="userCardContainer">
            <div className="userImageContainer">
                <div className="userImagePlaceholder">
                    <img className="userimage" src={UserImage} />
                </div>
            </div>

            <div>{user?.login}</div>
        </div>
    )
}

export default RoomUser
