import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://srsd.herokuapp.com"
    : "http://localhost:8000";

export const getPercentageMonth = () =>
  axios.get(`${BASE_URL}/percentage/month`);
export const getPercentageYear = () => axios.get(`${BASE_URL}/percentage/year`);
export const getTableData1 = (from, to) =>
  axios.get(`${BASE_URL}/data/raw`, { params: { from, to } });
export const getTableData2 = (from, to) =>
  axios.get(`${BASE_URL}/data/table`, { params: { from, to } });
export const getCompletedCount = () => axios.get(`${BASE_URL}/count/completed`);
export const getRequestedCount = () => axios.get(`${BASE_URL}/count/requested`);
