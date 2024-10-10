import { useSelector } from 'react-redux'
import './LoaderOverlay.css'
import { Spinner } from 'react-activity'

const LoaderOverlay = () => {
    const showLoader = useSelector((state) => state.app.showLoader)

    if (showLoader) {
        return (
            <div className="FullScreenContainer Center LoaderOverlay">
                <Spinner color="white" />
            </div>
        )
    } else {
        return null
    }
}

export default LoaderOverlay
