const express = require("express");
const {
  getOnTimeMonth,
  getOnTimeYear,
  countCompletedByDate,
  countRequestedByDate,
  getRawData,
  getTableData
} = require("./sql");

const handler = query => async (req, res) => {
  try {
    const result = await query();
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
  router.get("/data/raw", handler(getRawData));
  router.get("/data/table", handler(getTableData));

  return router;
};
