import moment from "moment";

export const today = moment()
  .startOf("day")
  .format();

export const yesterday = moment()
  .endOf("day")
  .format();

export const week = moment(today)
  .subtract(7, "days")
  .format();

export const month = moment(today)
  .subtract(30, "days")
  .format();

export const year = moment(today)
  .subtract(365, "days")
  .format();
