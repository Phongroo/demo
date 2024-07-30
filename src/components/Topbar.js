import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import logoSm from '../assets/images/logo-sm-white.png';
import logo from '../assets/images/logo-light.png';
import profilePic from '../assets/images/users/avatar-1.jpg';
import { authUser } from "../helpers/authUtils";
import request from "../utils/request";
import api from "../utils/api";


const Notifications = [{
  id: 1,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 2,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 3,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 4,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
},
{
  id: 5,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 6,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 7,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 8,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
}];

const ProfileMenus = [{
  label: 'My Account',
  icon: 'remixicon-account-circle-line',
  redirectTo: "/",
},
{
  label: 'Settings',
  icon: 'remixicon-settings-3-line',
  redirectTo: "/"
},
{
  label: 'Support',
  icon: 'remixicon-wallet-line',
  redirectTo: "/"
},
{
  label: 'Lock Screen',
  icon: 'remixicon-lock-line',
  redirectTo: "/"
},
{
  label: 'Logout',
  icon: 'remixicon-logout-box-line',
  redirectTo: "/logout",
  hasDivider: true
}]


class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: authUser()?.fullName,
      // userId: authUser()?.id,
      listNoti: []
    };

  }

  // componentDidMount() {
  //   this.getNotifications();
  //   setInterval(this.getNotifications, 30000);
  //
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  showLog(){
    console.log('aaa');
  }


  getNotifications = ()=> {
    const json = {
      userId:authUser()?.id
    };

    request.post(api.GET_NOTIFICATION, json).then((res) => {
      if (res.data) {
        this.setState({
          listNoti: res?.data
        })
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="navbar-custom">
          <ul className="list-unstyled topnav-menu float-right mb-0">

            <li className="d-none d-sm-block">
              <form className="app-search">
                <div className="app-search-box">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <div className="input-group-append">
                      <button className="btn" type="submit">
                        <i className="fe-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </li>

            <li className="dropdown d-none d-lg-block">
              <LanguageDropdown />
            </li>

            <li className="dropdown notification-list">
              <NotificationDropdown notifications={this.state?.listNoti} />
            </li>

            <li className="dropdown notification-list">
              <ProfileDropdown profilePic={profilePic} menuItems={ProfileMenus} username={this.state.username} />
            </li>


            {/* <li className="dropdown notification-list">
              <button className="btn btn-link nav-link right-bar-toggle waves-effect waves-light" onClick={this.props.rightSidebarToggle}>
                <i className="fe-settings noti-icon"></i>
              </button>
            </li> */}
          </ul>

          <div className="logo-box">
            <Link to="/" className="logo text-center">
              <span className="logo-lg">
                <img src={logo} alt="" />
              </span>
              <span className="logo-sm">
                <img src={logoSm} alt="" height="40" />
              </span>
            </Link>
          </div>

          <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
            <li>
              <button className="button-menu-mobile waves-effect waves-light" onClick={this.props.menuToggle}>
                <i className="fe-menu"></i>
              </button>
            </li>

            <li className="dropdown d-none d-lg-block">
              <UncontrolledDropdown>
                <DropdownToggle
                  data-toggle="dropdown"
                  tag="button"
                  className="btn btn-link nav-link dropdown-toggle waves-effect waves-light">
                  Tạo nhanh
                  <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                  <Link to="/" className="dropdown-item">
                    <i className="fe-briefcase mr-1"></i>
                    <span>Tạo người dùng</span>
                  </Link>
                  <Link to="/" className="dropdown-item">
                    <i className="fe-user mr-1"></i>
                    <span>Tạo phòng ban</span>
                  </Link>
                  <Link to="/" className="dropdown-item">
                    <i className="fe-bar-chart-line- mr-1"></i>
                    <span>Tạo vai trò</span>
                  </Link>
                  <Link to="/" className="dropdown-item">
                    <i className="fe-settings mr-1"></i>
                    <span>Cài đặt</span>
                  </Link>
                  <DropdownItem divider />
                  <Link to="/" className="dropdown-item">
                    <i className="fe-headphones mr-1"></i>
                    <span>Hỏi & Hỗ trợ</span>
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
          </ul>
        </div>
      </React.Fragment >
    );
  }
}


export default connect()(Topbar);

