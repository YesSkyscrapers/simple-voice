import { useCallback, useEffect, useState } from 'react'
import './Main.css'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import { ROUTES } from '../../../Router'
import { useNavigate } from 'react-router-dom'
import { Spinner } from 'react-activity'
import websocket from '../../../tools/websocket'

const Main = () => {
    const navigate = useNavigate()

    useEffect(() => {
        let auth = cacheManager.load(CACHE_KEYS.AUTH)
        if (auth.id) {
            dataProvider
                .check({
                    id: auth.id,
                    deviceId: auth.deviceId,
                    login: auth.login
                })
                .then((response) => {
                    if (response && response.ok) {
                        return websocket.init(auth).then(() => {
                            navigate(ROUTES.PERMISSION, { replace: true })
                        })
                    } else {
                        cacheManager.drop(CACHE_KEYS.AUTH)
                        navigate(ROUTES.AUTH, { replace: true })
                    }
                })
                .catch((err) => {
                    cacheManager.drop(CACHE_KEYS.AUTH)
                    navigate(ROUTES.AUTH, { replace: true })
                })
        } else {
            cacheManager.drop(CACHE_KEYS.AUTH)
            navigate(ROUTES.AUTH, { replace: true })
        }
    }, [navigate])
    return (
        <div className="maxheight center">
            <Spinner size={30} color="white" />
        </div>
    )
}

export default Main
