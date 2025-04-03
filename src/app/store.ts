import { persistReducer, persistStore } from 'redux-persist';

import authReducer from '../features/auth/authSlice';
import branchReducer from '../features/branch/branchSlice';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import facilityReducer from '../features/facility/facilitySlice';
import paymentReducer from '../features/payment/paymentSlice';
import storage from 'redux-persist/lib/storage';
import subscriptionReducer from '../features/subscription/subscriptionSlice';
import userReducer from '../features/user/userSlice';
import userSubscriptionReducer from '../features/userSubscription/userSubscriptionSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'user', 'branch', 'facility', 'payment', 'subscription', 'userSubscription'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    branch: branchReducer,
    facility: facilityReducer,
    payment: paymentReducer,
    subscription: subscriptionReducer,
    userSubscription: userSubscriptionReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
