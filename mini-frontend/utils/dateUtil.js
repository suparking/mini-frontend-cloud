import moment from "moment";

function getHandledValue(num) {
  return num < 10 ? "0" + num : num;
}

function getDate(timeStamp, type) {
  const d = new Date(timeStamp * 1000 - 8 * 60 * 60 * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = "";
  if (type === "year")
    resStr =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      second;
  if (type === "date") resStr = year + "-" + month + "-" + date;
  else resStr = month + "-" + date + " " + hours + ":" + minutes;
  return resStr;
}
/**
 * 根据规则计算出结束时间.
 * @param {参数}  params
 */
const getEndDate = (params) => {
  let beginDate = params.beginDate;
  let endDate = new Date(beginDate);
  let durationType = params.durationType;
  let quantity = params.quantity;
  let number = params.number;
  if (durationType === "DAY") {
    endDate = endDate.setDate(endDate.getDate() + quantity * number) - 1000;
  } else if (durationType === "MONTH") {
    endDate = endDate.setMonth(endDate.getMonth() + quantity * number) - 1000;
  } else if (durationType === "YEAR") {
    endDate = endDate.setFullYear(endDate.getFullYear() + quantity * number) - 1000;
  }
  return getDate(endDate / 1000, 'date');
};

export default {
  getEndDate,
};
