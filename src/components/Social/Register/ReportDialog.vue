<template>
  <dialog-base :instance="instance" :title="'품의서'">
  <v-form ref="dialogForm" lazy-validation autocomplete="off">
    <v-row>
      <v-editor v-model="report"></v-editor>
    </v-row>
  </v-form>
  <template v-slot:actions>
    <v-btn outlined rounded color="info" @click="closeDialog"><v-icon left>check</v-icon>적용</v-btn>
  </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'ReportDialog',
  data () {
    return {
      report: ''
    }
  },
  mounted () {
    this.report = this.instance.params.report
  },
  methods: {
    closeDialog () {
      this.close({ data: this.report })
    }
  }
}
</script>
