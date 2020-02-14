import React, { Component } from "react";
import "../src/App.css";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLogin: false
    };
  }

  componentDidMount() {
    this.checkLogin();
  }
  checkLogin = () => {
    const token = localStorage.getItem("secret_token");
    if (token) {
      this.setState({
        isLogin: true
      });
    }
  };
  //this.state.isLogin ? <Dashboard /> : <HomePage />
  render() {
    return this.state.isLogin ? <Dashboard /> : <HomePage />;
  }
}
