import React, { Component } from "react";
import {
  AppThemeProvider,
  initThemeCamaleon,
  addThemeChangeListener,
  removeThemeChangeListener,
} from "@framework";

import { Footer, HeadMain } from "./menu/index.js";

initThemeCamaleon();

export class Main extends Component {
  state = {};

  componentDidMount() {
    this._listener = (themeProps) => {
      setTimeout(() => {
        this.setState(themeProps);
        console.log(themeProps);
      });
    };
    addThemeChangeListener(this._listener);
  }

  componentWillUnmount() {
    removeThemeChangeListener(this._listener);
  }

  render() {
    return (
      <AppThemeProvider
        h_init="50px"
        h_fin="50px"
        Footer={Footer}
        Header={HeadMain}
        {...this.props}
        {...this.state}
      />
    );
  }
}
