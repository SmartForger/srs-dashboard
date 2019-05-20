<template>
  <div class="table">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th :key="i" v-for="(col, i) in columns">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(row, i) in data">
            <td :key="j" v-for="(col, j) in columns">{{ row[col.field] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="separator"/>
    <div class="footer">
      <div class="datepickers">
        <Datepicker label="Start Date" value="2019-02-28" />
        <Datepicker label="End Date" value="2019-02-28" />
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from './Datepicker';

export default {
  name: "Table",
  components: {
    Datepicker
  },
  props: {
    columns: Array,
    data: Array
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.table {
  background-color: #fff;
}
.table-wrapper {
  padding: 0 20px;

  table {
    border-collapse: collapse;
    width: 100%;
  }
}
thead tr {
  border-bottom: 3px solid #5fc3a1;
  color: #5fc3a1;
  font-size: 14px;
  font-weight: bold;
}
th {
  padding: 20px 10px 10px;
}
tr:nth-child(even) {
  background-color: #e6e7e9;
}
tr:nth-child(odd) {
  background-color: white;
}
tbody {
  color: #6d6e71;
}
td {
  padding: 12px 8px;
  letter-spacing: 2px;
  font-size: 12px;
  text-align: center;
}
.separator {
  height: 12px;
  background: rgb(237, 237, 237);
  background: linear-gradient(
    180deg,
    rgba(237, 237, 237, 1) 0%,
    rgba(204, 204, 204, 1) 60%,
    rgba(195, 195, 195, 1) 100%
  );
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
}
.datepickers {
  display: flex;
}
</style>
