<template>
    <dialog-base :title="`공지사항 조회`" :instance="instance">
        <template v-slot:buttons v-if="writeAuth">
            <v-btn dark text @click="openUpdateBoardNoticeDialog">
                <v-icon left>edit</v-icon>
                수정
            </v-btn>
        </template>
        <board-notice-view-form :notice-seq="instance.params.noticeSeq" dialog :key="componentKey"
                                @close="close"></board-notice-view-form>
    </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import BoardNoticeViewForm from 'Components/Board/Notice/BoardNoticeViewForm.vue'

export default {
  name: 'BoardNoticeViewDialog',
  extends: DialogBase,
  components: {
    BoardNoticeViewForm
  },
  data () {
    return {
      componentKey: 0
    }
  },
  methods: {
    /**
         * 게시판 > 공지사항 수정 팝업 열기
         */
    openUpdateBoardNoticeDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Notice/BoardNoticeManagementDialog',
        params: {
          noticeSeq: this.instance.params.noticeSeq
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.componentKey++
          }
        }
      })
    }
  }
}
</script>
