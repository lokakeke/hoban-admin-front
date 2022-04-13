<template>
  <dialog-base :title="`위약취소환불 ${modeText}`" :instance="instance">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>{{ modeText }}
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row v-if="isNew === false">
        <v-col cols="4">
          <v-label>요청 순번</v-label>
          <v-text-field :value="form.requestSeq" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>신청자</v-label>
          <v-text-field :value="form.companyName" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>신청일</v-label>
          <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.updName">
          <v-label>처리 담당자</v-label>
          <v-text-field :value="form.updName" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.updDt">
          <v-label>처리 일자</v-label>
          <v-text-field :value="form.updDt | dateSet" readonly disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="3" cols="12">
          <v-label>요청 유형</v-label>
          <v-autocomplete v-model="form.requestType"
                          autocomplete="off"
                          :items="requestTypeList"
                          :item-value="'commCode'"
                          :item-text="'commCodeName'"
                          hide-details
                          :rules="emptyRules"
          />
        </v-col>
        <v-col md="6" cols="12">
          <v-label>요청 제목</v-label>
          <v-text-field
            v-model="form.title"
            counter="500"
            placeholder="제목을 입력해 주세요."
            :rules="maxLengthRules(500).concat(emptyRules)"
          ></v-text-field>
        </v-col>
        <v-col md="3" cols="12">
          <v-label>KEY 예약번호</v-label>
          <v-text-field
            v-model="form.keyRsvNo"
            placeholder="KEY예약번호(10자리)"
            :rules="maxLengthRules(10).concat(emptyRules)"
          >
          </v-text-field>
       </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12">
          <v-label>요청 사유</v-label>
          <v-editor v-model="form.contents" required></v-editor>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12">
          <attach
            v-model="form.attachBag"
            ref-fld-cd="partnerRequest"
            atfl-fld-val="file"
            extensions="gif,jpg,jpeg,png,pdf,xls,xlsx"
            accept="image/png, image/gif, image/jpeg, application/pdf, application/vnd.ms-excel, application/msexcel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :limit="1"
            label="첨부파일"
            required
          ></attach>
          <span class="grey--text">※ gif, jpg, jpeg, png, pdf, xls, xlsx 확장자를 가진 파일만 첨부 가능합니다.</span>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="orange" @click="resetForm()" v-if="writeAuth && isNew">
          <v-icon>refresh</v-icon>원래대로
        </v-btn>
        <v-btn outlined rounded color="info" @click="save()" v-if="writeAuth">
          <v-icon>check</v-icon>
          {{ modeText }}
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close()">
          <v-icon>close</v-icon>닫기
        </v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerRequestService from '@/api/modules/partner/partnerRequest.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

const DEFAULT_FORM = {
  title: '',
  contents: '',
  requestTypeName: '',
  requestType: '',
  keyRsvNo: '',
  partnerSeq: '',
  attachBag: {
    file: []
  }
}

export default {
  name: 'PartnerRequestDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null,
      // 원본 폼
      orgForm: {},
      // 요청 유형 목록
      requestTypeList: [],
      // 영업장 목록
      storeList: [],
      // 파트너 목록
      ptnrList: []
    }
  },
  computed: {
    /**
     * 신규 등록 여부
     */
    isNew () {
      let isNew = true
      try {
        isNew = Boolean(this.instance.params.requestSeq) === false
      } catch {}
      return isNew
    },
    /**
     * 등록 or 수정 텍스트
     */
    modeText () {
      return this.isNew === true ? '등록' : '수정'
    },
    /**
     * 게시기간 배열
     */
    pstngRangeYmd: {
      get () {
        return [this.form.pstngBgnYmd, this.form.pstngEndYmd]
      },
      set (pstngRangeYmd) {
        this.form.pstngBgnYmd = pstngRangeYmd[0]
        this.form.pstngEndYmd = pstngRangeYmd[1]
      }
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        await Promise.all([
          this.selectRequestTypeList()
        ])
        if (this.isNew === true) {
          this.form = _.cloneDeep(DEFAULT_FORM)
        } else {
          const partnerRequest = await this.selectPartnerRequest()
          this.form = _.cloneDeep(partnerRequest)
        }
        this.orgForm = _.cloneDeep(this.form)
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
      return res.data
    },
    /** 신청관리 > 위약취소환불 요청유형 목록 조회 */
    selectRequestTypeList () {
      commonCodeService.selectCommonCode('OTA0008').then(res => {
        const requestTypeList = []

        res.data.forEach(item => {
          requestTypeList.push(item)
        })

        this.requestTypeList = requestTypeList
      })
    },
    /**
     * 신청관리 > 위약취소환불 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        if (!(this.form.keyRsvNo && /^[0-9]{10}$/.test(this.form.keyRsvNo))) {
          this.$dialog.alert('KEY예약번호는 10자리 숫자입니다.')
        } else {
          const form = _.cloneDeep(this.form)
          partnerRequestService[
            `${this.isNew === true ? 'insert' : 'update'}PartnerRequest`
          ](form).then(res => {
            this.$dialog.alert(`${this.modeText}이 완료되었습니다.`)
            this.close()
          })
        }
      })
    },
    /**
     * 입력폼 초기화
     */
    resetForm () {
      this.form = _.cloneDeep(this.orgForm)
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
