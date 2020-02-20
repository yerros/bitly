import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import { BASE_URL } from "../config";

class SignUpForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      showMessage: false,
      isLogin: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    const { name, email, password } = this.state;
    axios
      .post(`${BASE_URL}/user/register`, {
        name: name,
        email: email,
        password: password
      })
      .then(res => {
        localStorage.setItem("secret_token", res.data.token);
        alert(res.data.msg);
        history.push("/dashboard");
      });
    event.preventDefault();
  }
  render() {
    return (
      <div id="ModalLoginForm" className="modal fade">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title">SignUp</h1>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label className="control-label">Name</label>
                  <div>
                    <input
                      type="text"
                      className="form-control input-lg"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">E-Mail Address</label>
                  <div>
                    <input
                      type="email"
                      className="form-control input-lg"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Password</label>
                  <div>
                    <input
                      type="password"
                      className="form-control input-lg"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div>
                    <button type="submit" className="btn btn-success">
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignUpForm;
