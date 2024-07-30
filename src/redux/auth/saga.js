// @flow
import {Cookies} from "react-cookie";
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';

import {FORGET_PASSWORD, LOGIN_USER, LOGOUT_USER, PERMISSION, REGISTER_USER} from '../../constants/actionTypes';


import {
    forgetPasswordFailed,
    forgetPasswordSuccess,
    getPermissionFailed,
    getPermissionSuccess,
    loginUserFailed,
    loginUserSuccess,
    registerUserFailed,
    registerUserSuccess
} from './actions';
import configApi from "../../utils/api";
import {forgeEncryptRSA} from "../../utils/crypto";
import {authUser} from "../../helpers/authUtils";
import {Toast, TypeToast} from "../../utils/app.util";


/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: "include",
}) => {
    return fetch(url, options)
        .then(response => {

            let headerObj = {};
            const keys = response.headers.keys();
            let header = keys.next();
            while (header.value) {
                headerObj[header.value] = response.headers.get(header.value);
                header = keys.next();
            }

            console.log(headerObj)

            if (!response.status === 200) {
                throw response.json();
            }
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch(error => {
            console.log('fetchJSON err', error)
            throw error
        });
}


/**
 * Sets the session
 * @param {*} user
 */
const setSession = (user) => {
    if (user)
        localStorage.setItem("user", JSON.stringify(user));
    else
        localStorage.removeItem("user");
};

const setPermission = (permission) => {
    if (permission)
        localStorage.setItem("permission", JSON.stringify(permission));
    else
        localStorage.removeItem("permission");
};

const setAppSession = (sessionId) => {
    let cookies = new Cookies();
    if (sessionId)
        cookies.set("session-id", sessionId, {path: "/"});
    else
        cookies.remove("session-id");
};

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({payload: {username, password}}) {
    const options = {
        body: JSON.stringify({}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };


    // const response = yield call(fetchJSON, api.LOGIN, options);
    // setSession(response);
    // yield put(loginUserSuccess(response));

    let permissions;
    try {
        permissions = yield call(fetchJSON, configApi.API_GET_PERMISSION, options);
    } catch (e) {
        return;
    }

    const permissionKey = permissions.ID;
    if (permissionKey) {

        setAppSession(permissions.SID);

        // yield put(fetchPermissionSuccess,{
        //     permissionKey: permissionKey,
        // });

        const encryptedData = forgeEncryptRSA(
            JSON.stringify({
                email: username,
                password: password,
                userType: "O",
                language: "vi"
            }),
            permissionKey
        );

        const loginOptions = {
            body: JSON.stringify({data: encryptedData}),
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'X-Session': permissions.SID}
        };

        try {
            const response = yield call(fetchJSON, configApi.API_LOGIN, loginOptions);
            console.log('API_LOGIN res', response)
            if (response.hasOwnProperty('id')) {
                setSession(response);
                yield put(loginUserSuccess(response));
            } else {
                Toast(response?.message, TypeToast.ERROR)
                yield put(loginUserFailed(response?.message));
                setSession(null);

            }
        } catch (error) {
            console.log('error login', error)
            let message;
            switch (error.status) {
                case 500:
                    message = 'Internal Server Error';
                    break;
                case 401:
                    message = 'Invalid credentials';
                    break;
                default:
                    message = error;
            }
            yield put(loginUserFailed(message));
            setSession(null);
        }
    }
}


/**
 * Logout the user
 * @param {*} param0
 */
function* logout({payload: {history}}) {
    try {
        setSession(null);
        yield call(() => {
            history.push("/login");
        });
    } catch (error) {
    }
}

/**
 * Register the user
 */
function* register({payload: {fullname, email, password}}) {
    const options = {
        body: JSON.stringify({fullname, email, password}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = yield call(fetchJSON, '/users/register', options);
        yield put(registerUserSuccess(response));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(registerUserFailed(message));
    }
}

/**
 * forget password
 */
function* forgetPassword({payload: {username}}) {
    const options = {
        body: JSON.stringify({username}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = yield call(fetchJSON, '/users/password-reset', options);
        yield put(forgetPasswordSuccess(response.message));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(forgetPasswordFailed(message));
    }
}

function* getPermission({payload: {routerLink}}) {
    const userInfo = authUser();
    const options = {
        body: JSON.stringify({routerLink, userId: userInfo?.id}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        // const response = yield call(fetchJSON, api.LOGIN, options);
        // setSession(response);
        // yield put(loginUserSuccess(response));

        let permissions = yield call(fetchJSON, configApi.GET_PERMISSION, options);

        if (permissions?.VIEW === "Y") {
            setPermission(permissions);
            yield put(getPermissionSuccess(permissions));
        } else {

            yield put(getPermissionFailed);
        }
    } catch (error) {
        console.log('error', error)
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(getPermissionFailed(message));
        setPermission(null);
    }
}


export function* watchLoginUser(): any {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser(): any {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser(): any {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword(): any {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

export function* watchPermission(): any {
    yield takeEvery(PERMISSION, getPermission);
}

function* authSaga(): any {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
        fork(watchPermission),
    ]);
}

export default authSaga;
