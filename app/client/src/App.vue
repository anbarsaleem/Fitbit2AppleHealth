<template>
  <div>
    <p class="App-intro">{{ apiResponse }}</p>
    <h1>HI</h1>
  </div>
  <img alt="Vue logo" src="./assets/logo.png" />
</template>

<script>
export default {
  data() {
    console.log("retrieving data");
    return {
      apiResponse: "",
    };
  },
  created() {
    this.callAPI();
    console.log("called api");
  },
  methods: {
    callAPI() {
      fetch("http://localhost:9000/testAPI")
        .then((res) => res.text())
        .then((res) => (this.apiResponse = res));
      console.log("fetched api response");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
