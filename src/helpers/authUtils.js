/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
    const user = authUser();
    if (!user) {
        return false;
    }

    const decoded = user?.tokenId;
    const currentTime = Date.now() / 1000;
    // console.log(currentTime, decoded?.exp)
    // if (decoded?.exp < currentTime) {
    //     console.warn('access token expired');
    //     return false;
    // }

    return true;
}

/**
 * Returns the logged in user
 */
const authUser = () => {
    const user = localStorage.getItem("user");
    return user ? (typeof (user) == 'object' ? user : JSON.parse(user)) : null;
}

const permissionList = () => {
    const per = localStorage.getItem("permission");
    return per ? (typeof (per) == 'object' ? per : JSON.parse(per)) : null;
}

export {isUserAuthenticated, authUser, permissionList};
