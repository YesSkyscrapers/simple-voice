import { useCallback, useState } from 'react'
import './Button.css'
import { Spinner } from 'react-activity'

const Button = ({ onPress, children, className, classNameContent, main = false, ...props }) => {
    const [useLoader, setLoader] = useState(false)

    const onClick = useCallback(
        (e) => {
            e.stopPropagation()
            if (onPress && !useLoader) {
                onPress(setLoader)
            }
        },
        [onPress, setLoader, useLoader]
    )

    return (
        <div {...props} className={`Button ${main ? 'MainButton' : ''} ${className}`} onClick={onClick}>
            <div className={`ButtonContent ${classNameContent} ${useLoader ? 'ButtonContentHidden' : ''}`}>
                {children}
            </div>
            <div className={`ButtonLoader ButtonContent ${useLoader ? '' : 'ButtonContentHidden'}`}>
                {useLoader ? <Spinner size={13} /> : null}
            </div>
        </div>
    )
}

export default Button
