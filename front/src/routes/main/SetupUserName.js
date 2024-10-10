import { useCallback, useEffect, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'
import { useDispatch } from 'react-redux'
import { showError } from '../../store/actions/appActions'

const SetupUserName = ({ onSetLogin }) => {
    const dispatch = useDispatch()
    const [login, setLogin] = useState('')

    const onPress = useCallback(
        (setLoader) => {
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
