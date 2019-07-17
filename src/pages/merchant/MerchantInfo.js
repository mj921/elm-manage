import React, { Component } from "react";
import { Form, Card, Button, message } from "antd";
import { getMerchantApi, updateMerchantStatusApi } from "../../services/merchantApi";
import { connect } from "dva";
import { MerchantStatus } from "../../config/Enums";

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
      distance: "",
      score: 0,
      monthSale: 0
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
  open() {
    updateMerchantStatusApi({
      id: this.props.id,
      status: MerchantStatus.Open
    }).then(() => {
      message.success("开业成功");
      this.props.dispatch({
        type: "auth/updateStatus",
        payload: MerchantStatus.Open
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
    const { userInfo } = this.props;
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
              {
                userInfo.status === MerchantStatus.WaitOpen ?
                  (<Button
                    type="primary"
                    style={{ marginRight: "5px" }}
                    onClick={ () => { this.open(); }}>正式营业</Button>) : ""
              }
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
            <Form.Item label="月售">{ merchant.monthSale }</Form.Item>
            <Form.Item label="评分">{ merchant.score }</Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}
export default connect(({ auth }) => ({
  id: auth.userInfo.id || 0,
  userInfo: auth.userInfo
}))(MerchantInfo);
