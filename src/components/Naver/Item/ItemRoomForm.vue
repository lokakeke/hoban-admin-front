<template>
  <dialog-base :instance="instance" :title="'객실 등록'">
    <only-room-info-component :storeId="storeId"></only-room-info-component>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import OnlyRoomInfoComponent from './OnlyRoomInfoComponent'

export default {
  extends: DialogBase,
  name: 'ItemRoomForm',
  components: {
    OnlyRoomInfoComponent
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
