<template>
    <dialog-base title="객실 요금 조회" :instance="instance">
        <board-room-amount-view hide-title></board-room-amount-view>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase'
import BoardRoomAmountView from 'Components/Board/Amount/BoardRoomAmountView.vue'

export default {
  name: 'BoardRoomAmountSearchDialog',
  extends: DialogBase,
  components: { BoardRoomAmountView }
}
</script>
