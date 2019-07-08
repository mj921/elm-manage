import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import { IndexLayout, Login } from "./routes/loadComponents";
import { LocaleProvider } from "antd";
import ZH_CN from "antd/lib/locale-provider/zh_CN";

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={ ZH_CN }>
      <Router history={history}>
        <Switch>
          <Route
            exact
            path="/login"
            component={ Login } />
          <Route
            path="/"
            component={ IndexLayout } />
          <Redirect to="/login" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
