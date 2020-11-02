<template>
  <div>
    <v-file-input
      id="file-upload-element"
      v-model="files"
      color="deep-purple accent-4"
      counter
      accept="image/png, image/jpeg, image/bmp"
      label="Text extractor"
      multiple
      placeholder="Select your image"
      prepend-icon="mdi-paperclip"
      outlined
      @change="fileChangeHandler"
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
      @click.stop="doTextExtraction"
    >
      Extract text
      <template v-slot:loader>
        <span>Loading...</span>
      </template>
    </v-btn>
    <Standby
      :dialog="showStandbyPopUp"
      :status="extractingStatusMessage"
      :canDismiss="dismissPopUp"
    />
  </div>
</template>

<script>
import { createWorker, PSM, OEM } from "tesseract.js";
import Standby from "@/components/StandbyPopUp";
export default {
  name: "Fileupload",
  components: { Standby },
  data: () => ({
    showStandbyPopUp: false,
    dismissPopUp: null,
    srcFile: null,
    isLoading: false,
    extractingStatusMessage: "",
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
  methods: {
    rewriteStatusMsg(msg) {
      console.log(msg);
      switch (msg) {
        case "loading tesseract core":
          msg = "Breaking ice. Please wait...";
          break;
        case "initializing tesseract":
          msg = "solving world peace";
          break;
        case "initialized tesseract":
          msg = "searching for the infinity stones";
          break;
        case "loading language traineddata":
          msg = "Learning our ABCs";
          break;
        case "recognizing text":
          msg = "Extracting text from " + this.filename;
          break;
        default:
          break;
      }
      return msg;
    },
    async doTextExtraction() {
      console.log("extracting");
      this.showStandbyPopUp = true;

      const worker = createWorker({
        logger: (m) => {
          console.log(m);
          let progress = (m.progress * 100).toFixed(2);
          this.extractingStatusMessage =
            this.rewriteStatusMsg(m.status) + "-" + progress + "%";
          this.$emit("show-progress", progress);
        },
      });
      let img = document.createElement("img");

      this.filename = this.srcFile["name"];
      const src = URL.createObjectURL(this.srcFile);
      img.id = "hidden-image-ele";
      img.src = src;
      // document.body.appendChild(img);

      console.log(img);
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng", OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const {
        data: { text },
      } = await worker.recognize(img);
      console.log(text);

      if (text) {
        this.$emit("is-extracting-text", true);
        this.showStandbyPopUp = false;

        this.$emit("src-file", this.srcFile);
        this.$emit("extracted-text", text);
        this.$emit("close-upload-dialog");
      } else {
        this.dismissPopUp = true;
        this.extractingStatusMessage = "Sorry! Couldn't extract the text";
      }
      this.$emit("show-progress", 0);
      URL.revokeObjectURL(src);
      worker.terminate();
    },
    fileChangeHandler(event) {
      console.log(event);
      this.srcFile = event[0];
      console.log(this.srcFile);
      localStorage.setItem("filedets", this.srcFile);
      this.$emit("file-changed", event[0]);
    },
  },
};
</script>