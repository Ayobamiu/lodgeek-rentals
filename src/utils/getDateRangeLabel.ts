import moment from "moment";

function getDateRangeLabel(dateRange: {
  label: any;
  startDate: Date;
  endDate: Date;
}) {
  return {
    label: dateRange.label,
    startDate: moment(dateRange.startDate).valueOf(),
    endDate: moment(dateRange.endDate).valueOf(),
  };
}

function getDateRangeThisWeek() {
  const startDate = moment().startOf("week").toDate();
  const endDate = moment().endOf("week").toDate();
  return getDateRangeLabel({ label: "This week", startDate, endDate });
}

function getDateRangeLastWeek() {
  const startDate = moment().subtract(1, "week").startOf("week").toDate();
  const endDate = moment().subtract(1, "week").endOf("week").toDate();
  return getDateRangeLabel({ label: "Last week", startDate, endDate });
}

function getDateRangeThisMonth() {
  const startDate = moment().startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();
  return getDateRangeLabel({ label: "This month", startDate, endDate });
}

function getDateRangeLastMonth() {
  const startDate = moment().subtract(1, "month").startOf("month").toDate();
  const endDate = moment().subtract(1, "month").endOf("month").toDate();
  return getDateRangeLabel({ label: "Last month", startDate, endDate });
}

function getDateRangeThisYear() {
  const startDate = moment().startOf("year").toDate();
  const endDate = moment().endOf("year").toDate();
  return getDateRangeLabel({ label: "This year", startDate, endDate });
}

function getDateRangeLastYear() {
  const startDate = moment().subtract(1, "year").startOf("year").toDate();
  const endDate = moment().subtract(1, "year").endOf("year").toDate();
  return getDateRangeLabel({ label: "Last year", startDate, endDate });
}

export const dateRanges = [
  getDateRangeThisWeek(),
  getDateRangeLastWeek(),
  getDateRangeThisMonth(),
  getDateRangeLastMonth(),
  getDateRangeThisYear(),
  getDateRangeLastYear(),
];
