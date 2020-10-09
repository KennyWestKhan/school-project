<template>
  <div>
    <v-file-input
      v-model="files"
      color="deep-purple accent-4"
      counter
      accept="image/png, image/jpeg, image/bmp"
      label="File input"
      multiple
      placeholder="Select your image"
      prepend-icon="mdi-paperclip"
      outlined
      :show-size="1000"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
          {{ text }}
        </v-chip>

        <span
          v-else-if="index === 2"
          class="overline grey--text text--darken-3 mx-2"
        >
          +{{ files.length - 2 }} File(s)
        </span>
      </template>
    </v-file-input>
    <!-- <v-btn
      :loading="isLoading"
      :disabled="files.length == 0"
      color="blue-grey"
      class="ma-2 white--text"
      fab
      @click="loader = !isLoading"
      style="float: right"
    >
      <v-icon dark> mdi-cloud-upload </v-icon>
    </v-btn> -->

    <v-btn
      class="ma-2"
      :loading="isLoading"
      :disabled="files.length == 0"
      color="success"
      @click="loader = isLoading"
      style="float: right"
    >
      Extract text
      <template v-slot:loader>
        <span>Loading...</span>
      </template>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Fileupload",
  components: {},
  data: () => ({
    isLoading: false,
    rules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Image size should be less than 2 MB!",
    ],
    files: [],
  }),
  watch: {
    loader() {
      const l = this.isLoading;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.isLoading = null;
    },
  },
};
</script>