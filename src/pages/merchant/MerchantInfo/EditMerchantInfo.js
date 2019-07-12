import React, { Component } from "react";
import { Form } from "antd";
import { withRouter } from "dva/router";
import { getMerchantApi } from "../../../services/merchantApi";
import EditMerchantForm from "../../../components/EditMerchantForm";
import { connect } from "dva";

class EditMerchant extends Component {
  componentDidMount() {
    this.getMerchant();
  }
  state = {
    fields: {
      name: "",
      phone: "",
      address: "",
      logo: "",
      area: [],
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
    .then(res =>
      this.setState({
        fields: { ...res.data, area: [res.data.provinceId || 0, res.data.cityId || 0, res.data.areaId || 0] }
      }));
  }
  render () {
    const EditForm = Form.create({
      mapPropsToFields(props) {
        const fields = {};
        Object.keys(props.fields).forEach(key => {
          fields[key] = Form.createFormField({
            ...props.fields[key],
            value: (typeof props.fields[key] === "object" && !(props.fields[key] instanceof Array)) ? props.fields[key].value : props.fields[key]
          });
        });
        return fields;
      },
      onFieldsChange(props, fields) {
        props.onChange(fields);
      }
    })(EditMerchantForm);
    return <EditForm
      fields={ this.state.fields }
      onChange={ fields => { this.fieldsChange(fields); } }
      history={ this.props.history }
      id={ this.props.id || 0 }
      backUrl="/merchant-info" />;
  }
}

export default withRouter(connect(({ auth }) => ({
  id: auth.userInfo.id || 0
}))(EditMerchant));