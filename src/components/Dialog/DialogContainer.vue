<template>
  <div class="dialog_container">
    <component v-for="instance in dialog.instances" :key="instance.options.uuid" :is="instance.component" :instance="instance" />
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: 'DialogContainer',
  computed: {
    ...mapState({
      dialog: 'dialog'
    })
  }
}
</script>
