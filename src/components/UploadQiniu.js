import React, { Component } from "react";
import { Upload, Button, Icon, message } from "antd";
import { getUploadApi } from "../services/common";
import { qiniuHost } from "../config";
import "./UploadQiniu.less";

class UploadQiniu extends Component {
  constructor() {
    super();
    this.getUploadToken();
  }
  state = {
    uploadData: {},
    fileList: []
  }
  getUploadToken() {
    return new Promise((resolve, reject) => {
      getUploadApi().then(res => {
        this.setState({
          uploadData: {
            token: res.data
          }
        });
      }).catch(err => {
        reject(err);
      });
    });
  };
  uploadChange({ file }) {
    if (file.status === "done") {
      this.props.onChange(qiniuHost + "/" + file.response.hash);
    }
  }
  beforeUpload(file) {
    if (file && file.size > 1024 * 102) {
      message.warn("上传图片不能大于1M");
    }
    return file && file.size <= 1024 * 1024;
  }
  delImg() {
    this.props.onChange("");
  }
  render() {
    return (
      <div>
        {
          this.props.value
            ? <div>
              <img
                style={{ height: "200px" }}
                src={ this.props.value }
                alt="img" />
              <Button
                type="link"
                style={{ verticalAlign: "bottom" }}
                onClick={ () => { this.delImg(); } }>删除</Button>
            </div>
            : <div
              className="upload-container"
              style={{ cursor: this.state.uploadData.token ? "pointer" : "not-allowed" }}>
              <Upload
                action="http://upload.qiniup.com"
                data={ this.state.uploadData }
                onChange={ e => { this.uploadChange(e); }}
                disabled={ !this.state.uploadData.token }
                beforeUpload={ file => { this.beforeUpload(file); } }>
                <Icon type="plus"/>
              </Upload>
            </div>
        }

      </div>
    );
  }
}

export default UploadQiniu;