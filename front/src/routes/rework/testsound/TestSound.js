import { useCallback, useEffect, useRef, useState } from 'react'
import './TestSound.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../../theme/Button/Button'
import recorder from '../../../tools/recorder'
import RecorderParams from './RecorderParams'
import { waitFor } from '../../../tools/tools'
import { ROUTES } from '../../../Router'
import player from '../../../tools/player'
import moment from 'moment'
import PeakVisual from './PeakVisual'

const TestSound = () => {
    const navigate = useNavigate()
    const [isStarted, setIsStarted] = useState(false)
    const stopFuncs = useRef([])
    const parametrs = useRef(null)

    const [peak, setPeak] = useState(0)

    const onStart = useCallback(() => {
        if (!parametrs.current) {
            return
        }

        const { onDataFunc, stop } = player.play(setPeak)

        stopFuncs.current.push(recorder.start(onDataFunc, parametrs.current, { channelTime: 3000 }))

        stopFuncs.current.push(stop)

        setIsStarted(true)
    }, [])

    const onStop = useCallback(() => {
        if (stopFuncs.current.length > 0) {
            stopFuncs.current.forEach((stopFunc) => {
                stopFunc()
            })
        }
        setIsStarted(false)
    }, [])

    const onParametrsChange = useCallback(
        (params) => {
            parametrs.current = params
            onStop()
        },
        [onStop]
    )

    const onBack = useCallback(() => {
        navigate(ROUTES.MAIN, { replace: true })
    }, [])

    return (
        <div className="maxheight center vertical">
            <PeakVisual peak={peak} />
            <RecorderParams onParametrsChange={onParametrsChange} />
            <div className="buttonsContainer">
                <Button main onPress={isStarted ? onStop : onStart}>
                    {isStarted ? 'Стоп' : 'Старт'}
                </Button>
                <div className="buttonsDivider" />
                <Button main onPress={onBack}>
                    Назад
                </Button>
            </div>
        </div>
    )
}

export default TestSound
