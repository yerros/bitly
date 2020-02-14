import React, { Component } from "react";
import axios from "axios";
import history from "../history";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      shorten: "",
      isOpen: false,
      showShorten: false,
      listUrl: "",
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

  async handleSubmit(event) {
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    await axios
      .post(
        "http://localhost:5001/user/shorten",
        { url: this.state.inputShorten },
        headers
      )
      .then(res =>
        this.setState({
          shorten: res.data.short_url,
          showShorten: true,
          inputShorten: ""
        })
      );
    this.getList();
    event.preventDefault();
  }

  getList() {
    console.log("render");
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    axios.get("http://localhost:5001/user", headers).then(res =>
      this.setState({
        listUrl: res.data.user.shorturls
      })
    );
  }
  render() {
    console.log(this.state.listUrl);
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
              {this.state.listUrl &&
                this.state.listUrl.map(item => {
                  return (
                    <div className="media text-muted pt-3" key={item._id}>
                      <div className="mx-2">
                        <i className="fas fa-chart-bar"></i>
                        <p>{item.track.length}</p>
                      </div>
                      <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <strong className="text-gray-dark">
                            http://localhost:5001/go/{item.short_url}
                          </strong>
                          <a href="/">Follow</a>
                        </div>
                        <span className="d-block">{item.url}</span>
                      </div>
                    </div>
                  );
                })}
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
