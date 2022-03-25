<template>
    <dialog-base title="패키지 요금 조회" :instance="instance">
        <board-package-amount-view hide-title></board-package-amount-view>
    </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import BoardPackageAmountView from 'Components/Board/Amount/BoardPackageAmountView.vue'

export default {
  name: 'BoardPackageAmountSearchDialog',
  extends: DialogBase,
  components: { BoardPackageAmountView }
}
</script>
