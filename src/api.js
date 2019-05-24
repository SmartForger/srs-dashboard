import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const getPercentageMonth = () =>
  axios.get(`${BASE_URL}/percentage/month`);
export const getPercentageYear = () => axios.get(`${BASE_URL}/percentage/year`);
export const getTableData1 = () => axios.get(`${BASE_URL}/data/raw`);
export const getTableData2 = () => axios.get(`${BASE_URL}/data/table`);
