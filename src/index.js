import dva from "dva";
import "./index.less";
import { BrowserRouter } from "dva/router";

// 1. Initialize
const app = dva({
  history: new BrowserRouter().history
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/auth").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
