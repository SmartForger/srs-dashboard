<template>
  <div class="samples-chart" :style="containerStyle">
    <div id="chart_container" ref="container">
      <div class="button left" @click="moveLeft"/>
      <div class="button right" @click="moveRight"/>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { throttle } from "lodash";

export default {
  name: "SamplesChart",
  props: {
    height: Number,
    chartData: Array
  },
  data() {
    return {
      makeChartThrottled: null,
      startIndex: 0,
      viewData: [],
      dimensions: {},
      dataLoaded: false,
      dummyData: [],
      shouldAnimate: true
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
      if (!this.$refs.container) {
        return;
      }

      const svgWidth = this.$refs.container.clientWidth;
      const svgHeight = this.$refs.container.clientHeight;
      this.dimensions = {
        left: 30,
        top: 50,
        right: 30,
        bottom: 50
      };
      this.dimensions.width =
        svgWidth - this.dimensions.left - this.dimensions.right;
      this.dimensions.height =
        svgHeight - this.dimensions.top - this.dimensions.bottom;
      const bandWidth = 120;
      this.count = Math.ceil(this.dimensions.width / bandWidth);
      this.startIndex = Math.max(0, this.chartData.length - this.count);
      this.viewData = this.chartData.slice(
        this.startIndex,
        this.startIndex + this.count
      );

      this.makeDummyData();
      console.log("make chart", this.dataLoaded, this.dummyData);

      const container = d3.select("#chart_container");
      container.select("svg").remove();

      this.chart = container
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      this.chart
        .append("text")
        .text("Samples Completed/Requested")
        .attr("fill", "white")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${svgWidth / 2}, ${svgHeight - 10})`);

      this.addGradients();
      this.defineScales();
      this.drawBars();
      this.addChartAxis();

      if (this.dataLoaded && this.shouldAnimate) {
        this.shouldAnimate = false;
      }
    },
    defineScales() {
      const maxCompleted = this.dataLoaded
        ? d3.max(this.chartData, d => d.completed || 0)
        : 1;
      const maxRequested = this.dataLoaded
        ? d3.max(this.chartData, d => d.requested || 0)
        : 1;

      this.yScaleCompleted = d3
        .scaleLinear()
        .range([this.dimensions.height / 2, 0])
        .domain([0, maxCompleted]);
      this.yScaleRequested = d3
        .scaleLinear()
        .range([this.dimensions.height / 2, this.dimensions.height])
        .domain([0, maxRequested]);

      let temp = this.dataLoaded ? this.viewData : this.dummyData;
      this.xScale = d3
        .scaleBand()
        .range([0, this.dimensions.width])
        .domain(temp.map(el => `${el.year}-${el.week}`));
    },
    addChartAxis() {
      d3.select(".axis-container").remove();
      const axisContainer = this.chart
        .append("g")
        .attr("class", "axis-container");
      const { height, left, top } = this.dimensions;

      axisContainer
        .append("g")
        .attr("transform", `translate(${left}, ${top + height / 2})`)
        .call(d3.axisBottom(this.xScale).tickSize(0));
      axisContainer
        .append("g")
        .attr("transform", `translate(${left}, ${top})`)
        .call(d3.axisLeft(this.yScaleCompleted).tickSize(0));
      axisContainer
        .append("g")
        .attr("transform", `translate(${left}, ${top})`)
        .call(d3.axisLeft(this.yScaleRequested).tickSize(0));

      axisContainer.selectAll("text").remove();

      axisContainer
        .append("text")
        .text("COMPLETED")
        .attr(
          "style",
          `
          transform: translate(20px, ${top}px) rotate(-90deg);
          font-size: 16px;
          font-weight: bold;
          text-anchor: end;
          fill: white;
        `.replace(/\s+/g, " ")
        );
      axisContainer
        .append("text")
        .text("REQUESTED")
        .attr(
          "style",
          `
          transform: translate(20px, ${height + top}px) rotate(-90deg);
          font-size: 16px;
          font-weight: bold;
          fill: white;
        `.replace(/\s+/g, " ")
        );
    },
    drawBars() {
      d3.select(".bars-completed").remove();
      d3.select(".bars-requested").remove();

      const { width, height, left, top } = this.dimensions;

      const barWidth = width / this.count;
      const completedContainer = this.chart
        .append("g")
        .attr("class", "bars-completed")
        .attr("transform", `translate(${left}, ${top})`);
      const completedBars = completedContainer
        .selectAll()
        .data(this.dataLoaded ? this.viewData : this.dummyData)
        .enter()
        .append("g")
        .attr("transform", d => {
          const x = this.xScale(`${d.year}-${d.week}`);
          console.log(x);
          return `translate(${x}, 0)`;
        });
      completedBars
        .append("rect")
        .attr("width", barWidth)
        .attr("height", height / 2)
        .attr("fill", (d, i) =>
          i % 2 === 0 ? "url(#gradCompleted)" : "transparent"
        )
        .attr("stroke", "#db9792")
        .attr("mask", "url(#fadeCompleted)");
      const completedInnerBars = completedBars
        .append("rect")
        .attr("class", "bar-bg")
        .attr("transform", d => {
          const y = this.yScaleCompleted(d.completed || 0);
          return `translate(${barWidth / 4}, ${y})`;
        })
        .attr("width", barWidth / 2)
        .attr(
          "height",
          d => height / 2 - this.yScaleCompleted(d.completed || 0)
        );
      if (this.dataLoaded) {
        const completedTexts = completedBars
          .append("text")
          .text(d => d.completed || 0)
          .attr(
            "class",
            this.shouldAnimate ? "bar-value" : "bar-value animated"
          )
          .attr("text-anchor", "middle")
          .attr("x", barWidth / 2)
          .attr("y", d => {
            let y = this.yScaleCompleted(d.completed || 0);
            if (height / 2 - y < 30) {
              y -= 8;
            } else {
              y += 24;
            }
            return y;
          });

        const dateTexts = completedBars
          .append("text")
          .attr(
            "class",
            this.shouldAnimate ? "date-text" : "date-text animated"
          )
          .attr("transform", `translate(${barWidth / 2}, -30)`)
          .text(d => {
            const days = 1 + (d.week - 1) * 7;
            const dStart = new Date(d.year, 0, days);
            const startOfWeek = dStart.getDate() - dStart.getDay();
            dStart.setDate(startOfWeek);
            const dEnd = new Date(
              dStart.getFullYear(),
              dStart.getMonth(),
              dStart.getDate() + 6
            );
            return `${dStart.getMonth() +
              1}/${dStart.getDate()} - ${dEnd.getMonth() +
              1}/${dEnd.getDate()}`;
          });

        if (this.shouldAnimate) {
          dateTexts
            .transition()
            .duration(1000)
            .style("opacity", 1);
          completedTexts
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .tween("text", function(d) {
              var that = d3.select(this);
              const i = d3.interpolateNumber(0, d.completed || 0);
              return function(t) {
                d3.select(this).text(Math.floor(i(t)));
              };
            })
            .attrTween("y", d => {
              let y1 = this.yScaleCompleted(d.completed || 0);
              let y0 = 0;
              if (height / 2 - y1 < 30) {
                y1 -= 8;
                y0 = this.yScaleCompleted(0) - 8;
              } else {
                y1 += 24;
                y0 = this.yScaleCompleted(0) + 24;
              }
              return d3.interpolateNumber(y0, y1);
            });
          completedInnerBars
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attrTween("height", d => {
              const h = height / 2 - this.yScaleCompleted(d.completed || 0);
              console.log(d, h);
              return d3.interpolateNumber(0, h);
            })
            .attrTween("transform", d => {
              const y0 = this.yScaleCompleted(0);
              const y1 = this.yScaleCompleted(d.completed || 0);
              return d3.interpolateString(
                `translate(${barWidth / 4}, ${y0})`,
                `translate(${barWidth / 4}, ${y1})`
              );
            });
        }
      }

      const requestedContainer = this.chart
        .append("g")
        .attr("class", "bars-requested")
        .attr("transform", `translate(${left}, ${top + height / 2})`);
      const requestedBars = requestedContainer
        .selectAll()
        .data(this.dataLoaded ? this.viewData : this.dummyData)
        .enter()
        .append("g")
        .attr("transform", d => {
          const x = this.xScale(`${d.year}-${d.week}`);
          return `translate(${x}, 0)`;
        });
      requestedBars
        .append("rect")
        .attr("width", barWidth)
        .attr("height", height / 2)
        .attr("fill", (d, i) =>
          i % 2 === 1 ? "url(#gradRequested)" : "transparent"
        )
        .attr("stroke", "#87352f")
        .attr("mask", "url(#fadeRequested)");
      const requestedInnerBars = requestedBars
        .append("rect")
        .attr("class", "requested-count")
        .attr("transform", `translate(${barWidth / 4}, 0)`)
        .attr("width", barWidth / 2)
        .attr(
          "height",
          d => this.yScaleRequested(d.requested || 0) - height / 2
        );
      if (this.dataLoaded) {
        const requestedBarsText = requestedBars
          .append("text")
          .text(d => d.requested || 0)
          .attr("class", "bar-value")
          .attr("text-anchor", "middle")
          .attr("x", barWidth / 2)
          .attr("y", d => {
            let y = this.yScaleRequested(d.requested || 0) - height / 2;
            if (y < 30) {
              y += 24;
            } else {
              y -= 8;
            }
            return y;
          });
        if (this.shouldAnimate) {
          requestedBarsText
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .tween("text", function(d) {
              const i = d3.interpolateNumber(0, d.requested || 0);
              return function(t) {
                d3.select(this).text(Math.floor(i(t)));
              };
            })
            .attrTween("y", d => {
              let y1 = this.yScaleRequested(d.requested || 0) - height / 2;
              let y0 = 0;
              if (y1 < 30) {
                y1 += 24;
                y0 = this.yScaleRequested(0) - height / 2 + 24;
              } else {
                y1 -= 8;
                y0 = this.yScaleRequested(0) - height / 2 - 8;
              }
              return d3.interpolateNumber(y0, y1);
            });
          requestedInnerBars
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attrTween("height", d => {
              const h = this.yScaleRequested(d.requested || 0) - height / 2;
              return d3.interpolateNumber(0, h);
            });
        }
      }
    },
    addGradients() {
      const defs = this.chart.append("defs");
      const fadeCompletedGrad = defs
        .append("linearGradient")
        .attr("id", "fadeCompletedGrad")
        .attr("y2", 0.8)
        .attr("x2", 0);
      fadeCompletedGrad
        .append("stop")
        .attr("offset", 0)
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);
      fadeCompletedGrad
        .append("stop")
        .attr("offset", 1)
        .attr("stop-color", "white")
        .attr("stop-opacity", 0.5);
      defs
        .append("mask")
        .attr("id", "fadeCompleted")
        .attr("maskContentUnits", "objectBoundingBox")
        .append("rect")
        .attr("width", 1)
        .attr("height", 1)
        .attr("fill", "url(#fadeCompletedGrad)");
      const gradCompleted = defs
        .append("linearGradient")
        .attr("id", "gradCompleted");
      gradCompleted
        .append("stop")
        .attr("offset", 0)
        .attr("stop-color", "#652722")
        .attr("stop-opacity", 1);
      gradCompleted
        .append("stop")
        .attr("offset", 0.5)
        .attr("stop-color", "#652722")
        .attr("stop-opacity", 0.5);
      gradCompleted
        .append("stop")
        .attr("offset", 1)
        .attr("stop-color", "#652722")
        .attr("stop-opacity", 1);
      const fadeRequestedGrad = defs
        .append("linearGradient")
        .attr("id", "fadeRequestedGrad")
        .attr("y2", 0.8)
        .attr("x2", 0);
      fadeRequestedGrad
        .append("stop")
        .attr("offset", 0)
        .attr("stop-color", "white")
        .attr("stop-opacity", 1);
      fadeRequestedGrad
        .append("stop")
        .attr("offset", 1)
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);
      defs
        .append("mask")
        .attr("id", "fadeRequested")
        .attr("maskContentUnits", "objectBoundingBox")
        .append("rect")
        .attr("width", 1)
        .attr("height", 1.25)
        .attr("fill", "url(#fadeRequestedGrad)");
      const gradRequested = defs
        .append("linearGradient")
        .attr("id", "gradRequested");
      gradRequested
        .append("stop")
        .attr("offset", 0)
        .attr("stop-color", "#a14238")
        .attr("stop-opacity", 0.7);
      gradRequested
        .append("stop")
        .attr("offset", 0.5)
        .attr("stop-color", "#a14238")
        .attr("stop-opacity", 0.4);
      gradRequested
        .append("stop")
        .attr("offset", 1)
        .attr("stop-color", "#a14238")
        .attr("stop-opacity", 0.7);
    },
    moveLeft() {
      if (!this.dataLoaded) {
        return;
      }

      this.startIndex--;
      this.startIndex = Math.max(0, this.startIndex);
      this.viewData = this.chartData.slice(
        this.startIndex,
        this.startIndex + this.count
      );

      this.defineScales();
      this.drawBars();
      this.addChartAxis();
    },
    moveRight() {
      if (!this.dataLoaded) {
        return;
      }

      this.startIndex++;
      this.startIndex = Math.min(
        this.chartData.length - this.count,
        this.startIndex
      );
      this.viewData = this.chartData.slice(
        this.startIndex,
        this.startIndex + this.count
      );

      this.defineScales();
      this.drawBars();
      this.addChartAxis();
    },
    makeDummyData() {
      this.dummyData = [];

      for (let i = 0; i < this.count; i++) {
        this.dummyData.push({
          year: 2019,
          week: i,
          completed: 0,
          requested: 0
        });
      }
    }
  },
  watch: {
    chartData(newData) {
      if (newData.length > 0) {
        this.dataLoaded = true;
        this.$nextTick(() => {
          this.makeChartThrottled();
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.makeChart();
    });
    this.makeChartThrottled = throttle(() => {
      this.makeChart();
    }, 800);
    window.addEventListener("resize", this.makeChartThrottled);
  },
  destroyed() {
    window.removeEventListener("resize", this.makeChartThrottled);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.samples-chart {
  flex: 1;
  margin-right: 50px;
  overflow: hidden;
  user-select: none;
}
#chart_container {
  width: 100%;
  height: 100%;
  position: relative;
}
.axis-container {
  z-index: 1;
  path {
    stroke-width: 3px;
  }
}
.bar-bg {
  fill: #5fc3a1;
}
.requested-count {
  fill: #f3b13a;
}
.bar-value {
  font-weight: bold;
  font-size: 20px;
  fill: white;
  opacity: 0;
}
.date-text {
  fill: white;
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  opacity: 0;
}
.button-outer {
  fill: #ccc;
}
.button-inner {
  fill: #fff;
}
.button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid #e6e7e9;
  background-color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  color: #6d6e72;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 28px;

  &.right {
    right: 10px;
    background-image: url("../assets/arrow-right.png");
    background-position: center;
  }
  &.left {
    left: 10px;
    background-image: url("../assets/arrow-left.png");
    background-position: center;
  }
  &:active {
    box-shadow: none;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  }
}
.animated {
  opacity: 1;
}
</style>
