import { useCallback, useEffect, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'

const SetupUserName = ({ onSetLogin }) => {
    const [login, setLogin] = useState('')

    const onPress = useCallback(() => {
        onSetLogin(login)
    }, [login])

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
