import React, { Component } from "react";
import { Form, Input, Table, Button, Card, Modal, message, Select, Icon } from "antd";
import { enumsToList, numberSplit } from "../../utils";
import { DishStatus } from "../../config/Enums";
import { Page } from "../../config";
import { deleteDishApi, updateDishStatusApi } from "../../services/dishApi";
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
      <Form.Item label="订单编号">
        {
          getFieldDecorator("name", {
            initialValue: ""
          })(
            <Input allowClear />
          )
        }
      </Form.Item>
      <Form.Item label="订单状态">
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
    });
    const list = [];
    let t = 0;
    for (let i = 0; i < 10; i++) {
      t += Math.floor(Math.random() * 300) + 300;
      const status = Math.floor(Math.random() * 3);
      const addtime = moment().subtract(t, "seconds");
      let statusStr = "";
      switch(status) {
        case 0:
          statusStr = "未支付";
          break;
        case 1:
          statusStr = "已支付";
          break;
        case 2:
          statusStr = "已完成";
          break;
        default:
          statusStr = status;
      }
      list.push({
        orderNum: moment().format("YYYYMMDD") + (i < 7 ? "0" : "00") + (16 - i),
        addtime: addtime.format("YYYY-MM-DD HH:mm:ss"),
        statusStr,
        status,
        price: 11.5,
        finishTime: status === 2 ? addtime.add(Math.floor(Math.random() * 3000) + 1000, "seconds").format("YYYY-MM-DD HH:mm:ss") : "-"
      });
    }
    this.setState({
      dataSource: list,
      total: 21
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
      dataIndex: "orderNum",
      title: "订单编号",
      align: "center"
    }, {
      dataIndex: "addtime",
      title: "下单时间",
      align: "center"
    }, {
      dataIndex: "price",
      title: "订单金额",
      align: "center",
      render: (text, record) => {
        return numberSplit(text, 2);
      }
    }, {
      dataIndex: "statusStr",
      title: "订单状态",
      align: "center"
    }, {
      dataIndex: "finishTime",
      title: "完成时间",
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
              disabled={ record.status !== 0 }
              onClick={ () => { this.editRow(record.id); } }
            >取消订单</Button>
            <Button
              type="link"
              size="small"
              onClick={ () => { this.editRow(record.id); } }
            >订单详情</Button>
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
            title="订单管理">
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