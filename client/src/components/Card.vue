<template>
  <v-card class="mx-auto" max-width="344">
    <v-img :src="document.docImage" height="200px"></v-img>

    <v-card-title> {{ document.title }} </v-card-title>

    <v-card-subtitle>
      {{ document.extractedTextTitle }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange lighten-2" text :href="documentUrl(document.id)">
        Explore
      </v-btn>
      <v-btn color="indigo lighten-2" text> Share </v-btn>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="red"
            v-bind="attrs"
            v-on="on"
            text
            @click="doDelete(document.id)"
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
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
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
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    show: false,
  }),
  props: {
    document: {
      type: Object,
    },
  },
  created() {},
  computed: {},
  methods: {
    ...mapActions(["copyText", "deleteDoc"]),
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
    doDelete: async function (id) {
      await this.deleteDoc(id);
    },
    documentUrl(id) {
      return "/document/" + id;
    },
  },
};
</script>

<style scoped>
</style>