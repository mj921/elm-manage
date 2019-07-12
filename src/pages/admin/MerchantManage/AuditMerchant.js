import React, { Component } from "react";
import { Form, Input, Button, message, Card, Radio } from "antd";
import { withRouter } from "dva/router";
import { getMerchantApi, auditMerchantApi } from "../../../services/merchantApi";
import { MerchantStatus } from "../../../config/Enums";

class AuditForm extends Component {
  state = {
    materialList: []
  }
  audit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        auditMerchantApi({ ...values, id: this.props.id }).then(() => {
          message.success("审核成功");
          this.props.history.push("/merchant-manage");
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const labelCol = {
      span: 6
    };
    const wrapperCol = {
      span: 16
    };
    return (
      <Form
        className="form-main"
        labelCol={ labelCol }
        wrapperCol={ wrapperCol }>
        <Form.Item label="审核结果">
          {
            getFieldDecorator("status", {
              rules: [{ required: true, message: "请选择审核结果" }]
            })(
              <Radio.Group>
                <Radio value={ MerchantStatus.WaitOpen }>审核通过</Radio>
                <Radio value={ MerchantStatus.AuditFalied }>审核不通过</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        <Form.Item label="审核备注">
          {
            getFieldDecorator("auditRemark")(
              <Input.TextArea maxLength={ 255 } />
            )
          }
        </Form.Item>
        <Form.Item
          wrapperCol={ { span: 24 } }
          style={ { textAlign: "center" } }>
          <Button
            type="primary"
            style={ { marginRight: "5px" } }
            onClick={ () => { this.audit(); } }>审核</Button>
          <Button onClick={ () => { this.props.history.push("/merchant-manage"); } }>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}

class AuditMerchant extends Component {
  componentDidMount() {
    this.getMerchant();
  }
  state = {
    fields: {
      name: "",
      phone: "",
      address: "",
      logo: "",
      password: "",
      distributionFee: "",
      distributionTime: "",
      startDistributionFee: "",
      distance: ""
    }
  }
  fieldsChange(fields) {
    this.setState({
      fields: { ...this.state.fields, ...fields }
    });
  }
  getMerchant() {
    getMerchantApi(this.props.match.params.id)
    .then(res =>
      this.setState({
        fields: { ...res.data }
      }));
  }
  render () {
    const AuditMerchantForm = Form.create()(AuditForm);
    const labelCol = {
      span: 6
    };
    const wrapperCol = {
      span: 16
    };
    return (
      <div>
        <Card
          title="商户详情"
          className="form-content">
          <Form
            className="form-main"
            labelCol={ labelCol }
            wrapperCol={ wrapperCol }>
            <Form.Item label="商户名称">{ this.state.fields.name }</Form.Item>
            <Form.Item label="商户手机号">{ this.state.fields.phone }</Form.Item>
            <Form.Item label="商户logo">
              <img
                style={{ width: "200px", height: "200px" }}
                src={ this.state.fields.logo }
                alt="logo" />
            </Form.Item>
            <Form.Item label="登录密码">{ this.state.fields.password }</Form.Item>
            <Form.Item label="商户地址">{ this.state.fields.address }</Form.Item>
            <Form.Item label="配送费">{ this.state.fields.distributionFee }</Form.Item>
            <Form.Item label="起送价">{ this.state.fields.startDistributionFee }</Form.Item>
            <Form.Item label="配送时间">{ this.state.fields.distributionTime }</Form.Item>
            <Form.Item label="距离">{ this.state.fields.distance }</Form.Item>
          </Form>
        </Card>
        <Card
          title="审核"
          className="form-content"
          style={{ marginTop: "24px" }}>
          <AuditMerchantForm
            id={ this.props.match.params.id || 0 }
            history={ this.props.history } />
        </Card>
      </div>
    );
  }
}

export default withRouter(AuditMerchant);