<template>
  <dialog-base :instance="instance" :title="'객실 등록'">
    <only-room-info-component :dmStoreId="dmStoreId"></only-room-info-component>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import OnlyRoomInfoComponent from "./OnlyRoomInfoComponent"

export default {
  extends: DialogBase,
  name: 'ItemManagementRoomForm',
  components: {
    OnlyRoomInfoComponent
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
