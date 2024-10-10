import { createCallback } from '../../tools/callbackManager'
import { waitFor } from '../../tools/tools'
import { show_action_popup, update_showing_error } from '../actionCreators.js/appActionCreators'
import { v4 as uuid } from 'uuid'

const showError = (_text) => {
    return async (dispatch, getState) => {
        let text = _text
        if (typeof _text === 'object') {
            text = _text.error ? _text.error : _text.message
        }
        let currentErrors = getState().app.errors
        const newErrorId = uuid()
        dispatch(update_showing_error(currentErrors.concat({ text, id: newErrorId })))
        await waitFor(3000)
        currentErrors = getState().app.errors
        dispatch(update_showing_error(currentErrors.filter((error) => error.id !== newErrorId)))
    }
}

const showActionPopup = (info) => {
    return async (dispatch, getState) => {
        const newId = uuid()

        let waitActive = true
        let result = null

        const onResult = (_result) => {
            result = _result
            waitActive = false
        }

        dispatch(
            show_action_popup({
                ...info,
                id: newId,
                onResult: createCallback(onResult)
            })
        )

        while (waitActive) {
            await waitFor(100)
        }

        return result
    }
}

export { showError, showActionPopup }
