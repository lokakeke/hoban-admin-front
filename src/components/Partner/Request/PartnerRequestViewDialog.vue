<template>
  <dialog-base :title="`위약취소환불 조회`" :instance="instance">
    <template v-slot:buttons v-if="isPartner && writeAuth && form.aprlCd==='A'">
      <v-btn dark text @click="updatePartnerRequestCancelForm">
        <v-icon left>check</v-icon>신청취소
      </v-btn>
      <v-btn dark text @click="openCreatePartnerRequestDialog">
        <v-icon left>check</v-icon>수정
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form" :key="key">
      <v-row dense class="mb-3">
        <v-col cols="12">
          <v-label>
            요청 순번
          </v-label>
          <v-text-field :value="form.requestSeq" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>신청자</v-label>
          <v-text-field :value="form.ptnrNm" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>신청일</v-label>
          <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <div>KEY 예약번호</div>
          <v-text-field :value="form.keyRsvNo" readonly disabled>
            <template v-slot:append-outer>
              <v-btn icon small color="primary" @click="openReservation(form.keyRsvNo)">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.updNm">
          <v-label>처리 담당자</v-label>
          <v-text-field :value="form.updNm" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.updDt">
          <v-label>처리 일자</v-label>
          <v-text-field :value="form.updDt | dateSet" readonly disabled></v-text-field>
        </v-col>
      </v-row>
      <v-card>
        <v-card-subtitle>
          <v-chip color="info">{{ form.requestTypeNm }}</v-chip>
          <br />
          <h1 class="mt-2"> {{ form.title }} </h1>
        </v-card-subtitle>
        <v-editor :content="form.contents" readonly></v-editor>
      </v-card>
      <div class="mb-6">
        <attach
          v-model="form.attachBag"
          ref-fld-cd="partnerReuqest"
          atfl-fld-val="file"
          extensions="gif,jpg,jpeg,png,pdf"
          accept="image/png, image/gif, image/jpeg, application/pdf"
          :limit="1"
          required
          readonly
        ></attach>
      </div>
      <v-row>
        <v-col md="6" cols="12">
          <v-label>처리 상태</v-label>
          <v-text-field :value="form.aprlNm" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>처리 메모</v-label>
          <v-textarea :value="form.memo" readonly disabled outlined class="mt-2" hide-details rows="4" placeholder="메모사항을 입력해 주세요." />
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 코드</v-label>
          <v-text-field :value="form.cancelResnNm" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 사유</v-label>
          <v-textarea v-model="form.cancelResnDesc" disabled readonly outlined class="mt-2" hide-details rows="4" placeholder="취소사유를 입력해 주세요." />
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-col cols="6" class="text-right">
          <v-btn outlined rounded color="info" @click="updatePartnerRequestCancelForm" v-if="isPartner && writeAuth && form.aprlCd==='A'">
            <v-icon>edit</v-icon>신청취소
          </v-btn>
          <v-btn outlined rounded color="info" @click="openCreatePartnerRequestDialog" v-if="isPartner && writeAuth && form.aprlCd==='A'">
            <v-icon>edit</v-icon>수정
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import partnerRequestService from 'Api/modules/partner/partnerRequest.service'
import commonService from 'Api/modules/system/commonCode.service'

export default {
  name: 'PartnerRequestViewDialog',
  extends: DialogBase,
  components: {
  },
  data () {
    return {
      // 폼
      form: null,
      // 취소코드 목록
      cancelResnList: null,
      // 화면갱신용 key
      key: 0
    }
  },
  computed: {
    /**
     * 마스킹된 작성자명
     */
    maskedCrtNm () {
      if (!this.form || !this.form.crtNm) {
        return ''
      }
      // 가나다 형태의 이름의 가운데를 변환한다.
      const crtNm = this.form.crtNm
      const length = crtNm.length
      const textArr = crtNm.split('')
      let hiddenName = textArr[0]
      for (let i = 0; i < length - 2; i++) {
        hiddenName += '*'
      }
      hiddenName += textArr[length - 1]
      return hiddenName
    }
  },
  mounted () {
    this.selectCancelTypeCdList()
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        this.form = _.cloneDeep(await this.selectPartnerRequest())
        this.key++
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 신청관리 > 위약취소환불 조회
     */
    async selectPartnerRequest () {
      const res = await partnerRequestService.selectPartnerRequest(
        this.instance.params.requestSeq
      )
      const requestPartner = res.data
      if (Number(requestPartner.requestSeq) !== Number(this.instance.params.requestSeq)) {
        this.$dialog.alert('존재하지 않는 위약취소환불 신청입니다.')
        this.close()
      }
      return requestPartner
    },
    /** 취소 사유 코드 목록 조회 */
    selectCancelTypeCdList () {
      commonService.selectDGNSCommonCodeList('RSV0096').then(res => {
        // 단순변심 코드 제외
        const cancelCdList = []

        res.data.forEach(item => {
          if (item.commCd === '01') return true
          cancelCdList.push(item)
        })

        this.cancelResnList = cancelCdList
      })
    },
    /** 취소 사유 코드 선택/변경시 */
    modifyCancelDesc (info) {
      const cancel = this.cancelResnList.filter(data => data.commCd === info)
      this.form.cancelResnDesc = cancel[0].commCdNm
    },
    /**
     * 신청관리 > 위약취소환불 > 수정 팝업 열기
     */
    openCreatePartnerRequestDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Request/PartnerRequestManagementDialog',
        params: {
          requestSeq: this.form.requestSeq
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.init()
          }
        }
      })
    },
    /**
     * 신청취소 폼
     */
    updatePartnerRequestCancelForm () {
      this.$dialog
        .confirm(
          '신청 취소 하시겠습니까?'
        )
        .then(() => {
          this.updatePartnerRequestCancel()
        })
        .catch(() => {})
    },
    /**
     * 신청 취소
     */
    updatePartnerRequestCancel () {
      const form = _.cloneDeep(this.form)
      partnerRequestService.updatePartnerRequestCancel(form.requestSeq).then(res => {
        this.$dialog.alert('신청 취소 되었습니다.')
        this.close()
      })
    },
    /**
     * 예약내역 팝업창 호출
     * @param keyRsvNo 예약 번호
     */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    }
  }
}
</script>
