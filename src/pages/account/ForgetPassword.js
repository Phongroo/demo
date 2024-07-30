import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, Navigate} from 'react-router-dom'

import { Container, Row, Col, Card, CardBody, FormGroup, Button, Alert } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/Loader';
import logo from '../../assets/images/logo-dark.png';
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

class ForgetPassword extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.state = {
            passwordResetSuccessful: false,
            isLoading: false,
            windowDimensions: getWindowDimensions()
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * On error dismiss
     */
    onDismiss() {
        this.setState({ passwordResetSuccessful: false });
    }

    /**
     * Handles the submit
     */
    handleValidSubmit = (event, values) => {
        console.log(values);

        this.setState({ isLoading: true });

        // You can make actual api call to register here

        window.setTimeout(() => {
            this.setState({ isLoading: false, passwordResetSuccessful: 'We have sent you an email containing a link to reset your password' });
        }, 1000)
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

                {(this._isMounted || !isAuthTokenValid) && <div className="account-pages" style={{height: this.state.windowDimensions.height}}>
                    <Container>
                        <Row className="justify-content-center  pt-lg-5">
                            <Col lg={5}>
                                <Card>
                                    <CardBody className="p-4 position-relative">
                                        <div className="text-center w-75 m-auto">
                                            <a href="/">
                                                <span><img src={logo} alt="" height="40" /></span>
                                            </a>
                                            <p className="text-muted mb-4 mt-3">Enter your email address and we'll send you an email with instructions to reset your password.</p>
                                        </div>

                                        { /* preloader */ }
                                        {this.state.isLoading && <Loader />}

                                        <Alert color="success" isOpen={this.state.passwordResetSuccessful} toggle={this.onDismiss}>
                                            {this.state.passwordResetSuccessful}
                                        </Alert>

                                        <AvForm onValidSubmit={this.handleValidSubmit}>
                                            <AvField type="email" name="email" label="Email address" placeholder="Enter your email" required />

                                            <FormGroup>
                                                <Button color="primary" className="btn-block">Submit</Button>
                                            </FormGroup>
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-1">
                            <Col className="col-12 text-center">
                                <p className="text-muted">Back to <Link to="/login" className="text-muted ml-1"><b>Sign In</b></Link></p>
                            </Col>
                        </Row>
                    </Container>
                </div>}
            </React.Fragment>
        )
    }
}

export default connect()(ForgetPassword);
