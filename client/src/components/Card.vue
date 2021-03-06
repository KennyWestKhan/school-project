<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-img :src="getImgUrl('ocr.png')" height="200px"></v-img>

      <v-card-title>
        {{ truncateExtractedText(document.title.name, "26") }}
      </v-card-title>

      <v-card-subtitle>
        {{ document.title.caption }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn color="orange lighten-2" text :href="documentUrl(document._id)">
          Explore
        </v-btn>
        <!-- <v-btn color="indigo lighten-2" text> Share </v-btn> -->

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red"
              v-bind="attrs"
              v-on="on"
              text
              @click="handleDelete(document._id, document.title.name)"
            >
              DELETE
            </v-btn>
          </template>
          <span>Delete document</span>
        </v-tooltip>
        <v-spacer></v-spacer>

        <v-btn icon @click="doCopy(document.extractedText)">
          <v-icon>mdi mdi-content-copy</v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="show = !show">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </template>
          <span>Display document summary</span>
        </v-tooltip>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text>
            {{ truncateExtractedText(document.extractedText) }}</v-card-text
          >
        </div>
      </v-expand-transition> </v-card
    ><Standby :dialog="showStandbyPopUp" :status="statusMessage" />
    <ConfirmDeletePopUp
      v-if="!!selectedDoc"
      :deleteInfo="selectedDoc"
      @do-delete="doDelete"
      @cancel-delete="selectedDoc = null"
    />
  </div>
</template>

<script>
import Standby from "@/components/StandbyPopUp";
import ConfirmDeletePopUp from "@/components/ConfirmDeletePopUp";
import { mapActions } from "vuex";
export default {
  data: () => ({
    show: false,
    showStandbyPopUp: false,
    statusMessage: "",
    docImage: "../assets/ocr.png",
    confirmDelete: false,
    selectedDoc: null,
  }),
  props: {
    document: {
      type: Object,
    },
  },
  created: function () {},
  components: {
    Standby,
    ConfirmDeletePopUp,
  },
  computed: {},
  methods: {
    ...mapActions(["copyText", "deleteDoc"]),
    getImgUrl(imgName = "ocr.png") {
      return require('../assets/'+imgName)
    },
    truncateExtractedText: function (str, num) {
      num = num || 150;
      if (str.length <= num) {
        return str;
      }
      return str.slice(0, num) + "...";
    },
    doCopy: async function (str) {
      await this.copyText(str);
    },
    handleDelete: function (id, name) {
      console.log(id, name);
      this.selectedDoc = { id, name };
      this.confirmDelete = true;
    },
    doDelete: async function () {
      this.showStandbyPopUp = true;
      this.statusMessage = "Deleting document. Please wait..";
      await this.deleteDoc(this.selectedDoc.id)
        .catch((err) => console.log(err))
        .finally(() => {
          this.showStandbyPopUp = false;
          this.selectedDoc = null;
        });
    },
    documentUrl: function (id) {
      return "/document/" + id;
    },
  },
};
</script>

<style scoped>
</style>