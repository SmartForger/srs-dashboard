<template>
  <div class="samples-chart" :style="containerStyle">
    <div id="chart_container" ref="container"/>
  </div>
</template>

<script>
import * as d3 from "d3";
import { throttle } from "lodash";

export default {
  name: "SamplesChart",
  props: {
    height: Number
  },
  data() {
    return {
      makeChartThrottled: null
    };
  },
  computed: {
    containerStyle() {
      return {
        height: this.height + "px"
      };
    }
  },
  methods: {
    makeChart() {
      const svgWidth = this.$refs.container.clientWidth;
      const svgHeight = this.$refs.container.clientHeight;

      const container = d3.select("#chart_container");
      container.select("svg").remove();
      container
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.makeChart();

      this.makeChartThrottled = throttle(() => {
        this.makeChart();
      }, 800);
      window.addEventListener("resize", this.makeChartThrottled);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.makeChartThrottled);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.samples-chart {
  background-color: rgba(255, 255, 255, 0.5);
  flex: 1;
  margin-right: 50px;
  overflow: hidden;
}
#chart_container {
  width: 100%;
  height: 100%;
}
</style>
