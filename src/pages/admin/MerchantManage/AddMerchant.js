import React, { Component } from "react";
import { Form, Input, Button, message, Cascader } from "antd";
import { withRouter } from "dva/router";
import UploadQiniu from "../../../components/UploadQiniu";
import { addMerchantApi } from "../../../services/merchantApi";
import { validPhone, validPassword, validNum, validInt } from "../../../utils/validators";
import { getAreasApi } from "../../../services/areaApi";

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.getAreas(-1, res => {
      this.setState({
        areaList: res.data.map(item => ({
          label: item.name,
          value: item.id,
          level: item.level,
          isLeaf: false
        }))
      });
    });
  }
  state = {
    materialList: [],
    areaList: []
  }
  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        addMerchantApi({ ...values, provinceId: values.area[0], cityId: values.area[1], areaId: values.area[2] || 0 }).then(() => {
          message.success("添加成功");
          this.props.history.push("/merchant-manage");
        });
      }
    });
  }
  getAreas(parentId, callback) {
    getAreasApi(parentId).then(callback);
  }
  loadArea(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.getAreas(targetOption.value, res => {
      targetOption.loading = false;
      targetOption.children = res.data.map(item => ({
        label: item.name,
        value: item.id,
        level: item.level,
        isLeaf: targetOption.level === 2
      }));
      this.setState({
        areaList: [...this.state.areaList]
      });
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
              getFieldDecorator("logo", {
                rules: [{ required: true, message: "请上传商户logo"  }]
              })(<UploadQiniu />)
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
              getFieldDecorator("area", {
                rules: [
                  { required: true, message: "请选择商户地址"  },
                  { validator: validArea }
                ]
              })(
                <Cascader
                  options={ this.state.areaList }
                  loadData={ targetOptions => { this.loadArea(targetOptions); } }
                  placeholder=""
                  changeOnSelect />
              )
            }
          </Form.Item>
          <Form.Item label="详细地址">
            {
              getFieldDecorator("address", {
                rules: [{ required: true, message: "请输入详细地址"  }]
              })(
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
            <Button onClick={ () => { this.props.history.push("/merchant-manage"); } }>取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AddMerchant = Form.create()(AddForm);

export default withRouter(AddMerchant);