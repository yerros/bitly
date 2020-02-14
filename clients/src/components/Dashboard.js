import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import ItemList from "./ItemList";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      shorten: "",
      isOpen: false,
      showShorten: false,
      listUrl: [],
      inputShorten: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.getList();
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSignOut() {
    localStorage.removeItem("secret_token");
    return history.push("/");
  }

  handleSubmit(event) {
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    axios
      .post(
        "http://localhost:5001/user/shorten",
        { url: this.state.inputShorten },
        headers
      )
      .then(res => {
        this.setState({
          shorten: res.data.short_url,
          showShorten: true,
          inputShorten: ""
        });
        return history.push("/");
      });
    this.getList();
    event.preventDefault();
  }

  getList() {
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    axios.get("http://localhost:5001/user/dashboard", headers).then(res =>
      this.setState({
        listUrl: res.data.user.shorturls
      })
    );
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
            <button onClick={this.handleSignOut} className="btn btn-primary">
              Sign Out
            </button>
          </div>
        </nav>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto mt-3">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-row">
                    <div className="col-12 col-md-9 mb-2 mb-md-0">
                      <input
                        type="text"
                        name="inputShorten"
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="my-3 p-3 bg-white rounded shadow">
              <h6 className="border-bottom border-gray pb-2 mb-0">
                Suggestions
              </h6>
              {this.state.listUrl.map((item, i) => (
                <div key={i}>
                  <ItemList data={item} />
                </div>
              ))}
              <small className="d-block text-right mt-3">
                <a href="/">All suggestions</a>
              </small>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
