import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import { isUserAuthenticated, permissionList } from "./helpers/authUtils";

// lazy load all the views
const Dashboard = React.lazy(() => import("./pages/dashboards/"));

// auth
const Login = React.lazy(() => import("./pages/auth/Login"));


// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			const isAuthTokenValid = isUserAuthenticated();
			console.log("isAuthTokenValid", isAuthTokenValid);
			if (!isAuthTokenValid) {
				// not logged in so redirect to login page with the return url
				return <Navigate to={{ pathname: "/login", state: { from: props.location } }} />;
			}

			// authorised so return component
			return <Component {...props} />;
		}}
	/>
);

const routes = (
	<Routes>
		<Route path="/login" element={<Login />} />
		{/*<Route path="/logout" element={<Logout />} />*/}
		<PrivateRoute path="/dashboard" element={<Dashboard />} />
		<Route path="/" element={<Navigate to="/dashboard" replace />} />
	</Routes>
);
export { routes, PrivateRoute };
