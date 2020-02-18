import moment from "moment";

export const today = moment()
  .startOf("day")
  .format();

export const yesterday = moment()
  .endOf("day")
  .format();

export const week = moment(today)
  .add(7, "days")
  .format();

export const month = moment(today)
  .add(30, "days")
  .format();

export const year = moment(today)
  .add(365, "days")
  .format();
