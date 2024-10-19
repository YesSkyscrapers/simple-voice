import { useCallback, useState } from 'react'
import './Button.css'
import { Spinner } from 'react-activity'

const Button = ({ onPress, disabled, children, className, classNameContent, main = false, ...props }) => {
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
        <div
            {...props}
            className={`Button ${main ? 'MainButton' : ''} ${className ? className : ''} ${
                disabled ? 'ButtonDisabled' : ''
            }`}
            onClick={disabled ? null : onClick}
        >
            <div
                className={`ButtonContent ${classNameContent ? classNameContent : ''} ${
                    useLoader ? 'ButtonContentHidden' : ''
                }`}
            >
                {children}
            </div>
            <div className={`ButtonLoader ButtonContent ${useLoader ? '' : 'ButtonContentHidden'}`}>
                {useLoader ? <Spinner size={13} color="white" /> : null}
            </div>
        </div>
    )
}

export default Button
