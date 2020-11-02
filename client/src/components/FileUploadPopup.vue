<template>
  <v-row justify="center">
    <v-dialog
      :value="showUploadDialog"
      @click:outside="$emit('close-upload-dialog')"
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <!-- <span class="headline">User Profile</span> -->
        </v-card-title>
        <v-card-text>
          <v-container>
            <Fileupload
              @extracted-text="$emit('extracted-text', $event)"
              @file-changed="srcFile = $event"
              @src-file="$emit('src-file', $event)"
              @is-extracting-text="$emit('is-extracting-text', $event)"
              @close-upload-dialog="$emit('close-upload-dialog')"
              @show-progress="$emit('show-progress', $event)"
            />
            <small>*Click outside the pop up to close</small>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Fileupload from "@/components/Fileupload";
// import generalMixin from "@/mixins/generalMixin";
export default {
  data: () => ({
    dialog: false,
  }),
  // mixins: [generalMixin],
  components: { Fileupload },
  props: {
    showUploadDialog: { type: Boolean, Default: false },
  },
  methods: {},
};
</script>