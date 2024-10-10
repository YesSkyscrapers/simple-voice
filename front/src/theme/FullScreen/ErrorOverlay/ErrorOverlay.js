import { useSelector } from 'react-redux'
import './ErrorOverlay.css'

const ErrorOverlay = ({}) => {
    const errors = useSelector((state) => state.app.errors)

    return (
        <div className="FullScreenContainer">
            <div className="FullScreenErrorsContainer">
                {errors.map((error) => (
                    <div key={error.id} className="FullScreenError">
                        {error.text}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ErrorOverlay
