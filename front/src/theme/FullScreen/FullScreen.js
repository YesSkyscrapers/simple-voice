import ErrorOverlay from './ErrorOverlay/ErrorOverlay'
import LoaderOverlay from './LoaderOverlay/LoaderOverlay'
import './FullScreen.css'
import ActionPopup from './ActionPopup/ActionPopup'
import ActionForms from './ActionForms/ActionForms'

const FullScreen = () => {
    return (
        <div className="FullScreenContainer">
            <ActionForms />
            <ActionPopup />
            <LoaderOverlay />
            <ErrorOverlay />
        </div>
    )
}

export default FullScreen
