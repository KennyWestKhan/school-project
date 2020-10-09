<template>
  <v-snackbar
    v-model="getSnackBarInfo.visibility"
    :timeout="timeout"
    right
    top
    color="blue"
  >
    {{ getSnackBarInfo.message ? getSnackBarInfo.message : "Welcome " }}

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
  props: {},
  computed: { ...mapGetters(["getSnackBarInfo"]) },
};
</script>