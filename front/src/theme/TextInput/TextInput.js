import React, { useCallback } from 'react'
import './TextInput.css'

const TextInput = ({ value, onChangeText, className, useTextarea = false, ...props }) => {
    const onChange = useCallback(
        (event) => {
            if (onChangeText) {
                onChangeText(event.target.value)
            }
        },
        [onChangeText]
    )

    if (useTextarea) {
        return <textarea {...props} className={`TextInput ${className}`} value={value} onChange={onChange} />
    } else {
        return <input {...props} className={`TextInput ${className}`} value={value} onChange={onChange} />
    }
}

export default TextInput
