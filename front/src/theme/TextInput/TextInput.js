import { useCallback } from 'react'
import './TextInput.css'

const TextInput = ({ value, onChangeText, className, ...props }) => {
    const onChange = useCallback(
        (event) => {
            if (onChangeText) {
                onChangeText(event.target.value)
            }
        },
        [onChangeText]
    )

    return <input {...props} className={`TextInput ${className}`} value={value} onChange={onChange} />
}

export default TextInput
