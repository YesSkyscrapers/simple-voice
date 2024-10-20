import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './PeakVisual.css'

const PeakVisual = ({ peak }) => {
    const barRef = useRef(null)
    const peakRef = useRef(0)
    const shouldStop = useRef(false)

    useEffect(() => {
        peakRef.current = peak
    }, [peak])

    const tick = useCallback(() => {
        if (shouldStop.current) {
            return
        }
        barRef.current.style.height = `${peakRef.current * 100}%`
        requestAnimationFrame(tick)
    }, [])

    useEffect(() => {
        tick()

        return () => {
            shouldStop.current = true
        }
    }, [])

    return (
        <div className="visualContainer">
            <div ref={barRef} id="visualbar" />
        </div>
    )
}

export default PeakVisual
