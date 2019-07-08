import React, { Component } from "react";
import RouterAuth from "../components/RouterAuth";
import { Layout, Menu, Icon, Breadcrumb, Dropdown } from "antd";
import { connect } from "dva";
import "./IndexLayout.less";
import { withRouter, Link } from "dva/router";
import menuConfig from "../config/menuConfig";

const { Sider, Header, Content } = Layout;

class IndexLayout extends Component {
  state = {
    openKey: localStorage.getItem("openKey") || "",
    selectedKey: localStorage.getItem("selectedKey") || "",
    hideMenu: false,
    basePath: "/admin"
  }
  componentDidMount() {
    this.setState({
      basePath: this.props.username === "admin" ? "/admin" : "/merchant"
    });
  }
  menuClick({ item, key }) {
    this.props.history.push(`/${key}`);
  }
  toggleMenu() {
    this.setState({
      hideMenu: !this.state.hideMenu
    });
  }
  logout() {
    this.props.dispatch({
      type: "auth/logout"
    });
  }
  render() {
    const { username, breadcrumb, history } = this.props;
    let menus;
    if (username === "") {
      history.push("/login");
      return (<div></div>);
    } else if (username === "admin") {
      menus = menuConfig.adminMenus;
    } else {
      menus = menuConfig.merchantMenus;
    }
    const selectedKey = this.props.selectedKey || menus[0].name;
    return (
      <Layout className="home">
        <Sider
          trigger={ null }
          className="ng-nav"
          width="256"
          collapsible
          collapsed={ this.state.hideMenu }>
          <div className="logo"></div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={ [selectedKey] }
            onClick={ e => { this.menuClick(e); } }
          >
            {
              menus.map((item, j) => {
                return <Menu.Item
                  key={ item.name }>
                  <Icon type={ item.icon } />
                  <span>{ item.label }</span>
                </Menu.Item>;
              })
            }
          </Menu>
        </Sider>
        <Layout className="ng-content">
          <Header
            className="ng-header">
            <Icon
              type={ this.state.hideMenu ? "menu-unfold" : "menu-fold" }
              onClick={ () => { this.toggleMenu(); } } />
            <span style={ { float: "right", marginRight: "222px" } }>
              欢迎您，
              <Dropdown
                overlay={ (
                  <Menu>
                    <Menu.Item
                      key={ 1 }
                      onClick={ () => { this.logout(); } }>退出登录</Menu.Item>
                  </Menu>
                ) }
                trigger={["click"]}>
                <div style={{ float: "right", cursor: "pointer" }}>
                  { this.props.username } <Icon type="down" />
                </div>
              </Dropdown>
            </span>
          </Header>
          <Content
            className="main"
            style={{ paddingTop: "64px" }}>
            <div className="ng-breadcrumb">
              所在位置：
              <Breadcrumb className="breadcrumb">
                {
                  breadcrumb.map(item => {
                    if (item.path) {
                      return (
                        <Breadcrumb.Item key={ item.label }>
                          <Link to={ item.path }>{ item.label }</Link>
                        </Breadcrumb.Item>
                      );
                    } else {
                      return <Breadcrumb.Item key={ item.label }>{ item.label }</Breadcrumb.Item>;
                    }
                  })
                }
              </Breadcrumb>
            </div>
            <div className="main-scroll">
              <div className="main-view">
                <RouterAuth />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(connect(({ auth }) => {
  return {
    username: auth.username,
    breadcrumb: auth.breadcrumb,
    selectedKey: auth.selectedKey
  };
})(IndexLayout));