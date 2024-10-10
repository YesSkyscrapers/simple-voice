import {
    HIDE_ACTION_FORM,
    HIDE_ACTION_POPUP,
    SHOW_ACTION_FORM,
    SHOW_ACTION_POPUP,
    UPDATE_SHOWING_ERROR,
    UPDATE_SHOW_LOADER
} from '../constants/appConstants'

const update_showing_error = (errors) => {
    return {
        type: UPDATE_SHOWING_ERROR,
        payload: {
            errors
        }
    }
}

const toggle_loader = (state) => {
    return {
        type: UPDATE_SHOW_LOADER,
        payload: {
            state
        }
    }
}

const show_action_popup = (info) => {
    return {
        type: SHOW_ACTION_POPUP,
        payload: {
            info
        }
    }
}

const hide_action_popup = (id) => {
    return {
        type: HIDE_ACTION_POPUP,
        payload: {
            id
        }
    }
}

const show_action_form = (info) => {
    return {
        type: SHOW_ACTION_FORM,
        payload: {
            info
        }
    }
}

const hide_action_form = (id) => {
    return {
        type: HIDE_ACTION_FORM,
        payload: {
            id
        }
    }
}

export { update_showing_error, toggle_loader, show_action_popup, hide_action_popup, show_action_form, hide_action_form }
