import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, Navigate} from 'react-router-dom'

import { Container, Row, Col, Card, CardBody, Label, FormGroup, Button, Alert } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import { registerUser } from '../../redux/actions';
import { isUserAuthenticated } from '../../helpers/authUtils';
import LoaderWidget from '../../components/Loader';
import logo from '../../assets/images/logo-dark.png';

class Register extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Handles the submit
     */
    handleValidSubmit = (event, values) => {
        this.props.registerUser(values.fullname, values.email, values.password);
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

    /**
     * Redirect to confirm
     */
    renderRedirectToConfirm = () => {
        return <Navigate to='/confirm' />;
    }

    render() {
        const isAuthTokenValid = isUserAuthenticated();
        return (
            <React.Fragment>

                {this.renderRedirectToRoot()}

                {Object.keys(this.props.user || {}).length > 0 && this.renderRedirectToConfirm()}

                {(this._isMounted || !isAuthTokenValid) && <div className="account-pages mt-5 mb-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={5}>
                                <Card>
                                    <CardBody className="p-4 position-relative">
                                        <div className="text-center w-75 m-auto">
                                            <Link to="/">
                                                <span><img src={logo} alt="" height="18" /></span>
                                            </Link>
                                            <p className="text-muted mb-4 mt-3">Don't have an account? Create your own account, it takes less than a minute</p>
                                        </div>


                                        { /* preloader */}
                                        {this.props.loading && <LoaderWidget />}

                                        {this.props.error && <Alert color="danger" isOpen={this.props.error ? true : false}>
                                            <div>{this.props.error}</div>
                                        </Alert>}

                                        <AvForm onValidSubmit={this.handleValidSubmit}>
                                            <AvField name="fullname" label="Full Name" placeholder="Enter your name" required />

                                            <AvField type="email" name="email" label="Email address" placeholder="Enter your email" required />

                                            <AvGroup>
                                                <Label for="password">Password</Label>
                                                <AvInput type="password" name="password" id="password" placeholder="Enter your password" required />
                                                <AvFeedback>This field is invalid</AvFeedback>
                                            </AvGroup>

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
                                <p className="text-muted">Already have an account? <Link to="/login" className="text-muted ml-1"><b>Sign In</b></Link></p>
                            </Col>
                        </Row>
                    </Container>
                </div>}
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default connect(mapStateToProps, { registerUser })(Register);
