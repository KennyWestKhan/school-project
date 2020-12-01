<template>
  <v-row justify="center">
    <v-dialog :value="!!deleteInfo" persistent max-width="390">
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to delete {{ deleteInfo.name }} ?
        </v-card-title>
        <v-card-text>This action can't be reverted</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('cancel-delete', true)"
          >
            No
          </v-btn>
          <v-btn color="green darken-1" text @click="$emit('do-delete', true)">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    deleteInfo: Object,
  },
};
</script>