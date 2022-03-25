<template>
  <dialog-base :instance="instance" :title="'패키지 등록'">
    <package-info-component :dmStoreId="dmStoreId"></package-info-component>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import PackageInfoComponent from "./PackageInfoComponent"

export default {
  extends: DialogBase,
  name: 'ItemManagementPackageForm',
  components: {
    PackageInfoComponent
  },
  computed: {
    dmStoreId () {
      return this.instance.params.dmStoreId
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
  }
}
</script>
