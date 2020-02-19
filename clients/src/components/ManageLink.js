import React, { useState } from "react";
import Select from "react-select";
import { today, yesterday, week, month, year } from "../moment";
import ItemList from "./ItemList";
import moment from "moment";
export default function ManageLink(props) {
  const [selected, setSelected] = useState();
  const [data, setData] = useState("");
  const options = [
    { value: "all", label: "All Day" },
    { value: today, label: "Clicked today" },
    { value: week, label: "Clicked this Week" },
    { value: month, label: "Clicked this Month" },
    { value: year, label: "Clicked this Year" }
  ];
  const Filltrack = date =>
    props.dataSource.map(item => {
      return {
        ...item,
        track: item.track.filter(item => {
          return moment(item.created_at).isBetween(date.value, yesterday);
        })
      };
    });

  const handleSelect = selected => {
    setSelected(selected);
    if (selected.value === "all") {
      const dataProps = props.dataSource;
      setData(dataProps);
    } else {
      const fill = Filltrack(selected);
      const fillZero = fill.filter(item => item.track.length > 0);
      setData(fillZero);
    }
  };

  const filtered = data || props.dataSource;
  return (
    <div className="container">
      <div className="my-3 p-3 bg-white rounded shadow">
        <div className="container">
          <div className="row border-bottom border-gray">
            <div className="col-6">
              <h6 className="pb-2 mb-0">Link Collection</h6>
            </div>
            <div className="col-6">
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <h6 className="text-right">Filter :</h6>
                  </div>
                  <div className="col-6">
                    {/* <select className="custom-select mb-2">
                      <option selected>Show All</option>
                      <option value="1">Day</option>
                      <option value="2">Month</option>
                      <option value="3">Year</option>
                    </select> */}
                    <Select
                      value={selected}
                      onChange={handleSelect}
                      options={options}
                      className="mb-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {filtered.map((item, i) => (
          <div className="container" key={i}>
            <ItemList data={item} />
          </div>
        ))}
        <small className="d-block text-right mt-3">
          <a href="/">All suggestions</a>
        </small>
      </div>
    </div>
  );
}
