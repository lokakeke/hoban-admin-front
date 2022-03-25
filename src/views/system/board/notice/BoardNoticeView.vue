<template>
  <v-card class="mt-6 contents-850">
    <v-card-text>
      <board-notice-view-form :notice-seq="noticeSeq" @close="close"></board-notice-view-form>
    </v-card-text>
  </v-card>
</template>

<script>
import BoardNoticeViewForm from 'Components/Board/Notice/BoardNoticeViewForm.vue'

export default {
  name: 'BoardNoticeView',
  components: {
    BoardNoticeViewForm
  },
  props: {
    /**
     * 공지사항 순번
     */
    noticeSeq: {
      type: String,
      required: true
    }
  },
  methods: {
    close () {
      this.$router.push('/board/boardNotice')
    }
  }
}
</script>
