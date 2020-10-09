<template>
  <div id="app">
    <v-app>
      <router-view />
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({}),
};
</script>

<style>
/* .v-application--wrap {
  min-height: 90vh !important;
} */
html {
  min-width: 100% !important;
  min-height: 100% !important;
}
</style>