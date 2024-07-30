import React, { Component, Suspense } from 'react';
import {BrowserRouter, Route, Navigate} from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { routes } from './routes';

// Setup fake backend
import { isUserAuthenticated, permissionList } from './helpers/authUtils';

// Themes
import './assets/scss/DefaultTheme.scss';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Global from "./utils/global";

// Lazy loading and code splitting
const loading = () => <div></div>

// All layouts/containers
const NonAuthLayout = Loadable({
    loader: () => import('./components/NonAuthLayout'),
    loading
});

const AuthLayout = Loadable({
    loader: () => import('./components/AuthLayout'),
    loading
});

// Higher Order Component for applying layout
const withLayout = (WrappedComponent) => {
    const HOC = class extends Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    return connect()(HOC);
}

// Main App component
class App extends Component {
    // Get layout based on user authentication
    getLayout = () => {
        return isUserAuthenticated() ? AuthLayout : NonAuthLayout;
    }

    render() {
        return (
            // Render the router with layout
            <BrowserRouter>
                <React.Fragment>
                    <ToastContainer />
                    {routes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                roles={route.roles}
                                render={(props) => {
                                    let Layout = this.getLayout();
                                    console.log('route', route?.path, route.route !== Route)

                                    if (route.route !== Route) {
                                        const perList = JSON.parse(JSON.stringify(permissionList()))
                                        if (perList && perList?.length > 0) {
                                            const list = [];
                                            perList?.map(x => {
                                                list.push(x)
                                                x?.menuChilds?.map(z => {
                                                    list.push(z)
                                                    return z
                                                })
                                                return x
                                            })

                                            const permission = list?.find(x => x?.path === route?.path)?.permissionByMenu
                                            Global.setPermission(permission)
                                            console.log('permission', permission)
                                            if (permission?.VIEW !== 'Y') {
                                                Layout = AuthLayout;
                                                return <Navigate to="/" />
                                            }
                                        }
                                    } else {
                                        Layout = NonAuthLayout;
                                    }

                                    return (
                                        <Suspense fallback={loading()}>
                                            <Layout {...props}>
                                                <route.component {...props} />
                                            </Layout>
                                        </Suspense>
                                    );
                                }}
                            />
                        );
                    })}
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated
    }
}

export default connect(mapStateToProps, null)(App);
