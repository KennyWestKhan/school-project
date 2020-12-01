<template>
  <v-row align="center" justify="center" :key="componentKey">
    <v-col cols="12" sm="12" md="8" lg="8">
      <v-card class="mx-auto">
        <WebCam
          ref="deviceCam"
          :deviceId="deviceId"
          @cameras="onCameras"
          @camera-change="onCameraChange"
          @started="cameraOn = true"
          :isFrontCam="frontCam"
          v-if="!img"
          height="auto"
          @error="handleError"
        >
        </WebCam>

        <v-img
          v-if="img"
          class="white--text align-end"
          height="auto"
          :src="img"
        >
        </v-img>
        <v-card-subtitle class="pb-0" v-if="cameraOn">
          {{ cameraLabel }} is recording
        </v-card-subtitle>

        <!-- <v-card-text class="text--primary">
          <div>Whitehaven Beach</div>

          <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text> -->

        <v-card-actions>
          <v-btn color="orange" text @click="onCapture" v-if="cameraOn">
            Capture
          </v-btn>

          <v-btn color="error" text @click="onStop()"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { WebCam } from "vue-cam-vision";
import { find, head } from "lodash";
export default {
  data() {
    return {
      captures: [],
      imgReport: [],
      cameraOn: false,
      frontCam: false,
      webcam: null,
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      componentKey: 0,
      cameraLabel: null,
      // googleKey: config.googleVisionKey,
    };
  },
  components: {
    WebCam,
  },
  props: {
    showCamera: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    mobileCheck() {
      let check = false;
      check = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      return check;
    },
    forceRerender() {
      this.componentKey += 1;
    },
    handleError() {
      alert("failed to get camera");
      this.onStop();
    },
    async sendGVision() {
      const res = await this.$refs.deviceCam.googleVision();
      console.log(res);
      this.report = res.labelAnnotations;
    },
    async onCapture() {
      console.log("capturing");
      this.img = await this.$refs.deviceCam.capture();
    },
    onStarted(stream) {
      this.cameraOn = true;
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      // this.$refs.deviceCam.stop();
      // this.$refs.deviceCam.stopStreamedVideo;
      this.img = null;
      this.$emit("cancel-camera");
    },
    onStart() {
      this.$refs.deviceCam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      // console.log(cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
  },
  computed: {
    device: function () {
      return find(this.devices, (n) => n.deviceId == this.deviceId);
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      const isMobile = this.mobileCheck();
      let firstCamera;
      let lastCamera;
      firstCamera = head(this.devices);
      lastCamera = this.devices[
        Object.keys(this.devices)[Object.keys(this.devices).length - 1]
      ];
      console.log(this.devices[2]);
      console.log(lastCamera);

      // if (typeof window.orientation === "undefined") {
      // Once we have a list select the first one
      let cameraSelected;
      if (isMobile) {
        cameraSelected = lastCamera;
      } else {
        cameraSelected = firstCamera;
      }
      if (cameraSelected) {
        this.camera = cameraSelected.deviceId;
        this.deviceId = cameraSelected.deviceId;
        this.cameraLabel = cameraSelected.label;
      }
      // } else {
      this.frontCam = firstCamera ? false : true;
      // }
    },
  },
  filters: {
    percent: function (value) {
      if (!value) return "";
      return (Math.floor(value * 10000) / 100).toFixed(0) + "%";
    },
  },
  mounted() {
    // this.take_photo();
  },
};
</script>

<style scoped>
</style>