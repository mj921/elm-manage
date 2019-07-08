import React, { Component } from "react";
import { withRouter } from "dva/router";

class ErrorPage extends Component {
  state = {  }
  render() {
    return ( <div>{ this.props.location.pathname }</div> );
  }
}

export default withRouter(ErrorPage);