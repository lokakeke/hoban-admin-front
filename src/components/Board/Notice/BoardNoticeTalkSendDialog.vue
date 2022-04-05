<template>
  <dialog-base :title="`공지사항 알림톡 발송`" :instance="instance">
    <template v-slot:buttons v-if="writeAuth">
      <v-btn dark text @click="sendBoardNoticeTalk">
        <v-icon left>send</v-icon>발송
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col cols="12">
              <v-label>제목</v-label>
              <v-text-field
                v-model="form.talkTitle"
                counter="100"
                placeholder="제목을 입력해 주세요."
                :rules="maxLengthRules(100).concat(emptyRules)"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-label>내용</v-label>
              <v-textarea
                v-model="form.talkContents"
                counter="700"
                auto-grow
                no-resize
                rows="3"
                :rules="maxLengthRules(700).concat(emptyRules)"
              ></v-textarea>
            </v-col>
            <v-col cols="12" v-if="notice.ptnrList && notice.ptnrList.length > 0">
              <v-label>발송대상 파트너</v-label>
              <div class="mt-2" v-if="notice.allPtnrYn !== 'Y'">
                <v-chip
                  class="ma-1"
                  v-for="partner in notice.ptnrList"
                  :key="partner.ptnrNo"
                >{{ partner.ptnrName }}</v-chip>
              </div>
              <div class="mt-2" v-else>
                <!-- 전체 파트너 -->
                <v-chip color="primary">전체 파트너</v-chip>
              </div>
              <hr class="mt-1 mb-3" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-label>미리보기</v-label>
          <v-card class="mt-3">
            <v-card-title>{{ talkMessageTitle }}</v-card-title>
            <v-card-text style="white-space: pre-wrap;">{{ talkMessage }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-col cols="12" class="text-right">
          <v-btn outlined rounded color="info" @click="sendBoardNoticeTalk" v-if="writeAuth">
            <v-icon>send</v-icon>발송하기
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import boardNoticeService from '@/api/modules/system/boardNotice.service'
import smsNotiService from '@/api/modules/system/smsNoti.service'

export default {
  name: 'BoardNoticeTalkSendDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        /**
         * 알림톡 제목
         */
        talkTitle: '',
        /**
         * 알림톡 내용
         */
        talkContents: ''
      },
      /**
       * 알림톡 템플릿 객체
       */
      talkTemplate: null
    }
  },
  computed: {
    /**
     * 공지사항
     */
    notice () {
      return this.instance.params.notice
    },
    /**
     * 알림톡 메세지 제목
     */
    talkMessageTitle () {
      let talkMessageTitle = ''
      if (this.talkTemplate) {
        talkMessageTitle = this.talkTemplate.title
      }
      return talkMessageTitle
    },
    /**
     * 알림톡 메세지
     */
    talkMessage () {
      let talkMessage = ''
      if (this.talkTemplate) {
        talkMessage = this.talkTemplate.notifyDesc
        talkMessage = talkMessage.replace(
          '#{1}',
          this.form.talkTitle || '---제목이 들어가는 영역---'
        )
        talkMessage = talkMessage.replace(
          '#{2}',
          this.form.talkContents || '---내용이 들어가는 영역---'
        )
      }
      return talkMessage
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.selectTalkTemplate()
      this.form.talkTitle = this.notice.title
    },
    /**
     * 알림톡 템플릿 가져오기
     */
    async selectTalkTemplate () {
      const res = await smsNotiService.selectList({
        useYn: 'Y'
      })
      let talkTemplate = null
      res.data.some((smsNoti) => {
        if (smsNoti.notifyId === 'RMS_NOTI_01') {
          talkTemplate = smsNoti
        }
        return Boolean(talkTemplate)
      })
      this.talkTemplate = talkTemplate
    },
    /**
     * 공지사항 알림톡 발송
     */
    async sendBoardNoticeTalk () {
      try {
        await this.validForm(this.$refs.form)
        await this.$dialog.confirm('알림톡을 발송하시겠습니까?')
        boardNoticeService.sendBoardNoticeTalk(
          this.notice.noticeSeq,
          this.form.talkTitle,
          this.form.talkContents
        )
      } catch {
        // no action
      }
    }
  }
}
</script>
