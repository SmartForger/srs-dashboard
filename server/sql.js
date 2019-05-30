/* eslint-disable no-console */
const mysql = require("promise-mysql");

console.log(process.env.DB_HOST);

const pool = mysql.createPool({
  connectionLimit: 6,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sample",
  user: process.env.DB_USER || "testuser",
  password: process.env.DB_PASSWORD || "pass1234"
});

function getOnTimeMonth() {
  const sql = `
select (A.numerator/B.denominator)*100 as 'On_time_percentage_current_month' from (select  1 as 'recordid' ,count(Request_ID) as 'numerator' 
from rd_request
where date( Ship_Date) >= date( Time_Shipped)  and  Status = 'shipped' and month( Time_Shipped) = month(now()) and not isnull(Time_Shipped) ) A join (select  1 as 'recordid' ,count(Request_ID) as 'denominator' 
from rd_request
where   Status = 'shipped' and month( Time_Shipped) = month(now()) and not isnull(Time_Shipped) ) B on A.recordid = B.recordid 
  `;

  return pool.query(sql);
}

function getOnTimeYear() {
  const sql = `
select (A.numerator/B.denominator)*100 as 'On_time_percentage_current_year' from (select  1 as 'recordid' ,count(Request_ID) as 'numerator' 
from rd_request
where date( Ship_Date) >= date( Time_Shipped)  and  Status = 'shipped' and year( Time_Shipped) = year(now()) and not isnull(Time_Shipped) ) A join (select  1 as 'recordid' ,count(Request_ID) as 'denominator' 
from rd_request
where   Status = 'shipped' and year( Time_Shipped) = year(now()) and not isnull(Time_Shipped) ) B on A.recordid = B.recordid 
    `;

  return pool.query(sql);
}

function countCompletedByDate() {
  const sql = `
Select sum(numsamples) as 'Sum of Completed', Year(Time_shipped) as 'YearShipped', week(time_shipped) as 'WeekShipped'
From 
(
Select A.Request_ID, b.NumSamples,  A.Time_Shipped
FROM sample_request.rd_request A 
JOIN (SELECT Request_ID, sum(qty) as 'NumSamples'
    FROM sample_request.rd_sample
    Group By Request_ID) B
ON A.request_ID = B.Request_ID
) C
Where not isnull(Time_shipped)
Group by YearShipped, WeekShipped
  `;

  return pool.query(sql);
}

function countRequestedByDate() {
  const sql = `
Select sum(numsamples) as 'Sum of Requested', Year(Ship_Date) as 'YearCreated', week(Ship_Date) as 'WeekCreated'
From 
(
Select A.Request_ID, b.NumSamples,  A.Ship_Date
FROM sample_request.rd_request A 

JOIN (SELECT Request_ID, sum(qty) as 'NumSamples'
		FROM sample_request.rd_sample
		Group By Request_ID) B
        
ON A.request_ID = B.Request_ID

) C

Where not isnull(Ship_Date)
Group by YearCreated, WeekCreated
  `
  return pool.query(sql);
}

function getTableData(from, to) {
  let where = [];
  if (from) {
    where.push(`B.Time_Shipped >= "${from}"`);
  }
  if (to) {
    where.push(`B.Time_Shipped < "${to}"`);
  }
  const whereStr = where.length > 0 ? `WHERE ${where.join(" AND ")}` : '';

  const sql = `
SELECT
  A.Request_ID, B.Customer_Name, A.Sample_ID, A.qty,
  B.Time_created as 'Date Requested', B.Time_Shipped as 'Date Completed'
FROM sample_request.rd_sample A
Join sample_request.rd_request B 
ON A.Request_ID = B.Request_ID
${whereStr};
  `;

  return pool.query(sql);
}

function getRawData(from, to) {
  let where = [];
  if (from) {
    where.push(`Time_Shipped >= "${from}"`);
  }
  if (to) {
    where.push(`Time_Shipped < "${to}"`);
  }
  const additionalWhere = where.length > 0 ? `and ${where.join(" and ")}` : '';

  const sql = `
select
  Request_ID ,Customer_Name, Ship_Date, date(Time_Shipped) as 'Time_Shipped', Completed_By,
  if(date(Ship_Date) >= date(Time_Shipped), 'ON TIME' ,'LATE') as 'Status' from rd_request 
where Status = 'shipped'  and not isnull(Time_Shipped) ${additionalWhere}
  `;

  return pool.query(sql);
}

module.exports = {
  getOnTimeMonth,
  getOnTimeYear,
  countCompletedByDate,
  countRequestedByDate,
  getTableData,
  getRawData
}