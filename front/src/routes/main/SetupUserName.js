import { useCallback, useEffect, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'
import { useDispatch } from 'react-redux'
import { showError } from '../../store/actions/appActions'
import cacheManager, { CACHE_KEYS } from '../../tools/cacheManager'

const SetupUserName = ({ onSetLogin }) => {
    const dispatch = useDispatch()
    const [login, setLogin] = useState('')

    useEffect(() => {
        let prevLogin = cacheManager.load(CACHE_KEYS.STASH)?.login
        if (prevLogin) {
            setLogin(prevLogin)
        }
    }, [])

    const onPress = useCallback(
        (setLoader) => {
            cacheManager.save(CACHE_KEYS.STASH, { login })
            if (login.length == 0) {
                dispatch(showError('Без имени нельзя'))
            } else {
                setLoader(true)
                dataProvider
                    .checkName(login)
                    .then((r) => {
                        if (r.isTaken) {
                            dispatch(showError('Имя занято'))
                        } else {
                            onSetLogin(login)
                        }
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
        },
        [login]
    )

    return (
        <div className="SetupUserName">
            <TextInput value={login} onChangeText={setLogin} />
            <Button onPress={onPress} main>
                Войти
            </Button>
        </div>
    )
}

export default SetupUserName
