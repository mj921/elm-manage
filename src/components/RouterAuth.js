import React, { Component } from "react";
import { Router, Switch, Route, Redirect, withRouter } from "dva/router";
import { connect } from "dva";
import { ErrorPage } from "../routes/loadComponents";
import { routeList } from "../routes/routeConfig";
import menuConfig from "../config/menuConfig";

class RouterAuth extends Component {
  render() {
    let routes, menus;
    if (this.props.username === "admin") {
      routes = routeList.adminRoutes;
      menus = menuConfig.adminMenus;
    } else {
      routes = routeList.merchantRoutes;
      menus = menuConfig.merchantMenus;
    }
    console.log(routes);
    return (
      <Router history={ this.props.history }>
        <Switch>
          {
            routes.map((item, i) => {
              return <Route
                exact
                props={{ item }}
                key={ `${item.label}-${i}` }
                path={ item.path }
                component={ item.component } />;
            })
          }
          <Route
            path="/403"
            component={ ErrorPage } />
          <Route
            path="/404"
            component={ ErrorPage } />
          <Redirect
            exact
            from="/"
            to={ `/${menus[0].name}` } />
          <Redirect to="/404" />
        </Switch>
      </Router>
    );
  }
}

export default withRouter(connect(({ auth }) => {
  return {
    username: auth.username
  };
})(RouterAuth));