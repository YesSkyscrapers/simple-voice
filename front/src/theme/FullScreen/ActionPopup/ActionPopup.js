import { useDispatch, useSelector } from 'react-redux'
import './ActionPopup.css'
import Button from '../../Button/Button'
import { useCallback } from 'react'
import { callCallback } from '../../../tools/callbackManager'
import { hide_action_popup } from '../../../store/actionCreators.js/appActionCreators'

const ActionPopup = () => {
    const dispatch = useDispatch()
    const actionPopups = useSelector((state) => state.app.actionPopups || [])
    const firstPopup = actionPopups[0]

    const onClose = useCallback(() => {
        dispatch(hide_action_popup(firstPopup.id))
    }, [firstPopup, dispatch])

    const onCancel = useCallback(() => {
        if (firstPopup.cancelable) {
            callCallback(firstPopup.onResult)('cancel')
            onClose()
        }
    }, [onClose, firstPopup])

    const onPress = useCallback(
        (item) => {
            callCallback(firstPopup.onResult)(item.key)
            onClose()
        },
        [firstPopup, onClose]
    )

    if (firstPopup) {
        return (
            <div onClick={onCancel} className="FullScreenContainer Center PopupOverlay">
                <div className="ActionPopup Border">
                    <div className="ActionPopupTitle">{firstPopup.title}</div>
                    <div className="ActionPopupText">{firstPopup.text}</div>
                    <div className="ActionPopupButtons">
                        {firstPopup.buttons.map((item, index) => (
                            <Button onPress={() => onPress(item)} key={item.key || index} className="ActionPopupButton">
                                {item.text}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default ActionPopup
