const express = require("express");
const {
  getOnTimeMonth,
  getOnTimeYear,
  countCompletedByDate,
  countRequestedByDate,
  getRawData,
  getTableData
} = require("./sql");

const handler = (query, hasDateRange) => async (req, res) => {
  try {
    let result;

    if (hasDateRange) {
      const { from, to } = req.query;
      result = await query(from, to);
    } else {
      result = await query();
    }

    res.json({
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

module.exports = () => {
  const router = express.Router();

  router.get("/percentage/month", handler(getOnTimeMonth));
  router.get("/percentage/year", handler(getOnTimeYear));
  router.get("/count/completed", handler(countCompletedByDate));
  router.get("/count/requested", handler(countRequestedByDate));
  router.get("/data/raw", handler(getRawData, true));
  router.get("/data/table", handler(getTableData, true));

  return router;
};
