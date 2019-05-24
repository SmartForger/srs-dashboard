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
            <td :key="j" v-for="(col, j) in columns">{{ row[col.field] }}</td>
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
        <a :key="i" :class="pageLinkClass(p)" @click="changePage(p)" v-for="(p, i) in pages">{{ p }}</a>
        <a @click="changePage(page + 2)">&gt;</a>
      </div>
    </div>
    <div class="separator"/>
    <div class="footer">
      <div class="datepickers">
        <Datepicker label="Start Date" value="2019-02-28"/>
        <Datepicker label="End Date" value="2019-02-28"/>
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
    return {
      page: 0,
      pageSize: 10,
      pagedData: []
    };
  },
  methods: {
    pageLinkClass(p) {
      return p === this.page + 1 ? "p-link current" : "p-link";
    },
    paginate() {
      this.pagedData = this.data.slice(this.startIndex - 1, this.endIndex);
    },
    changePage(p) {
      if (p < 1 || p > this.pageCount) {
        return;
      }

      this.page = p - 1;
      this.paginate();
    },
    handlePageSizeChange(ev) {
      this.paginate();
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

    &:hover:not(.current) {
      color: #5fc3a1 !important;
    }

    &.p-link {
      cursor: pointer;
      color: #aaa;
    }

    &.current {
      cursor: default;
      color: #555;
    }
  }
}
</style>
