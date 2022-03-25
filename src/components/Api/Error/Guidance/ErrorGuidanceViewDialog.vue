<template>
  <dialog-base title="오류 추천 조회" :instance="instance">
    <v-form ref="form" lazy-validation v-if="errorGuidance.errSeq">
      <v-row>
        <v-col cols="4">
          <v-label>오류순번</v-label>
          <v-text-field :value="errorGuidance.errSeq" readonly></v-text-field>
        </v-col>
        <v-col cols="8" v-if="errorGuidance.keyRsvNo">
          <v-label>예약키번호</v-label>
          <v-text-field :value="errorGuidance.keyRsvNo" readonly></v-text-field>
        </v-col>
        <v-col cols="4" v-if="errorGuidance.ticketNo">
          <v-label>우대번호</v-label>
          <v-text-field :value="errorGuidance.ticketNo" readonly></v-text-field>
        </v-col>
        <v-col cols="4" v-if="errorGuidance.ticketSeq">
          <v-label>우대순번</v-label>
          <v-text-field :value="errorGuidance.ticketSeq" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-label>오류코드 / 메시지</v-label>
          <v-text-field :value="`${errorGuidance.errCd} / ${errorGuidance.errMsg}`" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label>오류일자</v-label>
          <v-text-field :value="errorGuidance.errDt | dateSet" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="errorGuidance.procNm ? 6 : 12">
          <v-label>처리상태</v-label>
          <v-text-field readonly>
            <template v-slot:prepend-inner>
              <span class="green--text" v-if="errorGuidance.procStatCd === 'Y'">
                <v-icon small>mdi-check-circle-outline</v-icon>
                처리완료
              </span>
              <span class="red--text" v-if="errorGuidance.procStatCd === 'N'">
                <v-icon small>mdi-alert-circle-outline</v-icon>
                처리필요
              </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6" v-if="errorGuidance.procNm">
          <v-label>처리자</v-label>
          <v-text-field :value="errorGuidance.procNm" readonly></v-text-field>
        </v-col>
        <v-col cols="12" v-if="errorGuidance.memo">
          <v-label>처리메모</v-label>
          <v-text-field :value="errorGuidance.memo" readonly></v-text-field>
        </v-col>
        <v-col cols="12" v-if="errorGuidance.procDt">
          <v-label>처리일자</v-label>
          <v-text-field :value="errorGuidance.procDt | dateSet" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-col cols="6">
          <v-btn
            outlined
            rounded
            color="info"
            @click="openErrorGuidanceProcessDialog()"
            v-if="isProcessed === false && writeAuth"
          >
            <v-icon>check</v-icon>처리
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import errorGuidanceService from "Api/modules/api/errorGuidance.service"

export default {
  name: 'ErrorGuidanceViewDialog',
  extends: DialogBase,
  data () {
    return {
      errorGuidance: {
        errSeq: null
      }
    }
  },
  computed: {
    /**
     * OTA 여부
     */
    isOta () {
      return Boolean(this.$route.path.indexOf('/ota') === 0)
    },
    /**
     * Social 여부
     */
    isSocial () {
      return Boolean(this.$route.path.indexOf('/social') === 0)
    },
    /**
     * 업무유형 [ota|social]
     */
    taskType () {
      if (this.isOta === true) {
        return 'ota'
      } else if (this.isSocial === true) {
        return 'social'
      }
      return null
    },
    /**
     * 처리여부
     */
    isProcessed () {
      return Boolean(this.errorGuidance.procStatCd === 'Y')
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      this.selectErrorGuidance()
    },
    /**
     * 오류 추천 조회
     */
    async selectErrorGuidance () {
      if (!this.taskType) this.close()
      this.errorGuidance.errSeq = this.instance.params.errSeq
      if (!this.errorGuidance.errSeq) this.close()
      const res = await errorGuidanceService.selectErrorGuidance(
        this.taskType,
        this.errorGuidance.errSeq
      )
      this.errorGuidance = res.data
    },
    /**
     * 오류 추천 처리 다이얼로그 열기
     */
    openErrorGuidanceProcessDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Error/Guidance/ErrorGuidanceProcessDialog',
        params: {
          errSeq: this.errorGuidance.errSeq
        },
        options: {
          width: '500px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectErrorGuidance()
          }
        }
      })
    }
  }
}
</script>
