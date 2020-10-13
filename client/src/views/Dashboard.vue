<template>
  <v-app>
    <Navbar v-on:toggle-sidebar="drawer = $event" v-bind:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-subheader class="mt-4 grey--text text--darken-1">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon class="">mdi-account</v-icon> Welcome,
              {{ username }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in menuItems"
              :key="index"
              class="menuitem"
            >
              <v-list-item-title @click="item.calBk"
                ><v-icon class="">{{ item.icon }}</v-icon
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-subheader>
      <v-list dense>
        <v-list-item
          v-for="platform in platforms"
          :key="'platform' + platform.text"
          link
        >
          <v-list-item-content>
            <v-list-item-title style="text-align: left" @click="platform.text;"
              ><v-icon class=""> {{ platform.icon }}</v-icon>
              {{ platform.text }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1"
          >TEAM MEMBERS</v-subheader
        >

        <v-list v-if="this.team.length > 0">
          <v-list-item v-for="item in team" :key="'team' + item._id" link>
            <v-list-item-avatar>
              <img
                :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`"
                alt
              />
            </v-list-item-avatar>
            <v-list-item-title
              v-text="capitalizeFirstLetter(item.firstName)"
            ></v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list-item class="mt-4" link @click="showfileUploadpopup = true">
          <v-list-item-action>
            <v-icon color="grey darken-1">mdi-plus-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1"
            >Add document</v-list-item-title
          >
        </v-list-item>

        <v-list-item link @click="settingspopup = true">
          <v-list-item-action>
            <v-icon color="grey darken-1">mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1"
            >Settings</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- navbar -->

    <v-main>
      <v-container fluid>
        <v-row>
          <div cols="12" sm="4" md="4" class="blockquote">
            <h3>Scanned documents</h3>
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
          v-show="!isLoading && !hasDocs && !isextractingText"
          style="margin-top: 200px"
        >
          <v-col cols="12" sm="12" md="8">
            <div class="fileuploadsect">
              <span style="padding: 33px; color: #525658"
                >You don't have any scanned documents yet. Upload an image to
                scan</span
              >
              <Fileupload
                v-show="!isLoading"
                @extract-text="doTextExtraction()"
                @file-changed="srcFile = $event"
                style="margin-top: 35px"
              />
            </div>
          </v-col>
        </v-row>

        <!-- scanned documents -->
        <v-row v-if="!isLoading && hasDocs">
          <v-col
            cols="12"
            sm="4"
            md="4"
            lg="3"
            v-for="data in getScannedDocs"
            :key="'doc' + data.id"
          >
            <Card :document="data" />
          </v-col>
        </v-row>

        <!-- Extraction section -->

        <v-row v-if="isextractingText">
          <Extraction
            @cancel-extraction="isextractingText = false"
            :extractedText="extractedText"
            :imgSrc="extractedTextImgSrc"
          />
        </v-row>

        <SnackBar />
        <Settings
          :settingsDialog="settingspopup"
          @close-dialog="settingspopup = false"
        />
      </v-container>
    </v-main>
    <FloatingBtn
      @open-dialog="settingspopup = true"
      @open-file-upload-diaload="showfileUploadpopup = true"
    />
    <FileUploadPopup
      :showUploadDialog="showfileUploadpopup"
      @close-upload-dialog="showfileUploadpopup = false"
    />
    <Standby :dialog="showStandbyPopUp" :status="extractingStatusMessage" />
    <!-- <img src="../assets/testocr.png" id="imgpp" alt="" /> -->
  </v-app>
</template>

<script>
const pageTitle = "Dashboard";
import Navbar from "@/components/NavBar";
import Fileupload from "@/components/Fileupload";
import FileUploadPopup from "@/components/FileUploadPopup";
import Card from "@/components/Card";
import SnackBar from "@/components/SnackBar";
import Settings from "@/components/Settings";
import FloatingBtn from "@/components/FloatingBtn";
import Extraction from "@/components/Extraction";
import Standby from "@/components/StandbyPopUp";
import { mapActions, mapGetters } from "vuex";
import { createWorker, PSM, OEM } from "tesseract.js";

export default {
  name: pageTitle,
  title: pageTitle,
  props: {
    source: String,
  },
  components: {
    Navbar,
    Fileupload,
    Card,
    SnackBar,
    Settings,
    FloatingBtn,
    FileUploadPopup,
    Extraction,
    Standby,
  },
  data() {
    return {
      srcFile: null,
      extractedText: "",
      extractedTextImgSrc: null,
      isextractingText: false,
      showStandbyPopUp: false,
      extractingStatusMessage: "",
      search: "",
      settingspopup: false,
      showfileUploadpopup: false,
      isLoading: false,
      dialog: false,
      overlay: false,
      drawer: true,
      username: "",
      scannedDocuments: [],
      menuItems: [
        { title: "Logout", icon: "mdi-logout", calBk: this.doLogout },
      ],
      userprofile: {},
      platforms: [
        { icon: "mdi-folder", text: " Documents" },
        { icon: "mdi-clipboard-text", text: " Extracted texts" },
      ],
      team: [],
    };
  },
  beforeCreate() {},
  created() {},
  mounted: function () {
    this.$nextTick(async function () {
      this.username = this.$route.params.username;
    });
  },
  methods: {
    ...mapActions(["verifyAuthToken", "logout"]),
    doLogout() {
      this.logout();
      this.$router.push("/login");
    },
    async doTextExtraction() {
      this.showStandbyPopUp = true;

      const worker = createWorker({
        logger: (m) => {
          console.log(m);
          this.extractingStatusMessage =
            m.status + "-" + (m.progress * 100).toFixed(2) + "%";
        },
      });
      let img = document.createElement("img");
      const src = URL.createObjectURL(this.srcFile);
      img.src = src;

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
      // document.getElementById("progress").innerHTML = text;
      console.log(text);
      worker.terminate();
      if (text) {
        this.isextractingText = true;
        this.showStandbyPopUp = false;

        this.extractedTextImgSrc = src;
        this.extractedText = text;
      } else {
        this.extractingStatusMessage = "Sorry";
      }
    },
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
    searchDocument() {
      if (!this.search) return this.getScannedDocs;

      const search = this.search.toLowerCase();

      return this.getScannedDocs.filter((item) => {
        const text = item.title.toLowerCase();

        return text.indexOf(search) > -1;
      });
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
</style>