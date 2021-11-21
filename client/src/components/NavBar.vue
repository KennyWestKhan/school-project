<template>
  <v-app-bar app clipped-left color="primary" dark dense>
    <v-app-bar-nav-icon
      @click.stop="$emit('toggle-sidebar', !drawer)"
    ></v-app-bar-nav-icon>
    <!-- <v-icon class="mx-4" large>mdi-youtube</v-icon> -->
    <v-toolbar-title class="mr-12 align-center">
      <router-link class="nav-title" :to="{ name: 'Login' }">
        <span class>{{ appName }}</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-row align="center" style="max-width: 350px">
      <v-text-field
        v-model="search"
        :append-icon-cb="() => {}"
        placeholder="Search..."
        single-line
        clearable
        color="white"
        hide-details
        @keydown="searchDocument()"
        @keyup.13="searchDocument()"
      ></v-text-field>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "NavBar",
  props: {
    drawer: Boolean,
    navSearch: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      search: "",
      appName: "Panoptes",
      documents: [],
    };
  },
  methods: {
    ...mapActions(["getUserDocs"]),
    searchDocument() {
      if (!this.search) {
        this.getUserDocs();
        return;
      }
      const search = this.search.toLowerCase();
      const results = this.getScannedDocs.filter((item) => {
        const title = item.title.name.toLowerCase();
        const content = item.extractedText.toLowerCase();
        const caption = item.title.caption.toLowerCase();
        console.log({content})
        return title.indexOf(search) != -1 || content.indexOf(search) != -1 || caption.indexOf(search) != -1;
        // console.log({searchHit})
      });
      if(results){this.$store.commit("save_scanned_document", results)}else{this.getUserDocs();}
    },
  },
  computed: {
    ...mapGetters(["getScannedDocs"]),
  },
};
</script>

<style scoped>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.nav-title {
  text-decoration: none;
  color: white;
}
</style>