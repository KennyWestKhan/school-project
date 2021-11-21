<template>
  <div>
    <v-row justify="center">
      <v-dialog
        :value="settingsDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="$emit('close-dialog')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="saveSettings()"> Save </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-list three-line subheader>
              <v-subheader>User Controls</v-subheader>
              <v-list-item v-if="voiceVolume != null && selectedVoice != null">
                <v-list-item-content>
                  <v-list-item-subtitle
                    ><v-select
                      v-model="selectedPriority"
                      :eager="true"
                      no-data-text="No lang"
                      hint="What should be prioritized when extracting text from your images"
                      :items="this.priority"
                      item-text="name"
                      item-value="priorityID"
                      label="Text extraction priority"
                      menu-props="auto"
                      prepend-icon="mdi-account-settings"
                    ></v-select
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    ><v-select
                      v-model="selectedExtractingLang"
                      :eager="true"
                      no-data-text="No lang"
                      hint="Language to look out for when extracting text from your images"
                      :items="this.languages"
                      item-text="name"
                      item-value="langID"
                      menu-props="auto"
                      label="Select  extracting language"
                      prepend-icon="mdi-account-settings"
                    ></v-select
                  ></v-list-item-subtitle>

                  <v-list-item-title>Select voice </v-list-item-title>
                  <v-list-item-subtitle
                    ><v-select
                      v-model="selectedVoice"
                      :eager="true"
                      no-data-text="No voices"
                      hint="Voice to read extracted text"
                      :items="this.speechVoices"
                      item-text="name"
                      item-value="voiceID"
                      label="Select voice for text reading"
                      prepend-icon="mdi-account-settings"
                      single-line
                    ></v-select
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    ><v-slider
                      style="margin-top: 50px"
                      v-model="voicePitch"
                      :rules="rules"
                      label="Select voice pitch"
                      thumb-label="always"
                      ticks
                      max="2"
                      min="1"
                      prepend-icon="mdi-volume-high"
                    ></v-slider>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    ><v-slider
                      style="margin-top: 50px"
                      v-model="voiceRate"
                      max="10"
                      min="0.1"
                      :rules="rules"
                      label="Select voice reading rate"
                      thumb-label="always"
                      ticks
                      prepend-icon="mdi-volume-high"
                    ></v-slider>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Password</v-list-item-title>
                  <v-list-item-subtitle
                    >Require password for purchase or use password to restrict
                    purchase</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>General</v-subheader>
              <!-- <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="pushNotifications"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Notifications</v-list-item-title>
                  <v-list-item-subtitle
                    >Notify me about when text extraction is
                    done</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item> -->
              <v-list-item
                ><v-list-item-content style="cursor: pointer">
                  <v-list-item-title
                    ><span @click="deleteAccount()"
                      ><span class="mdi mdi-delete"></span> Delete account</span
                    >
                  </v-list-item-title>
                </v-list-item-content></v-list-item
              >
            </v-list>
          </v-card-text>

          <div style="flex: 1 1 auto"></div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "Settings",
  data() {
    return {
      //   settingsDialog: true,
      notifications: false,
      speechVoices: [],
      selectedVoice: null,
      selectedExtractingLang: "en",
      selectedPriority: 0,
      speechInfo: {},
      sound: true,
      e1: "Alice",
      widgets: false,
      voiceVolume: null,
      voicePitch: null,
      voiceRate: null,
      pushNotifications: null,
      languages: [
        { name: "English", langID: "eng" },
        { name: "Chinese", langID: "Ch" },
        { name: "Russian", langID: "Ru" },
      ],
      priority: [
        {
          name: "Speed",
          priorityID: 1,
        },
        {
          name: "Accuracy",
          priorityID: 0,
        },
      ],
      rules: [(v) => v <= 60 || "Above 60 might harm your hearing"],
    };
  },
  props: {
    settingsDialog: { type: Boolean, Default: false },
  },
  methods: {
    ...mapActions(["getUserSettings", "saveUserSettings"]),
    async saveSettings() {
      // let selectedVoiceIndexDets = this.selectedVoice.split("-");
      // const selectedVoiceIndex = selectedVoiceIndexDets[0];
      const settings = {
        volume: this.voiceVolume,
        rate: this.voiceRate,
        pitch: this.voicePitch,
        voice: this.selectedVoice,
        pushNotifications: !!this.pushNotifications,
        extractingLang: this.selectedExtractingLang,
      };

      await this.saveUserSettings(settings)
        .then((msg) => this.$emit("close-dialog", msg))
        .catch((error) => console.log(error));
    },
    populateVoiceList() {
      // console.log("populating");
      if (typeof window.speechSynthesis === "undefined") {
        console.log("no speech");
        return;
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices) {
        for (var i = 0; i < voices.length; i++) {
          // console.log(voices[i]);
          const speechObj = {};
          speechObj.name = voices[i].name + " (" + voices[i].lang + ")";
          // if (voices[i].default) {
          //   speechObj.name = "DEFAULT";
          // }
          speechObj.voiceID = i;
          speechObj.dataLang = voices[i].lang;
          speechObj.dataName = voices[i].name;
          // console.log(i);
          this.speechVoices.push(speechObj);
        }
      } else {
        console.log("not available");
      }
    },
    deleteAccount() {
      console.info("deleted");
    },
  },
  computed: {
    // ...mapGetters(["getSpeechDetail"]),
  },
  created: async function () {
    this.populateVoiceList();
    const res = await this.getUserSettings();
    const retSettings = res.userSettings;
    const { rate, pitch, voice, volume } = retSettings.speech;
    const { notifications, extractingLang } = retSettings;
    this.pushNotifications = !!notifications.pushNotifications;
    this.voiceVolume = volume;
    this.voiceRate = rate;
    this.voicePitch = pitch;
    this.selectedVoice = voice;
    console.log(extractingLang);
    this.selectedExtractingLang = extractingLang;
    console.log(rate, pitch, voice);
  },
  mounted() {
    this.$nextTick(function () {});
  },
};
</script>

<style scoped>
.v-slider--horizontal {
  margin-right: 10px !important;
}
</style>

