import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './slices'

import { api } from '../infra/api'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>