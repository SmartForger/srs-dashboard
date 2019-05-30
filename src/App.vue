<template>
  <div id="app">
    <Header/>
    <div class="charts">
      <Percentage :size="400" :percent="percentMonth" label="On-Time Percentage (MTD)"/>
      <Percentage :size="400" :percent="percentYear" label="On-Time Percentage (YTD)"/>
      <SamplesChart :height="400" :chartData="chartData"/>
    </div>
    <div class="tables">
      <div class="percentage-table">
        <Table :columns="table1Columns" :data="table1Data" @filterChange="handleTable1FilterChange">
          <div class="statistics">
            <div class="statistics-label">ON-TIME PERCENTAGE</div>
            <div class="statistics-value">{{ onTimePercentage }}%</div>
          </div>
        </Table>
      </div>
      <div class="completed-samples-table">
        <Table :columns="table2Columns" :data="table2Data" @filterChange="handleTable2FilterChange">
          <div class="statistics">
            <div class="statistics-label">TOTATL SAMPLES COMPLETED</div>
            <div>
              <div class="statistics-value">514</div>
              <div class="statistics-label total">
                of
                <span>525</span>
              </div>
            </div>
          </div>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

import Header from "./components/Header.vue";
import Percentage from "./components/Percentage.vue";
import SamplesChart from "./components/SamplesChart.vue";
import Table from "./components/Table";
import { table1Columns, table2Columns } from "./mock";
import {
  getPercentageMonth,
  getPercentageYear,
  getTableData1,
  getTableData2,
  getCompletedCount,
  getRequestedCount
} from "./api";

export default {
  name: "app",
  components: {
    Header,
    Percentage,
    SamplesChart,
    Table
  },
  data() {
    return {
      table1Columns,
      table1Data: [],
      table2Columns,
      table2Data: [],
      percentMonth: 0,
      percentYear: 0,
      chartData: []
    };
  },
  computed: {
    onTimePercentage() {
      const ontime = this.table1Data.filter(row => row.Status === "ON TIME");
      return this.table1Data.length === 0
        ? 0
        : Math.floor((ontime.length / this.table1Data.length) * 100);
    }
  },
  methods: {
    handleTable1FilterChange(ev) {
      this.getTableData1(ev.dateFrom, ev.dateTo);
    },
    handleTable2FilterChange(ev) {
      this.getTableData2(ev.dateFrom, ev.dateTo);
    }
  },
  beforeMount() {
    this.getTableData1 = _.throttle((from, to) => {
      const to1 = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1);

      getTableData1(
        from.toISOString(),
        to1.toISOString()
      ).then(({ data: responseData }) => {
        this.table1Data = responseData.data;
      });
    });
    this.getTableData2 = _.throttle((from, to) => {
      const to1 = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1);

      getTableData2(
        from.toISOString(),
        to1.toISOString()
      ).then(({ data: responseData }) => {
        this.table2Data = responseData.data;
      });
    });
  },
  mounted() {
    getPercentageMonth().then(({ data: responseData }) => {
      this.percentMonth = Math.round(
        responseData.data[0]["On_time_percentage_current_month"]
      );
    });
    getPercentageYear().then(({ data: responseData }) => {
      this.percentYear = Math.round(
        responseData.data[0]["On_time_percentage_current_year"]
      );
    });
    Promise.all([getCompletedCount(), getRequestedCount()])
      .then(result => result.map(res => res.data.data))
      .then(result => {
        const mergedArr = result[1].map(el => ({
          requested: el["Sum of Requested"],
          year: el["YearCreated"],
          week: el["WeekCreated"]
        }));
        result[0].forEach(el0 => {
          const el1 = mergedArr.find(
            el => el.year === el0.YearShipped && el.week === el0.WeekShipped
          );

          if (el1) {
            el1.completed = el0["Sum of Completed"];
          } else {
            const i = mergedArr.findIndex(
              el1 =>
                el1.year > el0.YearShipped ||
                (el1.year === el0.YearShipped && el1.week > el0.WeekShipped)
            );

            if (i >= 0) {
              mergedArr.splice(i, 0, {
                year: el0.YearShipped,
                week: el0.WeekShipped,
                completed: el0["Sum of Completed"]
              });
            } else {
              mergedArr.push({
                year: el0.YearShipped,
                week: el0.WeekShipped,
                completed: el0["Sum of Completed"]
              });
            }
          }
        });
        this.chartData = mergedArr;
      });
  }
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  background-color: #da5a4d;
}
.charts {
  display: flex;
  justify-content: space-around;
  margin-top: -201px;
}
.tables {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.percentage-table {
  padding: 30px;
  flex: 4;
}
.completed-samples-table {
  padding: 30px 30px 30px 0;
  flex: 3;
}
.statistics {
  color: #6d6e71;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.statistics-label {
  font-size: 16px;
  letter-spacing: 1px;
  text-align: right;
  margin-right: 20px;
}
.statistics-value {
  font-size: 30px;
  font-weight: bold;
  color: #5fc3a1;
  text-align: right;
}
.total {
  white-space: nowrap;
  margin-right: 0;

  span {
    font-size: 20px;
  }
}
</style>
