<template>
  <v-container fluid class="" transition="dialog-bottom-transition">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-card
          class="pa-2"
          id="extractedTextImgCard"
          outlined
          tile
          :elevation="elevation"
        >
          <!-- <v-img
            class="white--text align-end"
            max-height="100%"
            :src="getImageSrc"
          >
          </v-img> -->
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-card class="pa-2" outlined tile :elevation="elevation">
          <span style="float: right" v-show="startAction"
            ><i class="mdi mdi-text-to-speech"></i
          ></span>
          <!-- <v-textarea
            class="extractedTextArea"
            counter
            label="Extracted text"
            :value="extractedText"
            readonly
            outlined
            autofocus
            style="height: 500px"
          ></v-textarea> -->
          <v-card-text
            class="text--primary"
            max-height="500px"
            contentEditable="true"
          >
            <div style="white-space: pre-wrap" id="extractedTextDiv">
              {{ extractedText }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12" id="extractedTextBtns">
        <v-btn
          class="ma-2"
          text
          color="success"
          dark
          @click="saveDialog = true"
        >
          SAVE
        </v-btn>
        <v-btn
          class="ma-2"
          text
          @click.stop="$emit('cancel-extraction')"
          @click="stopRead"
          color="red"
        >
          Cancel
        </v-btn>
        <v-btn class="ma-2" text @click="readExtractedText">{{
          actionText
        }}</v-btn>
        <v-btn
          v-if="startAction && !readPaused"
          class="ma-2"
          text
          color="success"
          @click="pauseRead"
          >PAUSE</v-btn
        >
        <v-btn
          v-if="readPaused"
          class="ma-2"
          text
          color="success"
          @click="reumeRead"
          >RESUME</v-btn
        >
      </v-col>
      <Standby :dialog="showStandbyPopUp" :status="extractingStatusMessage" />

      <v-dialog v-model="saveDialog" persistent max-width="600px">
        <!-- <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Open Dialog
          </v-btn>
        </template> -->
        <v-card>
          <v-card-title>
            <span class="headline">Document details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Document title*"
                    v-model="docTitle"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Document caption*"
                    v-model="docCaption"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="docStatus"
                    :items="['Public', 'Private']"
                    label="Status*"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="saveDialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveDoc()"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Standby from "@/components/StandbyPopUp";
import * as axios from "axios";
export default {
  name: "Extraction",
  data() {
    return {
      elevation: 3,
      vtextHeight: 650,
      startAction: false,
      actionText: "READ",
      readPaused: false,
      selectedVoice: null,
      selectedVolume: null,
      selectedPitch: null,
      selectedRate: null,
      showStandbyPopUp: null,
      extractingStatusMessage: null,
      saveDialog: false,
      docTitle: "",
      docCaption: "",
      docStatus: null,
      btnOpts: [
        {
          name: "READ",
          emit: "",
        },
        {
          name: "PAUSE",
          color: "red",
          clBk: "",
        },
      ],
    };
  },
  props: ["extractedText", "imgSrc"],
  components: { Standby },
  computed: {
    getImageSrc() {
      const imgsrc = URL.createObjectURL(this.imgSrc);
      localStorage.setItem("imgsrc", imgsrc);
      URL.revokeObjectURL(this.imgSrc);
      return imgsrc;
    },
    getHeight(elementId) {
      console.log(elementId);
      const elementDetails = document.getElementById(`'${elementId}'`);
      return elementDetails.offsetHeight;
    },
    ...mapGetters(["getSpeechDetail"]),
  },
  mounted() {
    this.$nextTick(async function () {
      this.getUserSettings();
    });
  },
  methods: {
    ...mapActions(["getUserSettings", "getUserDocs"]),
    async readExtractedText() {
      this.toggleAction();
      this.initialisePopUp();
      let speech = new SpeechSynthesisUtterance();
      let voices = speechSynthesis.getVoices();
      let speechSettings = this.getSpeechDetail;
      const { rate, pitch, voice, volume } = speechSettings;
      speech.volume = parseFloat(volume);
      speech.rate = parseFloat(rate);
      speech.pitch = parseFloat(pitch);
      speech.voice = null;
      if (this.startAction) {
        speech.lang = "en-US";
        let textInDiv = document.getElementById("extractedTextDiv").innerText;

        if (textInDiv.length <= 2) {
          textInDiv = this.extractedText;
        }
        speech.text = textInDiv;
        speech.voice = voices[voice];
        try {
          console.log(speech);
          window.speechSynthesis.speak(speech);
        } catch (error) {
          //alert here
          console.log(error);
        }
      } else {
        window.speechSynthesis.cancel();
      }

      speech.onend = () => {
        console.log("Done Speaking");
        this.actionText = "READ";
        this.startAction = false;
        this.initialisePopUp("stop");
      };
      speech.onstart = () => {
        this.initialisePopUp("stop");
      };
    },
    pauseRead() {
      window.speechSynthesis.pause();
      this.readPaused = true;
    },
    reumeRead() {
      window.speechSynthesis.resume();
      this.readPaused = false;
    },
    stopRead() {
      window.speechSynthesis.cancel();
    },
    toggleAction() {
      this.startAction = !this.startAction;
      this.readPaused = false;
      if (this.startAction) {
        this.actionText = "STOP";
      } else {
        this.actionText = "READ";
      }
    },
    initialisePopUp(action) {
      action = action || "start";
      if (action == "start") {
        this.showStandbyPopUp = true;
        this.extractingStatusMessage = "Clearing my throat";
      } else {
        this.showStandbyPopUp = this.extractingStatusMessage = null;
      }
    },
    saveDoc() {
      console.log("SAVING");
      // if (this.extractedText) {
      const userDocs = {
        extractedText: this.extractedText,
        caption: this.docCaption,
        title: this.docTitle,
        status: this.docStatus,
      };
      let payload = {
        visibility: true,
      };
      let message;
      axios
        .post("/document", userDocs, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            this.stopRead;
            payload.message = message = response.data.message;
            payload.color = "green";
            this.$emit("cancel-extraction", message);
            this.getUserDocs();
          }
        })
        .catch((error) => {
          payload.message = message = error.message;

          console.log(error);
        })
        .finally(() => this.$store.commit("toggle_snackbar", payload));
      // }
    },
  },
};
</script>

<style scoped>
/* .v-text-field__slot {
  height: 60vh !important;
}
.extractedTextArea {
  height: 600px !important;
} */
</style>