<template>
  <div class="header">
    <div class="header-content">
      <div class="app-title">
        <span class="main">Sample Request System</span>
        <span class="sub">| Analytics</span>
      </div>
      <div class="logo"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
  background-color: #87352f;
  padding-bottom: 200px;
}
.header-content {
  display: flex;
  align-items: center;
  padding: 30px;
}
.app-title {
  flex: 1;

  .main {
    margin-right: 8px;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 2px;
  }

  .sub {
    font-size: 36px;
    font-weight: 300;
    letter-spacing: 3px;
  }
}
.logo {
  background-image: url("../assets/ProvingGround.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 60px;
  width: 300px;
}
</style>
