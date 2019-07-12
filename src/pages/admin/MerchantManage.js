import React, { Component } from "react";
import { Form, Input, Table, Button, Card, Modal, message, Select, Icon, Tooltip } from "antd";
import { enumsToList } from "../../utils";
import { BaseStatus, MerchantStatus } from "../../config/Enums";
import { Page } from "../../config";
import { getMerchantsApi, deleteMerchantApi, updateMerchantStatusApi } from "../../services/merchantApi";

const SearchForm = Form.create({
  onFieldsChange(props, changeFields) {
    props.onChange(changeFields);
  },
  mapPropsToFields(props) {
    const fields = {};
    Object.keys(props.fields).forEach(key => {
      fields[key] = Form.createFormField({
        ...props.fields[key],
        value: props.fields[key].value
      });
    });
    return fields;
  }
})(props => {
  const { getFieldDecorator } = props.form;
  const statusList = enumsToList("BaseStatus");
  return (
    <Form layout="inline">
      <Form.Item label="商户名称">
        {
          getFieldDecorator("name", {
            initialValue: ""
          })(
            <Input allowClear />
          )
        }
      </Form.Item>
      <Form.Item label="商户状态">
        {
          getFieldDecorator("status", {
            initialValue: BaseStatus.All
          })(
            <Select style={ { width: "176px" } }>
              {
                statusList.map(item => {
                  return <Select.Option
                    value={ item.value }
                    key={ item.value }>{ item.label }</Select.Option>;
                })
              }
            </Select>
          )
        }
      </Form.Item>
    </Form>
  );
});

