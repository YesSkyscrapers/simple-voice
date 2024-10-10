import { useCallback, useEffect, useRef, useState } from 'react'
import TextInput from '../../theme/TextInput/TextInput'
import Button from '../../theme/Button/Button'
import dataProvider from '../../tools/dataProvider/dataProvider'
import { CHANNEL_TYPES } from '../../store/constants/appConstants'
import ReactPlayer from 'react-player'
import { useAudioStream } from './tools'

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
    const playerRef = useRef(null)
    const pos = useRef(0)
    const onPlay = useCallback(() => {
        console.log('onPlay', pos.current)
        playerRef.current.seekTo(pos.current, 'seconds')
        pos.current = pos.current + 1
    }, [])
    return (
        <div>
            <ReactPlayer
                url={url}
                playing
                volume={volume}
                ref={playerRef}
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

                let generatedUrl = false

                inst.onmessage = (data) => {
                    console.log('got data')

                    blob.push(data.data)

                    if (!generatedUrl) {
                        generatedUrl = true
                        let blob1 = new Blob(blob, { type: 'audio/webm' })
                        let url = URL.createObjectURL(blob1)

                        setPlayers((prev) => {
                            return prev
                                .filter((item) => item.login != _login)
                                .concat([
                                    {
                                        url: url,
                                        volume: 1,
                                        login: _login
                                    }
                                ])
                        })
                    }
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
                return <PlayerItem key={player.url} url={player.url} volume={player.volume} login={player.login} />
            })}
        </div>
    )
}

export default Room
