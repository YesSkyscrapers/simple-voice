import { useCallback, useEffect, useRef, useState } from 'react'
import './TestSound.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../../theme/Button/Button'
import recorder from '../../../tools/recorder'
import ReactPlayer from 'react-player'
import moment from 'moment'
import RecorderParams from './RecorderParams'
import { waitFor } from '../../../tools/tools'
import { ROUTES } from '../../../Router'

const TestSound = () => {
    const navigate = useNavigate()
    const [isStarted, setIsStarted] = useState(false)
    const stopFunc = useRef(null)
    const [playerUrl, setPlayerUrl] = useState(null)
    const playerRef = useRef(null)
    const startTime = useRef(null)
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
            stopFunc.current = recorder.start(
                (data, p) => {
                    console.log(data, p)
                    data.arrayBuffer().then((buffer) => {
                        try {
                            sourceBuffer.appendBuffer(buffer)
                        } catch (err) {}
                    })
                },
                200,
                parametrs.current
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

        setPlayerUrl(url)
    }, [])

    const onStop = useCallback(() => {
        if (stopFunc.current) {
            stopFunc.current()
        }
        setIsStarted(false)
    }, [])

    const onPlayerPlay = useCallback(() => {
        let tick = () => {
            if (startTime.current == null) {
                startTime.current = moment()
            } else {
                playerRef.current.seekTo(moment().diff(startTime.current, 'milliseconds') / 1000, 'seconds')
            }
        }
        tick()
        setInterval(tick, 30000)
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
            <ReactPlayer
                url={playerUrl}
                playing
                width={1}
                height={1}
                volume={1}
                ref={playerRef}
                onStart={(e) => console.log('onStart', playerRef.current.getCurrentTime())}
                onPause={(e) => console.log('onPause', playerRef.current.getCurrentTime())}
                onBuffer={(e) => console.log('onBuffer', playerRef.current.getCurrentTime())}
                onBufferEnd={(e) => console.log('onBufferEnd', playerRef.current.getCurrentTime())}
                onError={(e) => console.log('onError', e)}
                onEnded={(e) => console.log('onEnded', e)}
                onPlay={() => {
                    onPlayerPlay()
                }}
            />
        </div>
    )
}

export default TestSound
