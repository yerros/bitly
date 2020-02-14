/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import axios from "axios";
import Modal from "react-modal";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
Modal.setAppElement("#root");

export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      shorten: "",
      isOpen: false,
      showShorten: false,
      inputShorten: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ inputShorten: event.target.value });
  }

  handleSubmit(event) {
    axios
      .post("http://localhost:5001/shorten", { url: this.state.inputShorten })
      .then(res =>
        this.setState({
          shorten: res.data.short_url,
          showShorten: true,
          inputShorten: ""
        })
      );
    event.preventDefault();
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <div>
        <nav
          style={{ backgroundColor: "#242729" }}
          className="navbar navbar-dark bg-dark static-top"
        >
          <div className="container">
            <a className="navbar-brand" href="/">
              Link Shortener
            </a>
            <a
              className="btn text-primary btn-outline-primary ml-auto mr-2"
              data-toggle="modal"
              data-target="#ModalLoginForm"
            >
              Sign Up
            </a>
            <a
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#ModalSignUp"
            >
              Sign In
            </a>
          </div>
        </nav>

        <header className="masthead text-white text-center">
          <div className="overlay" />
          <div className="container">
            <div className="row">
              <div className="col-xl-9 mx-auto">
                <h1 className="mb-5">More than Link Shortening</h1>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-row">
                    <div className="col-12 col-md-9 mb-2 mb-md-0">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={this.state.inputShorten}
                        onChange={this.handleChange}
                        placeholder="Shorten your link..."
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <button
                        type="submit"
                        className="btn btn-block btn-lg btn-primary"
                      >
                        Shorten!
                      </button>
                    </div>
                    {this.state.showShorten ? (
                      <div className="col-12 col-md-9 mt-2 mb-md-0">
                        <div className="alert alert-success" role="alert">
                          {this.state.shorten}
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </header>
        <SignUpForm />
        <LoginForm />
      </div>
    );
  }
}
