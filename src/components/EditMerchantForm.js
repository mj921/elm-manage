import React, { Component } from "react";
import { updateMerchantApi } from "../services/merchantApi";
import { message, Form, Input, Button } from "antd";
import { validPhone, validPassword, validNum, validInt } from "../utils/validators";
import UploadQiniu from "./UploadQiniu";
import ChoiceMap from "./ChoiceMap";

export default class EditMerchantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longitude: props.longitude || "",
      latitude: props.latitude || ""
    };
  }
  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        updateMerchantApi({ ...values, id: this.props.id, longitude: this.state.longitude || this.props.fields.longitude || "", latitude: this.state.latitude || this.props.fields.latitude || "" }).then(() => {
          message.success("编辑成功");
          this.props.history.push(this.props.backUrl || "/merchant-manage");
        });
      }
    });
  }
  positionChange(position) {
    this.setState({
      longitude: position.location.lng + "",
      latitude: position.location.lat + ""
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
    const validArea = function(rule, value, callback) {
      if (!value || value.length > 1) {
        callback();
      } else {
        callback("请至少选择省市两级");
      }
    };
    return (
      <div className="form-content">
        <Form
          className="form-main"
          labelCol={ labelCol }
          wrapperCol={ wrapperCol }>
          <Form.Item label="商户名称">
            {
              getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入商户名称"  }]
              })(<Input maxLength={ 20 } />)
            }
          </Form.Item>
          <Form.Item label="商户手机号">
            {
              getFieldDecorator("phone", {
                rules: [
                  { required: true, message: "请输入商户手机号"  },
                  { validator: validPhone }
                ]
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label="商户logo">
            {
              getFieldDecorator("logo")(<UploadQiniu />)
            }
          </Form.Item>
          <Form.Item label="登录密码">
            {
              getFieldDecorator("password", {
                rules: [
                  { required: true, message: "请输入登录密码"  },
                  { validator: validPassword }
                ]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label="商户地址">
            {
              getFieldDecorator("position", {
                rules: [
                  { required: true, message: "请选择商户地址"  },
                  { validator: validArea }
                ]
              })(
                <ChoiceMap onChange={ (value, position) => { this.positionChange(position); } } />
              )
            }
          </Form.Item>
          <Form.Item label="详细地址">
            {
              getFieldDecorator("address")(
                <Input.TextArea />
              )
            }
          </Form.Item>
          <Form.Item label="配送费">
            {
              getFieldDecorator("distributionFee", {
                rules: [
                  { required: true, message: "请输入配送费"  },
                  { validator: validNum }
                ]
              })(
                <Input suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="起送价">
            {
              getFieldDecorator("startDistributionFee", {
                rules: [
                  { required: true, message: "请输入起送价"  },
                  { validator: validNum }
                ]
              })(
                <Input suffix="元" />
              )
            }
          </Form.Item>
          <Form.Item label="配送时间">
            {
              getFieldDecorator("distributionTime", {
                rules: [
                  { required: true, message: "请输入配送时间"  },
                  { validator: validInt }
                ]
              })(
                <Input suffix="分钟" />
              )
            }
          </Form.Item>
          <Form.Item label="距离">
            {
              getFieldDecorator("distance", {
                rules: [
                  { required: true, message: "请输入距离"  },
                  { validator: validInt }
                ]
              })(
                <Input suffix="m" />
              )
            }
          </Form.Item>
          <Form.Item
            wrapperCol={ { span: 24 } }
            style={ { textAlign: "center" } }>
            <Button
              type="primary"
              style={ { marginRight: "5px" } }
              onClick={ () => { this.save(); } }>保存</Button>
            <Button onClick={ () => { this.props.history.push(this.props.backUrl || "/merchant-manage"); } }>取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}