import { useCallback, useEffect, useMemo, useState } from 'react'
import './Auth.css'
import TextInput from '../../../theme/TextInput/TextInput'
import Button from '../../../theme/Button/Button'
import dataProvider from '../../../tools/dataProvider/dataProvider'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../../Router'

const Main = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const roomId = useMemo(() => searchParams.get('roomId'), [searchParams])
    const [login, setLogin] = useState('')

    const onLogin = useCallback(
        (toggleLoad) => {
            toggleLoad(true)
            dataProvider
                .register(login)
                .then((response) => {
                    if (response) {
                        let auth = cacheManager.load(CACHE_KEYS.AUTH)
                        auth.deviceId = response.entity.deviceId
                        auth.id = response.entity.id
                        auth.login = response.entity.login
                        cacheManager.save(CACHE_KEYS.AUTH, auth)
                        navigate(
                            {
                                pathname: ROUTES.PERMISSION,
                                search: createSearchParams({ roomId }).toString()
                            },
                            { replace: true }
                        )
                    }
                })
                .finally(() => {
                    toggleLoad(false)
                })
        },
        [login, navigate, roomId]
    )

    return (
        <div className="maxheight center">
            <div className="border center defaultPadding vertical">
                <TextInput placeholder="login" value={login} onChangeText={setLogin} />
                <div style={{ height: 16 }} />
                <Button main onPress={onLogin}>
                    Войти
                </Button>
            </div>
        </div>
    )
}

export default Main