class MerchantManage extends Component {
  componentDidMount() {
    this.getDataSource();
  }
  state = {
    fields: {
      name: {
        value: ""
      },
      status: {
        value: BaseStatus.All
      }
    },
    dataSource: [],
    total: 0,
    current: Page.current,
    pageSize: Page.pageSize,
    addVisible: false,
    editVsible: false
  }
  searchFormChange(fields) {
    this.setState({
      fields: { ...this.state.fields, ...fields }
    });
  }
  getDataSource() {
    const obj = this.refs.searchForm ? this.refs.searchForm.getFieldsValue() : {};
    Object.keys(obj).forEach(key => {
      obj[key] = obj[key] === undefined ? "" : obj[key];
    });
    this.setState({
      loading: true
    });
    getMerchantsApi(Object.assign(obj, {
      current: this.state.current,
      pageSize: this.state.pageSize
    })).then(res => {
      this.setState({
        dataSource: res.data.list,
        total: res.data.page.total,
        loading: false
      });
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }
  resetSearchForm() {
    this.setState({
      fields: {
        name: {
          value: ""
        },
        status: {
          value: BaseStatus.All
        }
      }
    },
    this.getDataSource);
  }
  tableChagen(pagination) {
    this.setState({
      pageSize: pagination.pageSize,
      current: pagination.current
    }, this.getDataSource);
  }
  delRow(id) {
    Modal.confirm({
      title: "提示",
      content: "是否确定删除？",
      onOk: () => {
        deleteMerchantApi(id).then(() => {
          message.success("删除成功");
          this.getDataSource();
        });
      }
    });
  }
  editRow(id) {
    this.props.history.push(`/merchant-manage/edit/${id}`);
  }
  onOk(type) {
    this.setState({
      [`${type}Visible`]: false
    });
    this.getDataSource();
  }
  changeStatus(id, status) {
    updateMerchantStatusApi({
      id,
      status
    }).then(() => {
      message.success(`${status === MerchantStatus.Disabled ? "封禁" : "解封"}成功`);
      this.getDataSource();
    });
  }
  audit(id) {
    this.props.history.push(`/merchant-manage/audit/${id}`);
  }
  render() {
    const columns = [{
      dataIndex: "id",
      title: "序号",
      align: "center"
    }, {
      dataIndex: "name",
      title: "商户名称",
      align: "center"
    }, {
      dataIndex: "phone",
      title: "商户手机号",
      align: "center"
    }, {
      dataIndex: "address",
      title: "商户地址",
      align: "center",
      render(text, record) {
        return (
          <Tooltip title={ (record.areaName ? record.areaName + " " : "") + text }>
            <span style={{ width: "100px", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ (record.areaName ? record.areaName + " " : "") + text }</span>
          </Tooltip>
        );
      }
    }, {
      dataIndex: "logo",
      title: "商户logo",
      align: "center",
      render(text) {
        return <img
          src={ text }
          style={{ width: "50px", height: "50px" }}
          alt="img" />;
      }
    }, {
      dataIndex: "distributionFee",
      title: "配送费",
      align: "center",
      render(text) {
        return <span>{ text } 元</span>;
      }
    }, {
      dataIndex: "startDistributionFee",
      title: "起送价",
      align: "center",
      render(text) {
        return <span>{ text } 元</span>;
      }
    }, {
      dataIndex: "distributionTime",
      title: "配送时间",
      align: "center",
      render(text) {
        const h = ~~(text / 60);
        const m = text % 60;
        return <span>{ h > 0 ? h + " 小时" : "" }{ m } 分钟 </span>;
      }
    }, {
      dataIndex: "distance",
      title: "距离",
      align: "center",
      render(text) {
        return <span>{ text < 1000 ? text + " m" : (text / 1000).toFixed(1) + " km" }</span>;
      }
    }, {
      dataIndex: "statusStr",
      title: "状态",
      align: "center"
    }, {
      dataIndex: "operation",
      title: "操作",
      render: (text, record) => {
        return (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={ () => { this.editRow(record.id); } }
            >编辑</Button>
            {
              record.status === MerchantStatus.WaitAudit ?
                <Button
                  type="link"
                  size="small"
                  onClick={ () => { this.audit(record.id); } }
                >审核</Button> :
                (record.status === MerchantStatus.WaitOpen || record.status === MerchantStatus.Open || record.status === MerchantStatus.Rest ?
                  <Button
                    type="link"
                    size="small"
                    onClick={ () => { this.changeStatus(record.id, MerchantStatus.Disabled); } }
                  >封禁</Button> :
                  (record.status === MerchantStatus.Disabled ?
                    <Button
                      type="link"
                      size="small"
                      onClick={ () => { this.changeStatus(record.id, MerchantStatus.WaitOpen); } }
                    >解封</Button> : ""))
            }
            <Button
              type="link"
              size="small"
              onClick={ () => { this.delRow(record.id); } }
            >删除</Button>
          </React.Fragment>
        );
      }
    }];
    const pagination = { pageSizeOptions: Page.pageSizeOptions, showQuickJumper: Page.showQuickJumper, pageSize: this.state.pageSize, total: this.state.total, showSizeChanger: Page.showSizeChanger, hideOnSinglePage: Page.hideOnSinglePage };
    const loading = {
      delay: 200,
      indicator: <Icon
        type="loading"
        style={{ fontSize: 24 }}
        spin />,
      spinning: this.state.loading
    };
    return (
      <div>
        <div className="search-form">
          <Card
            title="查询条件"
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={ () => { this.getDataSource(); } }>查询</Button>
                <Button onClick={ () => { this.resetSearchForm(); } }>重置</Button>
              </div>
            }>
            <SearchForm
              ref="searchForm"
              fields={ this.state.fields }
              onChange={ fields => { this.searchFormChange(fields); } } />
          </Card>
        </div>
        <div className="table-list">
          <Card
            title="商户管理"
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={ () => { this.props.history.push("/merchant-manage/add"); } }>添加商户</Button>
              </div>
            }>
            <Table
              size="small"
              rowKey="id"
              bordered
              dataSource={ this.state.dataSource }
              columns={ columns }
              pagination={ pagination }
              onChange={ pagination => { this.tableChagen(pagination); } }
              loading={ loading }></Table>
          </Card>
        </div>
      </div>
    );
  }
}

export default MerchantManage;