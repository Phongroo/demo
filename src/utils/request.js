/* eslint-disable quotes */

import { authUser } from "../helpers/authUtils";
import { Cookies } from "react-cookie";

/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = (url, options = {}) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			...options,
			method: "GET",
			headers: getHeaders(),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.code) {
					reject(new Error(data.message));
				} else {
					resolve(data);
				}
			})
			.catch((error) => {
				return error;
			});
	});
};

const getReturnText = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            ...options,
            method: "GET",
            headers: getHeaders(),
        })
            .then((res) => res.text())
            .then((data) => {
                if (data.code) {
                    reject(new Error(data.message));
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @returns {Promise<R>}
 */
const post = (url, data = {}, method = "POST", contentType = "") => {
	const auth = authUser();
	let headers = getHeaders(auth?.tokenId);
	if (data) {
		// const language = stateRedux.common.language;
		// data.language = language;
		data.userId = auth?.id;
		data.userCode = auth?.code;
	}

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: method,
			headers: headers,
			body: JSON.stringify(data),
		})
			.then((response) => {
				if ([200, 400].includes(response.status)) {
					return response.json();
				} else {
					if ([401, 409].includes(response.status)) {
						// storeRedux.dispatch(ReduxActions.auth.logOut({}));
						// storeRedux.dispatch(
						//   ReduxActions.common.setNotiGlobal({
						//     text: t("text:conflict_session_msg"),
						//     popupType: "error",
						//   })
						// );
					}
					reject(response);
				}
			})
			.then((data) => {
				// console.log('data123', data);
				resolve(data);
			})
			.catch((error) => {
				console.log(error);
				reject(error);
			});
	});
};

const postToExport = (url, data = {}, method = "POST", contentType = "") => {
	const auth = authUser();
	let headers = getHeaders(auth?.tokenId);
	if (data) {
		// const language = stateRedux.common.language;
		// data.language = language;
		data.userId = auth?.id;
		data.userCode = auth?.code;
	}

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: method,
			headers: headers,
			body: JSON.stringify(data),
		})
			.then((response) => {
				if ([200, 400].includes(response.status)) {
					return response.blob();
				} else {
					if ([401, 409].includes(response.status)) {
						// storeRedux.dispatch(ReduxActions.auth.logOut({}));
						// storeRedux.dispatch(
						//   ReduxActions.common.setNotiGlobal({
						//     text: t("text:conflict_session_msg"),
						//     popupType: "error",
						//   })
						// );
					}
					reject(response);
				}
			})
			.then((data) => {
				// console.log('data123', data);
				resolve(data);
			})
			.catch((error) => {
				console.log(error);
				reject(error);
			});
	});
};

const postFormData = (url, data = new FormData(), method = "POST", headers = "") => {
	const auth = authUser();
	// let headers = getHeaders(auth?.token);
	if (data) {
		data.userId = auth?.user?.id;
	}

	const payload ={
		method: method,
		body: data,
	}

	if (headers) {
		payload.headers = headers
	}

	return new Promise((resolve, reject) => {
		fetch(url, payload)
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((error) => {
				console.log(error);
				reject(error);
			});
	});
};

const getHeaders = (tokenId) => {
	let cookies = new Cookies();
	const sessionId = cookies.get("session-id");
	return {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json ",
		// Referer: "Mobile",
		"X-Token": `${tokenId}`,
		"X-Session": `${sessionId}`,
		// "Access-Control-Allow-Origin": "*",
		// "Access-Control-Expose-Headers": "*",
		// "Access-Control-Allow-Credentials": "true",
	};
};

export default {
	get,
    getReturnText,
	post,
	postFormData,
	postToExport,
	put: (url, data) => post(url, data, "PUT"),
};
