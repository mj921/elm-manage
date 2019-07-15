import React, { Component } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { withRouter } from "dva/router";
import UploadQiniu from "../../../components/UploadQiniu";
import { addDishApi } from "../../../services/dishApi";
import { validNum } from "../../../utils/validators";
import { getMerchantTypesApi } from "../../../services/merchantApi";
import { connect } from "dva";

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.getTypes();
  }
  state = {
    materialList: [],
    typeList: [],
    tagList: [],

  }
  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        addDishApi({ ...values, merchantId: this.props.merchantId }).then(() => {
          message.success("添加成功");
          this.props.history.push("/dish-manage");
        });
      }
    });
  }
  getTypes() {
    getMerchantTypesApi(this.props.merchantId)
    .then(res => {
      this.setState({
        typeList: res.data
      });
      this.setState({
        tagList: res.data
      });
    });
  }
  typeSearch(value) {
    if (value) {
      const tagList = this.state.typeList.filter(item => item.indexOf(value) > -1);
      if (this.state.typeList.indexOf(value) === -1) {
        tagList.unshift(value);
      }
      this.setState({
        tagList
      });
    } else {
      this.setState({
        tagList: this.state.typeList
      });
    }
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
      <div className="form-content">
        <Form
          className="form-main"
          labelCol={ labelCol }
          wrapperCol={ wrapperCol }>
          <Form.Item label="菜品名称">
            {
              getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入菜品名称"  }]
              })(<Input maxLength={ 20 } />)
            }
          </Form.Item>
          <Form.Item label="菜品价格">
            {
              getFieldDecorator("price", {
                rules: [
                  { required: true, message: "请输入菜品价格"  },
                  { validator: validNum }
                ]
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label="菜品类别">
            {
              getFieldDecorator("type", {
                rules: [
                  { required: true, message: "请选择菜品类别"  }
                ]
              })(
                <Select
                  showSearch
                  onSearch={ value => { this.typeSearch(value); } }
                >
                  {
                    this.state.tagList.map(item => <Select.Option key={ item }>{ item }</Select.Option>)
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="菜品图片">
            {
              getFieldDecorator("img", {
                rules: [{ required: true, message: "请上传菜品图片"  }]
              })(<UploadQiniu />)
            }
          </Form.Item>
          <Form.Item label="菜品描述">
            {
              getFieldDecorator("introduce", {
                rules: [{ required: true, message: "请输入菜品描述"  }]
              })(
                <Input.TextArea maxLength={ 150 } />
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
            <Button onClick={ () => { this.props.history.push("/dish-manage"); } }>取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AddDish = Form.create()(AddForm);

export default withRouter(connect(({ auth }) => ({
  merchantId: +auth.userInfo.id
}))(AddDish));