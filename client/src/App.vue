<template>
  <div id="app">
    <v-app>
      <!-- <NaBarNavG
        v-if="showNavbar"
        @show-file-uploadpopup="showfileUploadpopup = $event"
        @settings-popup="settingspopup = true"
      /> -->
      <!-- navbar -->
      <router-view />
    </v-app>
  </div>
</template>

<script>
// import NaBarNavG from "@/components/NavBarNavigators";
export default {
  name: "App",
  // components: { NaBarNavG },
  data: () => ({
    showNavbar: false,
  }),
  created() {
    this.showNavbar = !!this.$route.name;
  },
  mounted() {
    // console.log(this.$route.name);
  },
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