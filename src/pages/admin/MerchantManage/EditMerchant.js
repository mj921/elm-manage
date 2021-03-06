import React, { Component } from "react";
import { Form } from "antd";
import { withRouter } from "dva/router";
import { getMerchantApi } from "../../../services/merchantApi";
import EditMerchantForm from "../../../components/EditMerchantForm";

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
      address: "",
      position: "",
      longitude: "",
      latitude: "",
      logo: "",
      password: "",
      distributionFee: "",
      distributionTime: "",
      startDistributionFee: "",
      distance: ""
    },
    initFlag: false
  }
  fieldsChange(fields) {
    this.setState({
      fields: { ...this.state.fields, ...fields }
    });
  }
  getMerchant() {
    getMerchantApi(this.props.match.params.id)
    .then(res => {
      this.setState({
        fields: { ...res.data }
      }, () => {
        this.setState({
          initFlag: true
        });
      });
    });
  }
  render () {
    return <EditForm
      fields={ this.state.fields }
      onChange={ fields => { this.fieldsChange(fields); } }
      history={ this.props.history }
      id={ this.props.match && this.props.match.params.id || 0 }
      initFlag={ this.state.initFlag } />;
  }
}

export default withRouter(EditMerchant);