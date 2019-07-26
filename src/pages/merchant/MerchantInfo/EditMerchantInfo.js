import React, { Component } from "react";
import { Form } from "antd";
import { withRouter } from "dva/router";
import { getMerchantApi } from "../../../services/merchantApi";
import EditMerchantForm from "../../../components/EditMerchantForm";
import { connect } from "dva";

const EditForm = Form.create({
  mapPropsToFields(props) {
    const fields = {};
    Object.keys(props.fields).forEach(key => {
      fields[key] = Form.createFormField({
        ...props.fields[key],
        value: (props.fields[key] && typeof props.fields[key] === "object") ? props.fields[key].value : props.fields[key]
      });
    });
    return fields;
  },
  onFieldsChange(props, fields) {
    props.onChange(fields);
  }
})(EditMerchantForm);

class EditMerchant extends Component {
  componentDidMount() {
    this.getMerchant();
  }
  state = {
    fields: {
      name: "",
      phone: "",
      position: "",
      longitude: "",
      latitude: "",
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
    getMerchantApi(this.props.id)
    .then(res => {
      this.setState({
        fields: { ...res.data }
      });
    });
  }
  render () {
    return <EditForm
      fields={ this.state.fields }
      onChange={ fields => { this.fieldsChange(fields); } }
      history={ this.props.history }
      id={ this.props.id || 0 }
      latitude={ this.state.latitude }
      longitude={ this.state.longitude }
      backUrl="/merchant-info" />;
  }
}

export default withRouter(connect(({ auth }) => ({
  id: auth.userInfo.id || 0
}))(EditMerchant));