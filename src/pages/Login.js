import React, { Component } from "react";
import LoginStyle from "./Login.less";
import { Form, Input, Icon, Button } from "antd";
import { withRouter } from "dva/router";
import { connect } from "dva";

class LoginForm extends React.Component {
  login() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "auth/login",
          payload: values
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className="login-form">
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "请输入用户名" }],
          })(
            <Input
              prefix={<Icon
                type="user"
                style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }],
          })(
            <Input
              prefix={<Icon
                type="lock"
                style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className={ LoginStyle.button }
            onClick={ () => { this.login(); } }>
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default class Login extends Component {
  render() {
    const WrappedLoginForm = Form.create()(withRouter(connect()(LoginForm)));
    return (
      <div className={ LoginStyle.login }>
        <div className={ LoginStyle.title }>欢迎您</div>
        <WrappedLoginForm />
      </div>
    );
  }
}
