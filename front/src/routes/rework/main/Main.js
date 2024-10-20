import { useCallback, useEffect, useMemo, useState } from 'react'
import './Main.css'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import { ROUTES } from '../../../Router'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from 'react-activity'
import websocket from '../../../tools/websocket'

const Main = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])

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
                            navigate(
                                {
                                    pathname: ROUTES.PERMISSION,
                                    search: createSearchParams({ roomId }).toString()
                                },
                                { replace: true }
                            )
                        })
                    } else {
                        cacheManager.drop(CACHE_KEYS.AUTH)
                        navigate(
                            {
                                pathname: ROUTES.AUTH,
                                search: createSearchParams({ roomId }).toString()
                            },
                            { replace: true }
                        )
                    }
                })
                .catch((err) => {
                    cacheManager.drop(CACHE_KEYS.AUTH)
                    navigate(
                        {
                            pathname: ROUTES.AUTH,
                            search: createSearchParams({ roomId }).toString()
                        },
                        { replace: true }
                    )
                })
        } else {
            cacheManager.drop(CACHE_KEYS.AUTH)
            navigate(
                {
                    pathname: ROUTES.AUTH,
                    search: createSearchParams({ roomId }).toString()
                },
                { replace: true }
            )
        }
    }, [navigate, roomId])
    return (
        <div className="maxheight center">
            <Spinner size={30} color="white" />
        </div>
    )
}

export default Main
