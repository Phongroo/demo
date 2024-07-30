import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Navigate} from 'react-router-dom'

import { logoutUser } from '../../redux/actions';
import request from "../../utils/request";
import api from "../../utils/api";
import { authUser } from '../../helpers/authUtils';
// import { UserInfoSelector } from '../../redux/auth/selector';

class Logout extends Component {
    constructor(props) {
        super(props);
    }
    /**
     * Redirect to login
     */
    renderRedirectToLogin = () => {
        // emit the event

        request
            .post(api.API_LOGOUT, {
                userCode: authUser().code,
            })
            .then((res) => {
            });
        this.props.dispatch(logoutUser())
        return <Navigate to='/login' />;
    }

    render() {
        return (<React.Fragment>
            {this.renderRedirectToLogin()}
        </React.Fragment>)
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.Auth?.user
    }
}

export default connect(mapStateToProps )(Logout);
