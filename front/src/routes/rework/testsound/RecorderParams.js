import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './RecorderParams.css'
import cacheManager, { CACHE_KEYS } from '../../../tools/cacheManager'
import OnIcon from '../../../assets/icons/on.png'
import OffIcon from '../../../assets/icons/off.png'
import Button from '../../../theme/Button/Button'
import TextInput from '../../../theme/TextInput/TextInput'

const DEFAULT_SETTINGS = {
    autoGainControl: false,
    channelCount: 4,
    echoCancellation: false,
    noiseSuppression: true
}

const RecorderParams = ({ onParametrsChange }) => {
    const [parametrs, setParametrs] = useState(DEFAULT_SETTINGS)

    useEffect(() => {
        let paramsFromCache = cacheManager.load(CACHE_KEYS.AUDIO_PARAMS)
        if (paramsFromCache && Object.keys(paramsFromCache).length > 0) {
            setParametrs((prev) => paramsFromCache)
        }
    }, [])

    const onBoolChange = useCallback((field) => {
        setParametrs((prev) => ({ ...prev, [field]: !prev[field] }))
    }, [])

    const onTextChange = useCallback((field, text) => {
        setParametrs((prev) => ({ ...prev, [field]: text }))
    }, [])

    useEffect(() => {
        const newParams = {
            ...parametrs,
            channelCount: Number(parametrs.channelCount) != NaN ? Number(parametrs.channelCount) : 4
        }
        onParametrsChange(newParams)
        cacheManager.save(CACHE_KEYS.AUDIO_PARAMS, newParams)
    }, [parametrs])

    const channelCount = useMemo(() => {
        return `${parametrs.channelCount}`
    }, [parametrs])

    return (
        <div className="paramsContainer">
            <Button onPress={() => onBoolChange('autoGainControl')} className="paramRow">
                <div className="paramName">autoGainControl</div>
                <div className="paramValue">
                    <img src={parametrs.autoGainControl ? OnIcon : OffIcon} />
                </div>
            </Button>
            <div className="paramRow">
                <div className="paramName">channelCount</div>
                <TextInput onChangeText={(text) => onTextChange('channelCount', text)} value={channelCount} />
            </div>
            <Button onPress={() => onBoolChange('echoCancellation')} className="paramRow">
                <div className="paramName">echoCancellation</div>
                <div className="paramValue">
                    <img src={parametrs.echoCancellation ? OnIcon : OffIcon} />
                </div>
            </Button>
            <Button onPress={() => onBoolChange('noiseSuppression')} className="paramRow">
                <div className="paramName">noiseSuppression</div>
                <div className="paramValue">
                    <img src={parametrs.noiseSuppression ? OnIcon : OffIcon} />
                </div>
            </Button>
        </div>
    )
}

export default RecorderParams
