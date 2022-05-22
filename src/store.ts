import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";


import { userReducer } from "slice";
import { api } from "api";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
    blacklist: [api.reducerPath],
    // transforms: [
    //   encryptTransform({
    //     secretKey: "secretKey",
    //     onError: function (error) {
    //       notification.error({ message: error.message });
    //     },
    //   }),
    // ],
};

const rootReducer = combineReducers({
    user: userReducer,

    [api.reducerPath]: api.reducer
  });

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const errorHandleMiddleware: Middleware = (api: MiddlewareAPI) => (next: any) => (action: any) => {
    if (isRejectedWithValue(action) && action?.payload?.status === 400) {
        console.log(action.payload, "400")
    } else if (isRejectedWithValue(action) && action?.payload?.status === 401) {
        console.log(action.payload, "401")
    } else if (isRejectedWithValue(action) && action?.payload?.status === 403) {
        console.log(action.payload, "403")
    } else if (isRejectedWithValue(action) && action?.payload?.status === 404) {
        console.log(action.payload, "404")
    } else if (isRejectedWithValue(action)) {
        console.log(action.payload, "")
    }
    return next(action);
};

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        }).concat(api.middleware, errorHandleMiddleware),
    devTools: true,
})

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
export default store;