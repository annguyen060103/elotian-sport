// src/hooks/useAuth.ts

import type { AppDispatch, RootState } from '../app/store';
import { clearAuth, loginUser, logoutUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

import { TOKEN_KEY } from '../constants/env';
import { useEffect } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const login = (username: string, password: string, onSuccess?: () => void) => {
        dispatch(loginUser({ username, password }))
            .unwrap()
            .then((data) => {
                const token = data.result.token;
                console.log('Auth State after login:', {
                    token,
                    isAuthenticated: data.result.authenticated,
                });

                // Lưu vào sessionStorage
                sessionStorage.setItem(TOKEN_KEY, token);

                if (onSuccess) onSuccess();
            })
            .catch((err) => {
                console.error('Login Error:', err);
            });
    };

    const logout = () => {
        dispatch(logoutUser());
        dispatch(clearAuth());
        sessionStorage.removeItem(TOKEN_KEY);
    };


    useEffect(() => {
        const token = sessionStorage.getItem(TOKEN_KEY);
        if (token && !auth.isAuthenticated) {
            console.log('Found token in session:', token);

        }
    }, []);

    return {
        ...auth,
        login,
        logout,
    };
};
