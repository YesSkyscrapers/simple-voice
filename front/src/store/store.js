import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import appReducer from './reducers/appReducer'

const rootReducer = combineReducers({
    app: appReducer
})

const store = configureStore({ reducer: rootReducer })

export { store }
