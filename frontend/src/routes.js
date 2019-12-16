import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login";
import Main from "./pages/Main";
import Post from "./pages/Post";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/dev/:id" component={Main} />
      <Route path="/:id/:DevId/:position" component={Post} />
    </BrowserRouter>
  );
}
