<template>
  <div class="wrapper">
    <svg :width="size" :height="size">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#d85a4c;stop-opacity:1"></stop>
          <stop offset="50%" style="stop-color:#f3b13d;stop-opacity:1"></stop>
          <stop offset="100%" style="stop-color:#5fc19f;stop-opacity:1"></stop>
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#d85a4c;stop-opacity:0.5"></stop>
          <stop offset="50%" style="stop-color:#f3b13d;stop-opacity:0.5"></stop>
          <stop offset="100%" style="stop-color:#5fc19f;stop-opacity:0.5"></stop>
        </linearGradient>
      </defs>
      <clipPath :id="clipId1">
        <path :d="arcPath1"></path>
      </clipPath>
      <clipPath :id="clipId2">
        <path :d="arcPath2"></path>
      </clipPath>
      <rect :width="size" :height="size" :clip-path="rectClip1" fill="url(#grad1)"></rect>
      <rect :width="size" :height="size" :clip-path="rectClip2" fill="#444"></rect>
      <rect :width="size" :height="size" :clip-path="rectClip2" fill="url(#grad2)"></rect>
      <line x1="0" :y1="centerY" :x2="size" :y2="centerY" style="stroke:#e6e7e9;stroke-width:3"></line>
      <circle :cx="centerX" :cy="centerY" :r="radius" stroke="#e6e7e9" stroke-width="12" fill="white"></circle>
      <text
        :x="centerX"
        :y="textY"
        :style="textStyle"
        :fill="color"
        :font-size="fontSize"
        font-weigth="bold"
        text-anchor="middle"
      >{{ animatedPercent }}%</text>
      <text
        :x="centerX"
        :y="textY1"
        fill="white"
        :font-size="fontSize1"
        font-weight="bold"
        text-anchor="middle"
      >{{ label }}</text>
    </svg>
  </div>
</template>

<script>
import { v4 } from "uuid";

export default {
  name: "Percentage",
  props: {
    size: Number,
    percent: Number,
    label: String
  },
  computed: {
    centerX() {
      return this.size / 2;
    },
    centerY() {
      return this.size / 2;
    },
    radius() {
      return this.size / 4;
    },
    arcPath1() {
      return this.createPath(this.size / 4 + 16, this.size / 2 - 10);
    },
    arcPath2() {
      return this.createPath(this.size / 4 + 6, this.size / 4 + 16);
    },
    gx2() {
      return this.size + "px";
    },
    rectClip1() {
      return `url(#${this.clipId1})`;
    },
    rectClip2() {
      return `url(#${this.clipId2})`;
    },
    color() {
      const p = Math.min(100, Math.max(0, this.animatedPercent));
      if (this.animatedPercent < 50) {
        return this.getColor(p, 216, 90, 76, 243, 177, 61);
      } else {
        return this.getColor(p, 243, 177, 61, 95, 193, 159);
      }
    },
    fontSize() {
      return Math.round(this.size * 0.15 ) + "px";
    },
    textY() {
      return Math.round(this.centerY + this.size * 0.05);
    },
    fontSize1() {
      return Math.round(this.size * 3 / 50) + "px";
    },
    textY1() {
      return Math.round((this.size * 15) / 16);
    },
  },
  data() {
    return {
      clipId1: v4(),
      clipId2: v4(),
      textStyle: {
        fontWeight: "bold"
      },
      animatedPercent: 0
    };
  },
  methods: {
    createPath(innerRadius, outerRadius) {
      const cy = this.size / 2;
      const angle = (this.animatedPercent * Math.PI) / 100;

      const p = [
        {
          x: this.size / 2 - outerRadius,
          y: cy
        },
        {
          x: this.centerX - outerRadius * Math.cos(angle),
          y: this.centerY - outerRadius * Math.sin(angle)
        },
        {
          x: this.centerX - innerRadius * Math.cos(angle),
          y: this.centerY - innerRadius * Math.sin(angle)
        },
        {
          x: this.size / 2 - innerRadius,
          y: cy
        }
      ];

      return `M ${p[0].x} ${p[0].y}
              A ${outerRadius} ${outerRadius} 0 0 1 ${p[1].x} ${p[1].y}
              L ${p[2].x} ${p[2].y}
              A ${innerRadius} ${innerRadius} 0 0 0 ${p[3].x} ${p[3].y}
              L ${p[0].x} ${p[0].y}`;
    },
    getColor(p, r1, g1, b1, r2, g2, b2) {
      const r = Math.round(((r2 - r1) * p) / 100 + r1);
      const g = Math.round(((g2 - g1) * p) / 100 + g1);
      const b = Math.round(((b2 - b1) * p) / 100 + b1);
      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  watch: {
    percent(newValue) {
      this.$nextTick(() => {
        const dir = this.animatedPercent > this.percent ? -1 : 1;
        this.animatedTimer = setInterval(() => {
          if (this.animatedPercent !== this.percent) {
            this.animatedPercent += dir;
          } else {
            clearInterval(this.animatedTimer);
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  flex: 1;
  text-align: center;
}
</style>
