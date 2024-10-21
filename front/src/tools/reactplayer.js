import moment from 'moment'
import cacheManager, { CACHE_KEYS } from './cacheManager'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

const Reactplayer = forwardRef(({ peakUpdate, volume = 1 }, ref) => {
    const [context, setContext] = useState({
        1: {
            playing: false,
            url: null
        },
        2: {
            playing: false,
            url: null
        }
    })
    const contextRef = useRef({})
    const stops = useRef([])
    const peakChannelId = useRef(0)

    const getState = () => {
        return { ...context }
    }

    const setState = (newState) => {
        return setContext({
            ...context,
            ...newState
        })
    }

    useImperativeHandle(ref, () => ({
        onDataFunc(data) {
            if (data.isStart) {
                let contextState = getState()

                contextRef.current[data.channelId] = { mediaSource: new MediaSource(), sourceBuffer: null }
                contextState = {
                    ...contextState,
                    [data.channelId]: { url: URL.createObjectURL(contextRef.current[data.channelId].mediaSource) }
                }

                const onSourceOpen = () => {
                    contextRef.current[data.channelId].sourceBuffer =
                        contextRef.current[data.channelId].mediaSource.addSourceBuffer('audio/webm;codecs=opus')

                    if (contextRef.current[data.channelId] && contextRef.current[data.channelId].sourceBuffer) {
                        const uint8Array = new Uint8Array(data.data)
                        const arrayBuffer = uint8Array.buffer

                        contextRef.current[data.channelId].sourceBuffer.appendBuffer(arrayBuffer)
                    }
                }

                if (contextRef.current[data.channelId].mediaSource.readyState === 'open') {
                    onSourceOpen()
                } else {
                    contextRef.current[data.channelId].mediaSource.addEventListener('sourceopen', () => {
                        onSourceOpen()
                    })
                }

                contextState = {
                    ...contextState,
                    [data.channelId]: { ...contextState[data.channelId], playing: true }
                }

                setState(contextState)
            } else {
                if (contextRef.current[data.channelId] && contextRef.current[data.channelId].sourceBuffer) {
                    const uint8Array = new Uint8Array(data.data)
                    const arrayBuffer = uint8Array.buffer
                    if (data.channelId == peakChannelId.current) {
                        peakUpdate(data.peakLevel)
                    }
                    try {
                        contextRef.current[data.channelId].sourceBuffer.appendBuffer(arrayBuffer)
                    } catch (err) {
                        console.log(err, contextRef.current[data.channelId].sourceBuffer.error)
                    }
                }
            }
        },
        stop() {
            stops.current.forEach((stop) => {
                stop()
            })
        }
    }))

    const playing1 = useMemo(() => {
        return context[1].playing
    }, [context])

    const playing2 = useMemo(() => {
        return context[2].playing
    }, [context])

    const url1 = useMemo(() => {
        return context[1].url
    }, [context])

    const url2 = useMemo(() => {
        return context[2].url
    }, [context])

    const onPlay = useCallback((channelId) => {
        peakChannelId.current = channelId
        setContext((prev) => ({
            ...prev,
            [3 - channelId]: {
                ...prev[3 - channelId],
                playing: false
            }
        }))
    }, [])
    const onPlay1 = useCallback(() => {
        onPlay(1)
    }, [onPlay])
    const onPlay2 = useCallback(() => {
        onPlay(2)
    }, [onPlay])

    return (
        <div>
            <ReactPlayer onPlay={onPlay1} url={url1} playing={playing1} width={1} height={1} volume={volume} />
            <ReactPlayer onPlay={onPlay2} url={url2} playing={playing2} width={1} height={1} volume={volume} />
        </div>
    )
})

export default Reactplayer
