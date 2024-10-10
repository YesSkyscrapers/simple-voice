import {
    UPDATE_SHOWING_ERROR,
    UPDATE_SHOW_LOADER,
    SHOW_ACTION_POPUP,
    HIDE_ACTION_POPUP,
    SHOW_ACTION_FORM,
    HIDE_ACTION_FORM
} from '../constants/appConstants'

const initialState = {
    errors: [],
    showLoader: false,
    actionPopups: [],
    actionForms: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SHOWING_ERROR:
            return {
                ...state,
                errors: action.payload.errors
            }
        case UPDATE_SHOW_LOADER:
            return {
                ...state,
                showLoader: action.payload.state
            }
        case SHOW_ACTION_POPUP: {
            return {
                ...state,
                actionPopups: state.actionPopups.concat([action.payload.info])
            }
        }
        case HIDE_ACTION_POPUP: {
            return {
                ...state,
                actionPopups: state.actionPopups.filter((item) => item.id !== action.payload.id)
            }
        }
        case SHOW_ACTION_FORM: {
            return {
                ...state,
                actionForms: state.actionForms.concat([action.payload.info])
            }
        }
        case HIDE_ACTION_FORM: {
            return {
                ...state,
                actionForms: state.actionForms.filter((item) => item.id !== action.payload.id)
            }
        }
        default:
            return state
    }
}

export default reducer
