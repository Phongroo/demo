import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, Navigate} from 'react-router-dom'

import { Container, Row, Col, Card, CardBody, } from 'reactstrap';

import { isUserAuthenticated } from '../../helpers/authUtils';
import logo from '../../assets/images/logo-dark.png';

class Confirm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Redirect to root
     */
    renderRedirectToRoot = () => {
        const isAuthTokenValid = isUserAuthenticated();
        if (isAuthTokenValid) {
            return <Navigate to='/' />
        }
    }

    render() {
        const isAuthTokenValid = isUserAuthenticated();
        return (
            <React.Fragment>

                {this.renderRedirectToRoot()}

                {(this._isMounted || !isAuthTokenValid) && <div className="account-pages mt-5 mb-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={5}>
                                <Card>
                                    <CardBody className="p-4 position-relative">
                                        <div className="text-center w-75 m-auto">
                                            <a href="/">
                                                <span><img src={logo} alt="" height="18" /></span>
                                            </a>
                                        </div>
                                        <div className="text-center m-auto">
                                            <h4 className="mt-3">Please check your email</h4>
                                            <p className="text-muted mt-2"> A email has been send to <span className="font-weight-medium">youremail@domain.com</span>.
                                                Please check for an email from company and click on the included link to
                                        reset your password. </p>

                                            <p className="text-center">
                                                <Link className="btn btn-primary" to="/login">Back to Login</Link>
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>}
            </React.Fragment>
        )
    }
}

export default connect()(Confirm);
