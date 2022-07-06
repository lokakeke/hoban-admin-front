<template>
  <dialog-base :instance="instance" :title="'패키지 등록'">
    <package-info-component :storeId="storeId"></package-info-component>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import PackageInfoComponent from './PackageInfoComponent'

export default {
  extends: DialogBase,
  name: 'ItemPackageForm',
  components: {
    PackageInfoComponent
  },
  computed: {
    storeId () {
      return this.instance.params.storeId
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
