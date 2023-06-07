<template>
  <div>
    <div v-html="apiResponse" class="text-blue-300 text-center"></div>
    <h1 class="text-blue-400 text-center">HI</h1>
  </div>
  <img alt="Vue logo" src="./assets/logo.png" class="object-center w-60 h-60" />
</template>

<script>
/* eslint-disable */
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
      fetch("http://localhost:9000/fitbitAuth")
        .then((res) => res.text())
        .then((res) => (this.apiResponse = res));
      console.log("fetched fitbit auth response from api");
    },
  },
};
</script>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>
