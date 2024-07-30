import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Navigate} from 'react-router-dom'
import {Alert, Button, Card, CardBody, Col, Container, FormGroup, Label, Row} from 'reactstrap';
import {AvFeedback, AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';

import {loginUser} from '../../redux/actions';
import {isUserAuthenticated} from '../../helpers/authUtils';
import Loader from '../../components/Loader';
import logo from '../../assets/images/logo-light.png';
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

class Login extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.state = {
            username: 'DuyHN4',
            password: 'Aa123456@',
            windowDimensions: getWindowDimensions()
        }

    }

    componentDidMount() { //onnit
        this._isMounted = true;
    }

    componentWillUnmount() { //destroy
        this._isMounted = false;
    }

    /**
     * Handles the submit
     */
    handleValidSubmit = (event, values) => {

        this.props.dispatch(loginUser(values.username, values.password));
    }


    /**
     * Redirect to root
     */
    renderRedirectToRoot = () => {
        const isAuthTokenValid = isUserAuthenticated();
        if (isAuthTokenValid) {
            return <Navigate to='/'/>
        }
    }

    render() {
        const isAuthTokenValid = isUserAuthenticated();
        return (
            <React.Fragment>

                {this.renderRedirectToRoot()}

                {(this._isMounted || !isAuthTokenValid) && <div className="account-pages" style={{height: this.state.windowDimensions.height}}>
                    <Container>
                        <Row className="justify-content-center auth-bg-cover pt-lg-5">
                            <Col lg={10} className="mt-5">
                                <Card className="overflow-hidden">
                                    <Row>
                                        <Col lg={6} className="pr-0">
                                            <div className="p-3 auth-one-bg h-100">
                                                <div class="bg-overlay"></div>
                                                <div class="position-relative h-100 d-flex flex-column">
                                                    <div class="mb-4">
                                                        <a class="d-block">
                                                            <img src={logo} alt="" width="100"/>
                                                        </a>
                                                    </div>
                                                    <div class="mt-auto pl-3 pr-3 pb-3">
                                                        <div class="mb-3">
                                                            <i class="fas fa-quote-left display-4 text-logan"></i>
                                                        </div>

                                                        <div id="qoutescarouselIndicators" class="carousel slide" data-bs-ride="carousel">
                                                            <p class="fs-15 fst-italic">"Ngân hàng thương mại cổ phần Á Châu (ACB)"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6} className="pl-0">
                                            <div class="p-4">
                                                <div class="row">
                                                    <div class="col-12">
                                                        <h5 class="text-primary">Chào mừng quay trở lại!</h5>
                                                        <p class="text-muted">Đăng nhập để tiếp tục sử dụng hệ thống NWF.</p>
                                                    </div>
                                                </div>
                                                <div class="mt-1">
                                                    <h3 class="text-center text-primary">HỆ THỐNG NEW WORK FLOW</h3>
                                                    { /* preloader */}
                                                    {this.props.loading && <Loader/>}

                                                    {this.props.error &&
                                                        <Alert color="danger" isOpen={this.props.error ? true : false}>
                                                            <div>{this.props.error}</div>
                                                        </Alert>}

                                                    <AvForm onValidSubmit={this.handleValidSubmit}>
                                                        <AvField name="username" label="Tên đăng nhâp" placeholder="Nhập tên đăng nhập"
                                                                value={this.state.username} required/>

                                                        <AvGroup>
                                                            <Label for="password">Mật khẩu</Label>
                                                            <AvInput type="password" name="password" id="password"
                                                                    placeholder="Nhập mật khẩu" value={this.state.password} required/>
                                                            <AvFeedback>Mật khẩu bắt buộc</AvFeedback>
                                                        </AvGroup>
                                                        <Row className="mt-1">
                                                            <Col className="col-12 text-right">
                                                                <p><Link to="/forget-password" className="text-muted ml-1">Quên mật khẩu?</Link></p>
                                                            </Col>
                                                        </Row>
                                                        <FormGroup>
                                                            <Button color="primary" className="btn-block">Đăng nhập</Button>
                                                        </FormGroup>
                                                    </AvForm>
                                                    <div class="mt-5 text-center">
                                                        <p class="mb-0">Don't have an account ? <a href="javascript:void(0)"
                                                            class="fw-semibold text-primary text-decoration-underline"> Signup</a> </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    {/* <CardBody className="p-4 position-relative">
                                        <div className="text-center w-75 m-auto">
                                            <a href="/">
                                                <span><img src={logo} alt="" height="18"/></span>
                                            </a>
                                            <p className="text-muted mb-4 mt-3">Enter your email address and password to
                                                access admin panel.</p>
                                        </div>



                                    </CardBody> */}
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>}
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    const {user, loading, error} = state.Auth;
    console.log('mapStateToProps', loading)
    return {user, loading, error};
};

export default connect(mapStateToProps )(Login);
