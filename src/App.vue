<template>
  <div id="app">
    <Header/>
    <div class="charts">
      <Percentage :size="400" :percent="98" label="On-Time Percentage (MTD)"/>
      <Percentage :size="400" :percent="65" label="On-Time Percentage (YTD)"/>
    </div>
    <div class="tables">
      <div class="percentage-table">
        <Table :columns="table1.columns" :data="table1.data">
          <div class="statistics">
            <div class="statistics-label">ON-TIME PERCENTAGE</div>
            <div class="statistics-value">92%</div>
          </div>
        </Table>
      </div>
      <div class="completed-samples-table">
        <Table :columns="table2.columns" :data="table2.data">
          <div class="statistics">
            <div class="statistics-label">TOTATL SAMPLES COMPLETED</div>
            <div>
              <div class="statistics-value">514</div>
              <div class="statistics-label total">of <span>525</span></div>
            </div>
          </div>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Percentage from "./components/Percentage.vue";
import Table from "./components/Table";
import { table1, table2 } from "./mock";

export default {
  name: "app",
  components: {
    Header,
    Percentage,
    Table
  },
  data() {
    return {
      table1,
      table2
    };
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
