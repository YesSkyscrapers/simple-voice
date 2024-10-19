import { useCallback, useEffect, useRef, useState } from 'react'
import './TestSound.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../../theme/Button/Button'
import recorder from '../../../tools/recorder'
import RecorderParams from './RecorderParams'
import { waitFor } from '../../../tools/tools'
import { ROUTES } from '../../../Router'
import player from '../../../tools/player'

const TestSound = () => {
    const navigate = useNavigate()
    const [isStarted, setIsStarted] = useState(false)
    const stopFuncs = useRef([])
    const parametrs = useRef(null)

    const onStart = useCallback(() => {
        if (!parametrs.current) {
            return
        }

        let mediaSource = new MediaSource()
        let url = URL.createObjectURL(mediaSource)

        let sourceBuffer = null

        const onSourceOpen = () => {
            sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus')
            stopFuncs.current.push(
                recorder.start(
                    (data) => {
                        try {
                            let parsed = JSON.parse(data)
                            const uint8Array = new Uint8Array(parsed.audioData)
                            const arrayBuffer = uint8Array.buffer

                            sourceBuffer.appendBuffer(arrayBuffer)
                        } catch (err) {}
                    },
                    200,
                    parametrs.current
                )
            )
            setIsStarted(true)
        }

        if (mediaSource.readyState === 'open') {
            onSourceOpen()
        } else {
            mediaSource.addEventListener('sourceopen', () => {
                onSourceOpen()
            })
        }

        stopFuncs.current.push(player.play(url))
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

            if (isStarted) {
                onStop()
                waitFor(1).then(() => {
                    onStart()
                })
            }
        },
        [isStarted]
    )

    const onBack = useCallback(() => {
        navigate(ROUTES.MAIN, { replace: true })
    }, [])

    return (
        <div className="maxheight center vertical">
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
