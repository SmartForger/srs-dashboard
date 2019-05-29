<template>
  <div class="datepicker" v-click-outside="hideCalendar">
    <div class="label">{{ label }}</div>
    <div class="input-field" @click="openCalendar">
      <span class="value">{{ dateText }}</span>
      <img src="../assets/calendar.png" alt="picker">
    </div>
    <div class="picker-wrapper">
      <v-calendar
        mode="single"
        :attributes="attrs"
        v-model="model"
        @dayclick="selectDate($event)"
        v-if="visible"
      />
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import moment from "moment";

export default {
  name: "Datepicker",
  props: {
    label: String,
    date: Date
  },
  computed: {
    dateText() {
      return moment(this.model).format("MMM DD, YYYY");
    }
  },
  data() {
    return {
      attrs: [
        {
          key: "today",
          highlight: {
            backgroundColor: "#ff8080"
          },
          dates: this.date
        }
      ],
      visible: false,
      model: this.date || null
    };
  },
  methods: {
    openCalendar() {
      this.visible = true;
    },
    hideCalendar() {
      if (this.visible) {
        this.visible = false;
      }
    },
    selectDate(evt) {
      this.visible = false;
      this.model = evt.date;
      this.attrs = [
        {
          key: "today",
          highlight: {
            backgroundColor: "#ff8080"
          },
          dates: evt.date
        }
      ];
    }
  },
  directives: {
    ClickOutside
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.datepicker {
  padding: 10px;
  position: relative;
  color: #6d6e71;
}
.label {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}
.input-field {
  background: #e6e7e9;
  display: flex;
  padding: 8px;
  cursor: pointer;

  .value {
    width: 160px;
    margin-right: 8px;
    overflow: hidden;
  }

  img {
    width: 17px;
    height: 20px;
  }
}
.picker-wrapper {
  position: absolute;
  bottom: 0;
  z-index: 999;
}
</style>
