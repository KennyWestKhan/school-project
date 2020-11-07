<template>
  <v-app>
    <NaBarNavG
      @show-file-uploadpopup="showfileUploadpopup = $event"
      @settings-popup="settingspopup = true"
      :settingspopupProp="settingspopup"
    />
    <!-- navbar -->

    <v-main>
      <v-container fluid>
        <v-row>
          <div cols="12" sm="4" md="4" class="blockquote">
            <h3 v-if="hasDocs && !showCamera">Scanned documents</h3>
          </div>
        </v-row>

        <v-row v-if="isLoading">
          <v-col cols="12" sm="4" md="4" v-for="n in 3" :key="n">
            <v-skeleton-loader
              class
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <!-- skeleton loader -->

        <v-row
          align="center"
          justify="center"
          v-show="!isLoading && !hasDocs && !isextractingText && !showCamera"
          style="margin-top: 200px"
        >
          <v-col cols="12" sm="8" md="8">
            <div class="fileuploadsect">
              <span style="padding: 33px; color: #525658"
                >You don't have any scanned documents yet. Upload an image to
                extract text</span
              >
              <Fileupload
                v-show="!isLoading"
                style="margin-top: 35px"
                @hook:mounted="addDocTrigger = false"
                @src-file="extractedTextImgSrcDetails = $event"
                @extracted-text="extractedText = $event"
                @is-extracting-text="isextractingText = $event"
                @show-progress="showProgress = $event"
              />
            </div>
          </v-col>
        </v-row>

        <!-- scanned documents -->
        <v-row v-if="!isextractingText && !isLoading && hasDocs && !showCamera">
          <v-col
            cols="12"
            sm="4"
            md="4"
            lg="3"
            v-for="data in getScannedDocs"
            :key="data.id"
          >
            <Card :document="data" />
          </v-col>
        </v-row>

        <Camera
          v-if="showCamera"
          :showCamera="showCamera"
          @cancel-camera="showCamera = false"
        />

        <!-- Extraction section -->
        <v-row v-if="isextractingText">
          <Extraction
            @cancel-extraction="isextractingText = false"
            :extractedText="extractedText"
            :imgSrc="extractedTextImgSrcDetails"
          />
        </v-row>

        <SnackBar />
      </v-container>
    </v-main>
    <FloatingBtn
      @fl-btn-settings-popup="settingspopup = true"
      @open-file-upload-diaload="showfileUploadpopup = true"
      @show-camera="showCamera = true"
    />
    <FileUploadPopup
      :showUploadDialog="showfileUploadpopup"
      @close-upload-dialog="showfileUploadpopup = false"
      @src-file="extractedTextImgSrcDetails = $event"
      @extracted-text="extractedText = $event"
      @is-extracting-text="isextractingText = $event"
      @show-progress="showProgress = $event"
    />
    <v-progress-linear
      v-model="showProgress"
      :buffer-value="showProgress"
      color="cyan darken-2"
    ></v-progress-linear>
  </v-app>
</template>

<script>
const pageTitle = "Dashboard";

import Fileupload from "@/components/Fileupload";
import Camera from "@/components/Camera";
import FileUploadPopup from "@/components/FileUploadPopup";
import Card from "@/components/Card";
import SnackBar from "@/components/SnackBar";
import FloatingBtn from "@/components/FloatingBtn";
import Extraction from "@/components/Extraction";
import NaBarNavG from "@/components/NavBarNavigators";
import generalMixin from "@/mixins/generalMixin";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: pageTitle,
  mixins: [generalMixin],
  title: pageTitle,
  props: {
    source: String,
  },
  components: {
    Fileupload,
    Card,
    SnackBar,
    Camera,
    FloatingBtn,
    FileUploadPopup,
    Extraction,
    NaBarNavG,
  },
  data() {
    return {
      showProgress: 0,
      isextractingText: false,
      showCamera: false,
      filename: "",
      extractedText: "",
      extractedTextImgSrcDetails: null,
      search: "",
      settingspopup: false,
      showfileUploadpopup: false,
      isLoading: false,
      dialog: false,
      overlay: false,
      userSettings: null,
      addDocTrigger: true,
      scannedDocuments: [],
      userprofile: {},
    };
  },
  beforeCreate() {},
  created: function () {
    this.scannedDocuments = this.getUserDocs();
  },
  mounted: function () {
    this.$nextTick(function () {});
  },
  methods: {
    ...mapMutations["save_speech_details"],
    ...mapActions(["getUserDocs"]),
  },
  computed: {
    ...mapGetters([
      "getLoggedInProfile",
      "isLoggedIn",
      "getScannedDocs",
      "hasDocs",
    ]),
    getTheme: function () {
      return this.$root.vuetify.theme.isDark;
    },
  },
  // watch: {
  //   standybydialog(val) {
  //     if (!val) return;
  //     setTimeout(() => (this.standybydialog = false), 4000);
  //   },
  // },
};
</script>

<style scoped>
.active {
  background-color: #c1c1c1;
}
.flex {
  flex-grow: 0;
}

.flex-empty {
  height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.menuitem {
  cursor: pointer;
}
#hidden-image-ele {
  visibility: hidden;
}
</style>