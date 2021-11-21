<template>
  <div>
    <v-app>
      <NaBarNavG
        @show-file-uploadpopup="showfileUploadpopup = $event"
        @settings-popup="settingspopup = true"
      />
      <v-main v-if="extractedText">
        <v-container fluid class="grey lighten-5">
          <v-row>
            <Extraction
              @cancel-extraction="doCancelExtraction"
              :extractedText="extractedText"
            />
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import NaBarNavG from "@/components/NavBarNavigators";
import Extraction from "@/components/Extraction";
import { mapActions } from "vuex";
export default {
  name: "Document",
  data() {
    return {
      extractedText: "",
      documentId: null,
      name: "",
      caption: "",
      createdOn: null,
    };
  },
  mounted() {
    console.log(this.$route.params.id);
  },
  components: {
    NaBarNavG,
    Extraction,
  },
  methods: {
    ...mapActions(["getDocumentDetails"]),
    doCancelExtraction() {
      window.location = "/";
    },
  },
  async created() {
    this.documentId = this.$route.params.id;
    try {
        const res = await this.getDocumentDetails(this.documentId);
        const { title, extractedText, createdOn } = res;
        this.name = title.name;
        this.caption = title.caption;
        this.extractedText = extractedText;
        this.createdOn = createdOn;
    } catch (error) {
      alert("Error retrieving file");
    }
  },
};
</script>