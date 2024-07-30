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
    PERMISSION,
    PERMISSION_SUCCESS,
    PERMISSION_FAILED
} from '../../constants/actionTypes';

import { authUser } from '../../helpers/authUtils';

const INIT_STATE = {
    user: authUser(),
    loading: false,
    isLoadingPermissionPage: false
};

type AuthAction = { type: string, payload: {} | string };
type State = { user?: {} | null, loading?: boolean, isLoadingPermissionPage?: boolean, error?: string, passwordResetStatus?: string };

const Auth = (state: State = INIT_STATE, action: AuthAction) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };
        case LOGIN_USER_FAILED:
            return { ...state, error: action.payload, loading: false };
        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };
        case REGISTER_USER_FAILED:
            return { ...state, error: action.payload, loading: false };
        case LOGOUT_USER:
            return { ...state, user: null };
        case FORGET_PASSWORD:
            return { ...state, loading: true };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, passwordResetStatus: action.payload, loading: false, error: null };
        case FORGET_PASSWORD_FAILED:
            return { ...state, error: action.payload, loading: false };
        case PERMISSION:
            return { ...state, isLoadingPermissionPage: true };
        case PERMISSION_SUCCESS:
            return { ...state, isLoadingPermissionPage: false };
        case PERMISSION_FAILED:
            return { ...state, isLoadingPermissionPage: false };
        default:
            return { ...state };
    }
}

export default Auth;
