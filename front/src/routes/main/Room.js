import { useCallback, useEffect, useRef, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'
import { CHANNEL_TYPES } from '../../store/constants/appConstants'
import ReactPlayer from 'react-player'
import { useAudioStream } from './tools'
import moment from 'moment'

const createWSSocket = (welcomeMessage) => {
    return new Promise((resolve) => {
        const ws = new WebSocket('ws://localhost:8778')

        ws.onopen = () => {
            ws.send(welcomeMessage)

            resolve(ws)
        }
    })
}

const PlayerItem = ({ volume, login, url }) => {
    const [currentUrl, setCurrentUrl] = useState(null)
    const currentUrlRef = useRef(null)
    const playerRef = useRef(null)
    let currentTime = useRef(0)
    let startTime = useRef(null)
    const onPlay = useCallback(() => {
        if (startTime.current == null) {
            startTime.current = moment()
        } else {
            console.log('onPlay', currentTime.current, moment().diff(startTime.current, 'milliseconds') / 1000)
            playerRef.current.seekTo(moment().diff(startTime.current, 'milliseconds') / 1000, 'seconds')
        }
    }, [])

    const onEnded = useCallback(() => {}, [])

    useEffect(() => {
        currentTime.current = playerRef.current.getCurrentTime()

        setCurrentUrl(url)
        currentUrlRef.current = url
    }, [url])

    useEffect(() => {
        console.log('currentUrl', currentUrl)
    }, [currentUrl])

    const onReady = useCallback(() => {}, [])

    return (
        <div>
            <ReactPlayer
                url={currentUrl}
                playing
                volume={volume}
                ref={playerRef}
                onReady={(e) => onReady(e)}
                // onStart={(e) => console.log('onStart', playerRef.current.getCurrentTime())}
                // onProgress={(e) => onDuration(e)}
                // onPause={(e) => console.log('onPause', playerRef.current.getCurrentTime())}
                // onBuffer={(e) => console.log('onBuffer', playerRef.current.getCurrentTime())}
                // onBufferEnd={(e) => console.log('onBufferEnd', playerRef.current.getCurrentTime())}
                // onSeek={(e) => console.log('onSeek', playerRef.current.getCurrentTime())}
                // onPlaybackRateChange={(e) => console.log('onPlaybackRateChange', playerRef.current.getCurrentTime())}
                // onPlaybackQualityChange={(e) =>
                //     console.log('onPlaybackQualityChange', playerRef.current.getCurrentTime())
                // }
                onError={(e) => console.log('onError', e)}
                onEnded={onEnded}
                onPlay={() => {
                    onPlay()
                }}
            />
        </div>
    )
}

let blobs = {}

const Room = ({ roomId, login }) => {
    const out = useRef(null)
    const events = useRef(null)
    const ins = useRef([])
    const [players, setPlayers] = useState([])

    const sendBlob = useCallback((data) => {
        out.current.send(data)
    })
    const { startStream, stopStream } = useAudioStream(sendBlob)

    useEffect(() => {
        const asyncFunc = async () => {
            const addNewIn = async (_login) => {
                const inst = await createWSSocket(`${login}:${CHANNEL_TYPES.AUDIO_IN}:${_login}`)
                ins.current.push(inst)

                if (!blobs[_login]) {
                    blobs[_login] = []
                }

                let blob = blobs[_login]

                inst.onmessage = (data) => {
                    blob.push(data.data)

                    let blob1 = new Blob(blob, { type: 'audio/webm' })
                    let url = URL.createObjectURL(blob1)
                    console.log('got data')

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
                            return prev.concat([
                                {
                                    url: url,
                                    volume: 1,
                                    login: _login
                                }
                            ])
                        }
                    })
                }
            }

            events.current = await createWSSocket(`${login}:${CHANNEL_TYPES.EVENTS}`)
            events.current.onmessage = (data) => {
                let event = `${data.data}`

                addNewIn(event)
            }

            out.current = await createWSSocket(`${login}:${CHANNEL_TYPES.AUDIO_OUT}`)

            let res = await dataProvider.join(roomId, login)

            let logins = res.room.users.filter((user) => user.login != login).map((user) => user.login)

            for (let _login of logins) {
                await addNewIn(_login)
            }
        }
        asyncFunc()
    }, [])

    return (
        <div className="Room">
            <Button main onPress={startStream}>
                Start
            </Button>
            <Button main onPress={stopStream}>
                Stop
            </Button>
            {players.map((player) => {
                return <PlayerItem key={player.login} url={player.url} volume={player.volume} login={player.login} />
            })}
        </div>
    )
}

export default Room
