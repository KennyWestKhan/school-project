<template>
  <div>
    <Navbar v-on:toggle-sidebar="drawer = $event" v-bind:drawer="drawer" />
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-subheader class="mt-4 grey--text text--darken-1">
        <v-menu offset-y open-on-click>
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
          :to="platform.link"
          link
        >
          <v-list-item-content>
            <v-list-item-title style="text-align: left" @click="platform.text;"
              ><v-icon class=""> {{ platform.icon }}</v-icon>
              {{ platform.text }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <!-- <v-subheader class="mt-4 grey--text text--darken-1"
          >TEAM MEMBERS</v-subheader
        > -->

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

        <v-list-item
          class="mt-4"
          v-if="hasDocs"
          link
          @click="$emit('show-file-uploadpopup', true)"
        >
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
    <Settings
      v-if="settingspopup"
      :settingsDialog="settingspopup || settingspopupProp"
      @close-dialog="settingspopup = false"
      @display-settings-saved-resp="
        message = $event;
        settingspopup = !settingspopup;
      "
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Navbar from "@/components/NavBar";
import Settings from "@/components/Settings";
export default {
  data() {
    return {
      username: "",
      settingspopup: false,
      userSettings: null,
      menuItems: [
        { title: "Logout", icon: "mdi-logout", calBk: this.doLogout },
        // {
        //   title: "Delete account",
        //   icon: "mdi-delete",
        //   calBk: this.doDeleteAcc,
        // },
      ],
      team: [],
      userprofile: {},
      platforms: [
        { icon: "mdi-folder", text: " Documents", link: "/" },
        // { icon: "mdi-clipboard-text", text: " Extracted texts", link: "" },
      ],
      drawer: true,
    };
  },
  props: {
    settingspopupProp: {
      type: Boolean,
      default: false,
    },
  },
  components: { Navbar, Settings },
  mounted: function () {
    this.$nextTick(function () {
      this.username =
        this.$route.params.username || this.getLoggedInProfile.username;
      this.userSettings = this.getUserSettings();
    });
  },
  computed: {
    ...mapGetters(["getLoggedInProfile", "isLoggedIn", "hasDocs"]),
  },
  methods: {
    ...mapActions(["logout", "getUserSettings"]),
    doLogout() {
      this.logout().then(() => {
        // this.$router.push("/login");
        location.href = "/login";
      });
    },
  },
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