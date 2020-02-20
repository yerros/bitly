import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import ManageLink from "./ManageLink";
import { BASE_URL } from "../config";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      shorten: "",
      isManage: true,
      showShorten: false,
      tracks: [],
      listUrl: [],
      listLink: [],
      inputShorten: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleScreen = this.handleScreen.bind(this);
  }

  componentDidMount() {
    // this.getList();
    this.getTrack();
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
        `${BASE_URL}/user/shorten`,
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

  handleScreen() {
    this.setState({ isManage: !this.state.isManage });
  }
  // getList() {
  //   const headers = {
  //     headers: { secret_token: localStorage.getItem("secret_token") }
  //   };
  //   axios.get(`${BASE_URL}/user/dashboard`, headers).then(res =>
  //     this.setState({
  //       listUrl: res.data.user.shorturls
  //     })
  //   );
  // }
  getTrack() {
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    axios.get(`${BASE_URL}/user/track`, headers).then(res =>
      this.setState({
        tracks: res.data.links,
        listLink: res.data.links
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

        <div className="nav-scroller bg-white shadow-sm">
          <nav className="nav nav-underline">
            <span className="nav-link active">Dashboard</span>
            <button
              className="btn btn-outline text-primary nav-link"
              onClick={this.handleScreen}
            >
              Manage Link
            </button>
          </nav>
        </div>
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
          <ManageLink dataSource={this.state.listLink} />
        </section>
      </div>
    );
  }
}
