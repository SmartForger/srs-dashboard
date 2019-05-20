import Vue from "vue";
import App from "./App.vue";
import VCalendar from "v-calendar";
import "./global.scss";

Vue.use(VCalendar, {
  firstDayOfWeek: 2
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
