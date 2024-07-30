// @flow
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILED,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAILED,
    FETCH_PERMISSION_SUCCESS,
    PERMISSION,
    PERMISSION_SUCCESS,
    PERMISSION_FAILED
} from '../../constants/actionTypes';

// Định nghĩa kiểu AuthAction cho Flow
type AuthAction = { type: string, payload: {} | string };

export const fetchPermissionSuccess = (permissionKey: string): AuthAction => ({
    type: FETCH_PERMISSION_SUCCESS,
    payload: {
        permissionKey
    }
});

export const loginUser = (username: string, password: string): AuthAction => ({
    type: LOGIN_USER,
    payload: { username, password }
});

export const loginUserSuccess = (user: {}): AuthAction => ({
    type: LOGIN_USER_SUCCESS,
    payload: user
});

export const loginUserFailed = (error: string): AuthAction => ({
    type: LOGIN_USER_FAILED,
    payload: error
});

export const checkPermission = (routerLink: string): AuthAction => ({
    type: PERMISSION,
    payload: { routerLink }
});

export const getPermissionSuccess = (permission: {}): AuthAction => ({
    type: PERMISSION_SUCCESS,
    payload: permission
});

export const getPermissionFailed = (error: string): AuthAction => ({
    type: PERMISSION_FAILED,
    payload: error
});

export const registerUser = (fullname: string, email: string, password: string): AuthAction => ({
    type: REGISTER_USER,
    payload: { fullname, email, password }
});

export const registerUserSuccess = (user: {}): AuthAction => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
});

export const registerUserFailed = (error: string): AuthAction => ({
    type: REGISTER_USER_FAILED,
    payload: error
});

export const logoutUser = (history: any): AuthAction => ({
    type: LOGOUT_USER,
    payload: { history }
});

export const forgetPassword = (username: string): AuthAction => ({
    type: FORGET_PASSWORD,
    payload: { username }
});

export const forgetPasswordSuccess = (passwordResetStatus: string): AuthAction => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus
});

export const forgetPasswordFailed = (error: string): AuthAction => ({
    type: FORGET_PASSWORD_FAILED,
    payload: error
});
