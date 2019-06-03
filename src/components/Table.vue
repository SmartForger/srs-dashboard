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
          <tr :key="i" v-for="(row, i) in pagedData">
            <td
              :key="j"
              v-for="(col, j) in columns"
            >{{ col.format ? col.format(row[col.field]) : row[col.field] }}</td>
          </tr>
          <tr v-if="data.length === 0">
            <td class="no-data-column" :colspan="columns.length">No data available</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="separator"/>
    <div class="paginator">
      <div class="paginator-info">
        <span>Showing {{ startIndex }} to {{ endIndex }} of {{ total }} records</span>
        <select v-model="pageSize" @change="handlePageSizeChange">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
        </select>
        <label for="pagesize">per page</label>
      </div>
      <div class="paginator-actions">
        <a @click="changePage(page)">&lt;</a>
        <a class="p-link" @click="changePage(1)" v-if="page > 2">1</a>
        <a class="p-link disabled" v-if="page > 3">...</a>
        <a class="p-link" @click="changePage(page - 1)">{{ pageToStrLeft(page, 2) }}</a>
        <a class="p-link" @click="changePage(page)">{{ pageToStrLeft(page, 1) }}</a>
        <input class="p-input" type="text" v-model="pageInput" @change="changePageInput"/>
        <a class="p-link" @click="changePage(page + 2)">{{ pageToStrRight(page, 1) }}</a>
        <a class="p-link" @click="changePage(page + 3)">{{ pageToStrRight(page, 2) }}</a>
        <a class="p-link disabled" v-if="page < pageCount - 4">...</a>
        <a class="p-link" @click="changePage(pageCount)" v-if="page < pageCount - 3">{{ pageCount }}</a>
        <a @click="changePage(page + 2)">&gt;</a>
      </div>
    </div>
    <div class="separator"/>
    <div class="footer">
      <div class="datepickers">
        <Datepicker label="Start Date" :date="dateFrom" @dateChange="dateFromChanged"/>
        <Datepicker label="End Date" :date="dateTo" @dateChange="dateToChanged"/>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "./Datepicker";

export default {
  name: "Table",
  components: {
    Datepicker
  },
  props: {
    columns: Array,
    data: Array
  },
  computed: {
    startIndex() {
      return this.page * this.pageSize + 1;
    },
    endIndex() {
      return Math.min(this.startIndex + this.pageSize - 1, this.data.length);
    },
    total() {
      return this.data.length;
    },
    pageCount() {
      return Math.ceil(this.total / this.pageSize);
    },
    pages() {
      const startPage = Math.max(1, this.page - 1);
      const endPage = Math.min(this.pageCount, this.page + 3);

      const arr = [];
      for (let i = startPage; i <= endPage; i++) {
        arr[i - startPage] = i;
      }

      return arr;
    }
  },
  data() {
    const dateTo = new Date();
    const dateFrom = new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);

    this.$emit("filterChange", { dateFrom, dateTo });

    return {
      page: 0,
      pageSize: 10,
      pagedData: [],
      dateFrom,
      dateTo,
      pageInput: 1
    };
  },
  methods: {
    pageLinkClass(p) {
      return p === this.page + 1 ? "p-link current" : "p-link";
    },
    pageToStrLeft(p, offset) {
      return p >= offset ? p - offset + 1 : '';
    },
    pageToStrRight(p, offset) {
      return p < this.pageCount - offset ? p + offset + 1 : '';
    },
    paginate() {
      this.pagedData = this.data.slice(this.startIndex - 1, this.endIndex);
    },
    changePage(p) {
      if (p < 1 || p > this.pageCount) {
        this.page = 0;
        this.pageInput = 1;
        return;
      }
      if (p > this.pageCount) {
        this.page = pageCount - 1;
        this.pageInput = this.pageCount;
        return;
      }

      this.page = p - 1;
      this.pageInput = p;
      this.paginate();
    },
    changePageInput(ev) {
      const p = parseInt(this.pageInput);
      if (Number.isNaN(p)) {
        this.pageInput = this.page + 1;
        return;
      }

      this.changePage(p);
    },
    handlePageSizeChange(ev) {
      this.paginate();
    },
    dateFromChanged(ev) {
      this.dateFrom = ev;
      this.$emit("filterChange", {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      });
    },
    dateToChanged(ev) {
      this.dateTo = ev;
      this.$emit("filterChange", {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      });
    }
  },
  mounted() {
    this.paginate();
  },
  watch: {
    data() {
      this.paginate();
    }
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
.paginator {
  display: flex;
  justify-content: space-between;
  color: #555;
  padding: 20px 30px;
  align-items: center;
  user-select: none;

  .paginator-info {
    font-size: 14px;

    select {
      margin-left: 30px;
      margin-right: 10px;
    }
  }

  a {
    padding: 0 5px;
    cursor: pointer;

    &:hover:not(.disabled) {
      color: #5fc3a1 !important;
    }

    &.p-link {
      cursor: pointer;
      color: #aaa;
    }

    &.disabled {
      cursor: default;
      color: #555;
    }
  }

  .p-input {
    box-sizing: border-box;
    text-align: center;
    font-size: 15px;
    padding: 4px;
    color: #333;
    width: 48px;
  }
}
.no-data-column {
  text-align: center;
  padding: 20px;
  width: 100%;
}
</style>
