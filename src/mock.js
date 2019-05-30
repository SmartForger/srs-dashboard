import * as moment from "moment";

const formatDate = d => (d ? moment(d).format("MMMM DD, YYYY") : "");

export const table1Columns = [
  {
    field: "Request_ID",
    label: "Sample ID"
  },
  {
    field: "Customer_Name",
    label: "Customer"
  },
  {
    field: "Ship_Date",
    label: "Due Date",
    format: formatDate
  },
  {
    field: "Time_Shipped",
    label: "Ship Date",
    format: formatDate
  },
  {
    field: "Completed_By",
    label: "Completed By"
  },
  {
    field: "Status",
    label: "Status"
  }
];
export const table2Columns = [
  {
    field: "Request_ID",
    label: "Sample ID"
  },
  {
    field: "Customer_Name",
    label: "Customer"
  },
  {
    field: "Sample_ID",
    label: "Sample Number"
  },
  {
    field: "qty",
    label: "Quantity"
  },
  {
    field: "Date Completed",
    label: "Date Completed",
    format: formatDate
  },
  {
    field: "Date Requested",
    label: "Date Requested",
    format: formatDate
  }
];
