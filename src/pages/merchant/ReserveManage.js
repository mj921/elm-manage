import React, { Component } from "react";
import { Form, Table, Button, Card, Modal, message, Select, Icon, DatePicker } from "antd";
import { enumsToList } from "../../utils";
import { DishStatus } from "../../config/Enums";
import { Page } from "../../config";
import { updateDishStatusApi } from "../../services/dishApi";
import { connect } from "dva";
import moment from "moment";

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
      <Form.Item label="预定时间">
        {
          getFieldDecorator("date", {
            initialValue: moment()
          })(
            <DatePicker allowClear />
          )
        }
      </Form.Item>
      <Form.Item label="预定状态">
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
      <Form.Item label="餐桌类型">
        {
          getFieldDecorator("type", {
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
    editVsible: false,
    loading: false
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
    });const list = [];
    for (let i = 0; i < 10; i++) {
      const t = Math.floor(Math.random() * 10000) + 57600;
      const status = Math.floor(Math.random() * 2);
      const type = i < 9 ? 0 : 1;
      list.push({
        tableNum: i + 1,
        type,
        maxPeople: (type + 1) * 4,
        reserveTime: moment().startOf("day").add(t, "seconds").format("YYYY-MM-DD HH:mm:ss"),
        status
      });
    }
    this.setState({
      dataSource: list,
      total: 16
    });
    // this.setState({
    //   loading: true
    // });
    // getDishsApi(Object.assign(obj, {
    //   current: this.state.current,
    //   pageSize: this.state.pageSize,
    //   merchantId: this.props.merchantId
    // })).then(res => {
    //   this.setState({
    //     dataSource: res.data.list,
    //     total: res.data.page.total,
    //     loading: false
    //   });
    // }).catch(() => {
    //   this.setState({
    //     loading: false
    //   });
    // });
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
      content: "是否确定取消预定？",
      onOk: () => {
        message.success("取消预定成功");
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
      dataIndex: "tableNum",
      title: "餐桌序号",
      align: "center"
    }, {
      dataIndex: "type",
      title: "餐桌类型",
      align: "center",
      render: (text, record) => {
        return (
          <span>
            { text === 0 ? "小桌" : (text === 1 ? "中桌" : "大桌") }
          </span>
        );
      }
    }, {
      dataIndex: "maxPeople",
      title: "最多可坐人数",
      align: "center"
    }, {
      dataIndex: "status",
      title: "预定状态",
      align: "center",
      render: (text, record) => {
        return (
          <span>{ record.status === 0 ? "未预定" : "已预订" }</span>
        );
      }
    }, {
      dataIndex: "reserveTime",
      title: "预定时间",
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
              disabled={ record.status === 1 }
              onClick={ () => { this.editRow(record.id); } }
            >取消预定</Button>
            <Button
              type="link"
              size="small"
              onClick={ () => { this.editRow(record.id); } }
            >编辑</Button>
            <Button
              type="link"
              size="small"
              onClick={ () => { this.editRow(record.id); } }
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
            title="预定管理"
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={ () => { this.getDataSource(); } }>新增餐桌</Button>
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