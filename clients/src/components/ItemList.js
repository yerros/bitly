import React from "react";
import axios from "axios";
import history from "../history";
import ModalEdit from "./ModalEdit";

export default function ItemList(props) {
  const item = props.data || [];

  function handleDelete(data) {
    const confirm = window.confirm("Are you sure to delete this link?");
    if (confirm) {
      const headers = {
        headers: { secret_token: localStorage.getItem("secret_token") }
      };
      if (data.short_url) {
        axios
          .delete(`http://localhost:5001/user/${data.short_url}`, headers)
          .then(res => {
            if (res) {
              alert("Sukses");
              return history.push("/");
            }
          });
      } else {
        alert("gak boleh kosong bro");
      }
    }
  }
  return (
    <div key={item._id}>
      <div className="media text-muted pt-3">
        <div className="mx-2">
          <i className="fas fa-chart-bar"></i>
          <p>{item.track.length}</p>
        </div>
        <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <div className="d-flex justify-content-between align-items-center w-100">
            <strong className="text-gray-dark">
              <a href={`http://localhost:5001/${item.short_url}`}>
                http://localhost:5001/{item.short_url}
              </a>
            </strong>
            <button
              className="btn btn-primary btn-sm ml-auto mr-2"
              data-toggle="modal"
              data-target={`#ModalEdit-${item._id}`}
            >
              <i title="Edit" className="fas fa-edit"></i>
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(item)}
            >
              <i title="Delete" className="fas fa-trash"></i>
            </button>
          </div>
          <span className="d-block">{item.url}</span>
        </div>
      </div>
      <ModalEdit data={item} />
    </div>
  );
}
