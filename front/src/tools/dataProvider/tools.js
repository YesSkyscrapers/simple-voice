import { showError } from '../../store/actions/appActions'
import { store } from '../../store/store'
import cacheManager, { CACHE_KEYS } from '../cacheManager'
import { waitFor } from '../tools'
import dataProvider from './dataProvider'

const basicFetch = (url, params, methodParams = { ignoreErrorHandler: false }) => {
    return fetch(url, params)
        .then((res) => {
            return waitFor(1).then(() => res)
        })
        .then((res) => {
            return res.json().catch((err) => {
                return res.text()
            })
        })
        .then((res) => {
            if (res?.error === 'Unauthorized') {
                window.location.reload()
            } else {
                if (!methodParams.ignoreErrorHandler && res?.error) {
                    throw res?.error
                } else {
                    return res
                }
            }
        })
        .catch((err) => {
            store.dispatch(showError(err))
        })
}

const makeAction = (props) => {
    const { url, action, data, ignoreErrorHandler } = props

    return basicFetch(
        url,
        {
            method: 'POST',
            body: JSON.stringify({
                action,
                data: data ? data : {}
            })
        },
        {
            ignoreErrorHandler: ignoreErrorHandler
        }
    )
}

const getDefaultActionUrl = (url) => {
    return `${url}/action`
}

export { makeAction, getDefaultActionUrl }
