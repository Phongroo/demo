import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import request from '../utils/request';
import api from '../utils/api';

const notificationContainerStyle = {
    'maxHeight': '230px'
};


class NotificationDropdown extends Component {

    static defaultProps = {
        notifications: [],
        numNotView: 0
    }

    constructor(props) {
        super(props);
        this.toggleDropdown = this.toggleDropdown.bind(this);

        this.state = {
            dropdownOpen: false,
            notifications: [],
            numNotView: 0
        };
    }


    componentDidMount() {
        console.log(this.props.notifications);
    }

    componentDidUpdate(prevProps) {
        if (this.props.notifications != prevProps.notifications) {
            const numNotiNotView = this.props.notifications.filter(x => x.isView === 'N').length;
            //this.set = numNotiNotView;
            this.setState({
                ...this.state,
                numNotView: numNotiNotView
            })
        }
    }

    viewNoti = (item,index) => {
        const json = {
            id: item?.id
        };

        request.post(api.UPDATE_VIEW_NOTIFICATION, json).then((res) => {
            this.setState({
                ...this.state,
                numNotView: this.state.numNotView - 1
            })
        });
    }

    /*:: toggleDropdown: () => void */
    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    getRedirectUrl = (item) => {
        return `/notification/${item.id}`;
    }

    render() {

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle
                    data-toggle="dropdown"
                    tag="button"
                    className="nav-link dropdown-toggle arrow-none btn btn-link" onClick={this.toggleDropdown} aria-expanded={this.state.dropdownOpen}>
                    <i className="fe-bell noti-icon"></i>
                    <span className="badge badge-danger rounded-circle noti-icon-badge">{this.state.numNotView}</span>
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-animated dropdown-lg">
                    <div onClick={this.toggleDropdown}>
                        <div className="dropdown-item noti-title">
                            <h5 className="m-0">
                                <span className="float-right">
                                    {/* <Link to="/notifications" className="text-dark">
                                        <small>Clear All</small>
                                    </Link> */}
                                </span>Thông báo
                            </h5>
                        </div>
                        <PerfectScrollbar style={notificationContainerStyle}>
                            {this.props.notifications.map((item, i) => {

                                return (<div className="dropdown-item notify-item" key={i + "-noti"} onClick={() => { this.viewNoti(item,i) }}>
                                    <div className={`notify-icon bg-${item.bgColor}`}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <p className="notify-details">{item.text} {item.isView == 'N' && <span
                                            style={{
                                                display: 'inline-block',
                                                width: '5px',
                                                height: '5px',
                                                backgroundColor: 'red',
                                                borderRadius: '50%',
                                                float:'right'
                                            }}
                                        />}
                                        <small className="text-muted">{item.subText}</small>
                                        
                                    </p>
                                </div>)
                            })}
                        </PerfectScrollbar>

                        {/* <Link to="/" className="dropdown-item text-center text-primary notify-item notify-all">View All</Link> */}
                    </div>
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export default NotificationDropdown;