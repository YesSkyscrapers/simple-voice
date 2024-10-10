import { useDispatch, useSelector } from 'react-redux'
import './ActionForms.css'
import { useCallback } from 'react'
import { hide_action_form, hide_action_popup } from '../../../store/actionCreators.js/appActionCreators'

const ACTION_FORMS = {}

const ActionForm = ({ type, props, onClose }) => {
    let Component = null

    switch (type) {
    }

    return <Component onClose={onClose} {...props} />
}

const ActionForms = () => {
    const dispatch = useDispatch()
    const actionForms = useSelector((state) => state.app.actionForms || [])

    const actionForm = actionForms[0]

    const onClose = useCallback(() => {
        dispatch(hide_action_form(actionForm.id))
    }, [actionForm, dispatch])

    const onCancel = useCallback(() => {
        if (actionForm.cancelable) {
            onClose()
        }
    }, [onClose, actionForm])

    if (actionForm) {
        return (
            <div onClick={onCancel} className="FullScreenContainer Center PopupOverlay">
                <div className="ActionPopup Border">
                    <ActionForm type={actionForm.type} onClose={onClose} props={actionForm.props || {}} />
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default ActionForms
export { ACTION_FORMS }
