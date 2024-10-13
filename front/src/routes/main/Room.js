import { useCallback, useEffect, useRef, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'
import { CHANNEL_TYPES } from '../../store/constants/appConstants'
import ReactPlayer from 'react-player'
import { useAudioStream } from './tools'
import moment from 'moment'
import { store } from '../../store/store'
import { showError } from '../../store/actions/appActions'
import cacheManager, { CACHE_KEYS } from '../../tools/cacheManager'

const createWSSocket = (welcomeMessage) => {
    return new Promise((resolve) => {
        const ws = new WebSocket('wss://yessky.ru/simplevoiceweb/')
        ws.onclose = (e) => {
            console.log('onClose', e)
        }

        ws.onerror = (e) => {
            console.log('error', e)
        }
        ws.onopen = () => {
            console.log('onOpen')
            ws.send(welcomeMessage)

            resolve(ws)
        }
    })
}

const PlayerItem = ({ volume, login, url, onVolumeChange }) => {
    const [currentUrl, setCurrentUrl] = useState(url)
    const [volumeText, setVolumeText] = useState(`${volume * 10}`)
    const [isPlaying, setIsPlaying] = useState(false)
    // // const currentUrlRef = useRef(null)
    const playerRef = useRef(null)
    // let isFirstRun = useRef(true)
    let currentTime = useRef(0)
    let startTime = useRef(null)
    const onPlay = useCallback(() => {
        // console.log('onPlay')
        setIsPlaying(true)
        let tick = () => {
            if (startTime.current == null) {
                startTime.current = moment()
            } else {
                console.log('onPlay', currentTime.current, moment().diff(startTime.current, 'milliseconds') / 1000)
                playerRef.current.seekTo(moment().diff(startTime.current, 'milliseconds') / 1000, 'seconds')
            }
        }
        tick()
        setInterval(tick, 60000)
    }, [])

    const onPause = useCallback(() => {
        setIsPlaying(false)
    }, [])

    // useEffect(() => {
    //     if (isFirstRun.current) {
    //         isFirstRun.current = false
    //     } else {
    //         setCurrentUrl((prev) => prev.concat([url]))
    //     }
    // }, [url])

    // useEffect(() => {
    //     console.log('currentUrl', currentUrl)
    //     setTimeout(() => {
    //         setTest(true)
    //     }, 5000)
    // }, [currentUrl])

    // const onReady = useCallback(() => {}, [])

    const onChangeVolumeCallback = useCallback(
        (text) => {
            setVolumeText(text)
            try {
                if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(text))) {
                    console.log(Number(text) / 10)
                    let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
                    cacheManager.save(CACHE_KEYS.VOLUMES, { ...volumes, [login]: Number(text) / 10 })
                    onVolumeChange(login, Number(text) / 10)
                }
            } catch (err) {}
        },
        [onVolumeChange, login]
    )

    return (
        <div className="playerItem">
            <ReactPlayer
                url={currentUrl}
                playing
                width={1}
                height={1}
                volume={volume}
                ref={playerRef}
                // // onReady={(e) => onReady(e)}
                onStart={(e) => console.log('onStart', playerRef.current.getCurrentTime())}
                // // onProgress={(e) => onDuration(e)}
                onPause={onPause}
                onBuffer={(e) => console.log('onBuffer', playerRef.current.getCurrentTime())}
                onBufferEnd={(e) => console.log('onBufferEnd', playerRef.current.getCurrentTime())}
                // onSeek={(e) => console.log('onSeek', playerRef.current.getCurrentTime())}
                // onPlaybackRateChange={(e) => console.log('onPlaybackRateChange', playerRef.current.getCurrentTime())}
                // onPlaybackQualityChange={(e) =>
                //     console.log('onPlaybackQualityChange', playerRef.current.getCurrentTime())
                // }
                onError={(e) => console.log('onError', e)}
                // onPlay={(e) => console.log('onPlay', e)}
                onEnded={(e) => console.log('onEnded', e)}
                // // onEnded={onEnded}
                onPlay={() => {
                    onPlay()
                }}
            />
            <div className="playerItemInfo">
                <span className="dot" style={{ backgroundColor: isPlaying ? 'green' : 'red' }} />
                <span>{`Имя: ${login} Громкость: `}</span>
                <TextInput className={'playerItemInfoInput'} value={volumeText} onChangeText={onChangeVolumeCallback} />
                <span>{`(Меняется от 0 до 10)`}</span>
            </div>
        </div>
    )
}

