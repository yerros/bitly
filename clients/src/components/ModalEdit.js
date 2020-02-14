import React, { Component } from "react";
import axios from "axios";
import history from "../history";

export default class ModalEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shortUrl: props.data.short_url,
      newShortUrl: props.data.short_url
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }
  handleSubmit(event) {
    const headers = {
      headers: { secret_token: localStorage.getItem("secret_token") }
    };
    if (this.state.newShortUrl) {
      axios
        .put(
          `http://localhost:5001/user/${this.state.shortUrl}`,
          { name: this.state.newShortUrl },
          headers
        )
        .then(res => {
          if (res) {
            alert("Sukses");
            return history.push("/");
          }
        });
    } else {
      alert("gak boleh kosong bro");
    }
    event.preventDefault();
  }

  render() {
    return (
      <div id={`ModalEdit-${this.props.data._id}`} className="modal fade">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label className="control-label">New Short Url</label>
                  <div>
                    <input
                      type="text"
                      className="form-control input-lg"
                      name="newShortUrl"
                      value={this.state.newShortUrl}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div>
                    <button type="submit" className="btn btn-success">
                      Submit
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
