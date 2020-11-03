<template>
  <div class="text-center">
    <v-dialog :value="dialog" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ status }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Please stand by",
    },
    canDismiss: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    // @update:return-value="$emit('start-extraction')"
    // dialog(val) {
    //   if (!val) return;
    //   setTimeout(() => (this.dialog = false), 4000);
    // },
    // $props: {
    //   handler: function (val, oldVal) {
    //     console.log("oldVal");
    //     console.log(oldVal);
    //     console.log("watch", val);
    //     setTimeout(() => (val.dialog = false), 4000);
    //   },
    //   deep: true,
    // },
  },
};
</script>