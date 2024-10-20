import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './PeakVisual.css'

const PeakVisual = ({ peak }) => {
    const barRef = useRef(null)
    const peakRef = useRef(0)

    useEffect(() => {
        peakRef.current = peak
    }, [peak])

    const tick = useCallback(() => {
        console.log(peakRef.current)
        barRef.current.style.height = `${peakRef.current * 100}%`
        requestAnimationFrame(tick)
    }, [])

    useEffect(() => {
        tick()
    }, [])

    return (
        <div className="visualContainer">
            <div ref={barRef} id="visualbar" />
        </div>
    )
}

export default PeakVisual
