import React, { Component } from "react";
import { Form, Input, Table, Button, Card, Modal, message, Select, Icon, Tooltip } from "antd";
import { enumsToList } from "../../utils";
import { DishStatus } from "../../config/Enums";
import { Page } from "../../config";
import { getDishsApi, deleteDishApi, updateDishStatusApi } from "../../services/dishApi";
import { connect } from "dva";

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
  const statusList = enumsToList("DishStatus");
  return (
    <Form layout="inline">
      <Form.Item label="菜品名称">
        {
          getFieldDecorator("name", {
            initialValue: ""
          })(
            <Input allowClear />
          )
        }
      </Form.Item>
      <Form.Item label="菜品状态">
        {
          getFieldDecorator("status", {
            initialValue: DishStatus.All
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

class DishManage extends Component {
  componentDidMount() {
    this.getDataSource();
  }
  state = {
    fields: {
      name: {
        value: ""
      },
      status: {
        value: DishStatus.All
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
    getDishsApi(Object.assign(obj, {
      current: this.state.current,
      pageSize: this.state.pageSize,
      merchantId: this.props.merchantId
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
          value: DishStatus.All
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
        deleteDishApi(id).then(() => {
          message.success("删除成功");
          this.getDataSource();
        });
      }
    });
  }
  editRow(id) {
    this.props.history.push(`/dish-manage/edit/${id}`);
  }
  onOk(type) {
    this.setState({
      [`${type}Visible`]: false
    });
    this.getDataSource();
  }
  changeStatus(id, status) {
    updateDishStatusApi({
      id,
      status
    }).then(() => {
      message.success(`${status === DishStatus.Disabled ? "下架" : "上架"}成功`);
      this.getDataSource();
    });
  }
  render() {
    const columns = [{
      dataIndex: "id",
      title: "序号",
      align: "center"
    }, {
      dataIndex: "name",
      title: "菜品名称",
      align: "center"
    }, {
      dataIndex: "price",
      title: "菜品价格",
      align: "center"
    }, {
      dataIndex: "type",
      title: "菜品类别",
      align: "center"
    }, {
      dataIndex: "img",
      title: "菜品图片",
      align: "center",
      render(text) {
        return <img
          src={ text }
          style={{ width: "50px", height: "50px" }}
          alt="img" />;
      }
    }, {
      dataIndex: "introduce",
      title: "菜品描述",
      align: "center",
      width: 150,
      render(text) {
        return (
          <Tooltip title={ text }>
            <div style={{ width: "150px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{ text }</div>
          </Tooltip>
        );
      }
    }, {
      dataIndex: "monthSale",
      title: "月售",
      align: "center"
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
              <Button
                type="link"
                size="small"
                onClick={ () => { this.changeStatus(record.id, 1 - record.status); } }
              >{ record.status === 0 ? "上架" : "下架" }</Button>
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
            title="菜品管理"
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={ () => { this.props.history.push("/dish-manage/add"); } }>添加菜品</Button>
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

export default connect(({ auth }) => ({
  merchantId: auth.userInfo.id
}))(DishManage);