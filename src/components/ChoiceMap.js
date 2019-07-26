import React, { Component, Fragment } from "react";
import { Button, Modal } from "antd";
import GDMap from "./GDMap";

export default class ChoiceMap extends Component {
  state = {
    visible: false
  }
  mapChange(item) {
    this.props.onChange(item.address + " " + item.name, item);
    this.setState({
      visible: false
    });
  }
  render() {
    const { value } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <div>
          {
            value
              ? (
                <Fragment>
                  <p style={{ lineHeight: "20px", paddingTop: "10px", margin: 0 }}>{ value }</p>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={ () => { this.setState({ visible: true }); } }>
                      重新选择
                  </Button>
                </Fragment>
              )
              : <Button
                style={{ padding: 0 }}
                type="link"
                onClick={ () => { this.setState({ visible: true }); } }>选择地址</Button>
          }
        </div>
        <Modal
          visible={ visible }
          onCancel={ () => { this.setState({ visible: false }); } }
          width="900px">
          <GDMap onChange={ e => { this.mapChange(e); } } />
        </Modal>
      </div>
    );
  }
}