const Room = ({ roomId, login }) => {
    const out = useRef(null)
    const events = useRef(null)
    const ins = useRef([])
    const [players, setPlayers] = useState([])
    let recreateTimeout = useRef(null)
    let recreateTimeout2 = useRef(null)

    const sendBlob = useCallback((data) => {
        out.current.send(data)
    })
    const { startStream, stopStream } = useAudioStream(sendBlob)

    const onVolumeChange = useCallback((login, value) => {
        setPlayers((prev) => {
            return prev.map((item) => {
                if (item.login == login) {
                    return {
                        ...item,
                        volume: value
                    }
                } else {
                    return item
                }
            })
        })
    }, [])

    useEffect(() => {
        const asyncFunc = async () => {
            const addNewIn = async (_login) => {
                const inst = await createWSSocket(`${login}:${CHANNEL_TYPES.AUDIO_IN}:${_login}`)
                ins.current.push(inst)

                let mediaSource = new MediaSource()
                let url = URL.createObjectURL(mediaSource)

                var sourceBuffer = null

                if (mediaSource.readyState === 'open') {
                    sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus')
                    inst.onmessage = (data) => {
                        data.data.arrayBuffer().then((buffer) => {
                            sourceBuffer.appendBuffer(buffer)
                        })
                    }
                } else {
                    mediaSource.addEventListener('sourceopen', function () {
                        sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus')
                        inst.onmessage = (data) => {
                            data.data.arrayBuffer().then((buffer) => {
                                sourceBuffer.appendBuffer(buffer)
                            })
                        }
                    })
                }

                setPlayers((prev) => {
                    let exists = prev.find((item) => item.login == _login)
                    if (exists) {
                        return prev.map((item) => {
                            if (item.login == _login) {
                                return {
                                    ...item,
                                    url: url
                                }
                            } else {
                                return item
                            }
                        })
                    } else {
                        let volumes = cacheManager.load(CACHE_KEYS.VOLUMES)
                        let volume = volumes[_login] ? volumes[_login] : 1
                        return prev.concat([
                            {
                                url: url,
                                volume: volume,
                                login: _login
                            }
                        ])
                    }
                })
            }

            events.current = await createWSSocket(`${login}:${CHANNEL_TYPES.EVENTS}`)
            events.current.onmessage = (data) => {
                const asyncFunc = async () => {
                    let event = JSON.parse(`${data.data}`)

                    if (event.action == 'RECREATE') {
                        stopStream()
                        setPlayers((prev) => [])
                        if (recreateTimeout.current) {
                            clearTimeout(recreateTimeout.current)
                            recreateTimeout.current = null
                        }
                        if (recreateTimeout2.current) {
                            clearTimeout(recreateTimeout2.current)
                            recreateTimeout2.current = null
                        }
                        let logins = event.payload.users.filter((user) => user.login != login).map((user) => user.login)

                        for (let _login of logins) {
                            await addNewIn(_login)
                        }

                        recreateTimeout.current = setTimeout(() => {
                            const asyncFunc = async () => {
                                out.current = await createWSSocket(`${login}:${CHANNEL_TYPES.AUDIO_OUT}`)
                            }
                            recreateTimeout2.current = setTimeout(() => {
                                startStream()
                            }, 1000)
                            asyncFunc()
                        }, 1000)
                    }
                }

                asyncFunc()
            }
            await dataProvider.join(roomId, login)
        }
        asyncFunc()
    }, [])

    const onShare = useCallback(() => {
        navigator.clipboard.writeText(`https://yessky.ru/simplevoice/?roomid=${roomId}`)
        store.dispatch(showError('Скопировано!'))
    }, [])

    return (
        <div className="Room">
            <Button main onPress={onShare}>
                Поделиться
            </Button>
            {players.map((player) => {
                return (
                    <PlayerItem
                        key={player.login}
                        url={player.url}
                        volume={player.volume}
                        login={player.login}
                        onVolumeChange={onVolumeChange}
                    />
                )
            })}
        </div>
    )
}

export default Room
