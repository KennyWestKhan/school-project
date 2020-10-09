<template>
  <v-row justify="center">
    <v-dialog
      :value="showUploadDialog"
      click:outside="$emit('close-upload-dialog')"
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <Fileupload />
            <small>*Click outside the pop up to close</small>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Fileupload from "@/components/Fileupload";
export default {
  data: () => ({
    dialog: false,
  }),
  components: { Fileupload },
  props: {
    showUploadDialog: { type: Boolean, Default: false },
  },
};
</script>