import React, { Component } from "react";
import { Form, Card, Button } from "antd";
import { getMerchantApi } from "../../services/merchantApi";
import { connect } from "dva";

class MerchantInfo extends Component {
  constructor(props) {
    super(props);
    this.getMerchant();
  }
  state = {
    merchant: {
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
  getMerchant() {
    getMerchantApi(this.props.id)
    .then(res => {
      this.setState({
        merchant: { ...res.data }
      });
    });
  }
  get distributionTime() {
    const time = this.state.merchant.distributionTime;
    if (time) {
      const h = ~~(time / 60);
      const m = time % 60;
      return `${ h > 0 ? h + " 小时" : "" }${ m } 分钟`;
    } else {
      return time !== 0 ? "-" : 0;
    }
  }
  render() {
    const { merchant } = this.state;
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
          className="form-content"
          extra={
            <div>
              <Button
                type="primary"
                onClick={ () => { this.props.history.push("/merchant-info/edit"); }}>编辑</Button>
            </div>
          }>
          <Form
            className="form-main"
            labelCol={ labelCol }
            wrapperCol={ wrapperCol }>
            <Form.Item label="商户名称">{ merchant.name }</Form.Item>
            <Form.Item label="商户手机号">{ merchant.phone }</Form.Item>
            <Form.Item label="商户logo">
              <img
                style={{ width: "200px", height: "200px" }}
                src={ merchant.logo }
                alt="logo" />
            </Form.Item>
            <Form.Item label="登录密码">{ merchant.password }</Form.Item>
            <Form.Item label="商户地址">{ merchant.address }</Form.Item>
            <Form.Item label="配送费">{ merchant.distributionFee } 元</Form.Item>
            <Form.Item label="起送价">{ merchant.startDistributionFee } 元</Form.Item>
            <Form.Item label="配送时间">{ this.distributionTime }</Form.Item>
            <Form.Item label="距离">{ merchant.distance < 1000 ? merchant.distance + " m" : (merchant.distance / 1000).toFixed(1) + " km" }</Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}
export default connect(({ auth }) => ({
  id: auth.userInfo.id || 0
}))(MerchantInfo);
