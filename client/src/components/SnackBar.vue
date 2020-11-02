<template>
  <v-snackbar
    v-model="getSnackBarInfo.visibility"
    transition="scale-transition"
    origin="center center"
    :timeout="timeout"
    right
    top
    :color="getSnackBarInfo.color ? getSnackBarInfo.color : 'blue'"
  >
    {{ getSnackBarInfo.message ? getSnackBarInfo.message : message }}

    <template v-slot:action="{ attrs }">
      <v-btn color="green" text v-bind="attrs"> x </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Snackbar",
  data: () => ({
    timeout: 2000,
  }),
  props: {
    message: { type: String, Default: "Welcome" },
  },
  computed: { ...mapGetters(["getSnackBarInfo"]) },
};
</script>