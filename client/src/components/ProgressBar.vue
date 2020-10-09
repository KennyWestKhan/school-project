<template>
  <v-progress-linear
    :active="loading"
    :indeterminate="loading"
    above
    color="deep-purple accent-4"
  ></v-progress-linear>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    loading: { type: Boolean, Default: false },
  },
};
</script>