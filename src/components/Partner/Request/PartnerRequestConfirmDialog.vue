<template>
  <dialog-base :title="`위약취소환불 조회`" :instance="instance">
    <template v-slot:buttons v-if="writeAuth && form.aprlCode === 'A'">
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>처리
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row dense class="mb-3">
        <v-col cols="12">
          <v-label>
            요청 순번
          </v-label>
          <v-text-field :value="form.requestSeq" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>신청자</v-label>
          <v-text-field :value="form.ptnrName" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>신청일</v-label>
          <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.aprlIdName">
          <v-label>처리 담당자</v-label>
          <v-text-field :value="form.aprlIdName" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12" v-if="form.aprlDt">
          <v-label>처리 일자</v-label>
          <v-text-field :value="form.aprlDt | dateSet" readonly disabled></v-text-field>
        </v-col>
      </v-row>
      <v-card>
        <v-card-subtitle>
          <v-chip color="info">{{ form.requestTypeName }}</v-chip>
          <br />
          <h1 class="mt-2"> {{ form.title }} </h1>
        </v-card-subtitle>
        <v-editor :content="form.contents" readonly></v-editor>
      </v-card>
      <div class="mb-6">
        <attach
          v-model="form.attachBag"
          ref-fld-cd="partnerNotice"
          atfl-fld-val="file"
          extensions="gif,jpg,jpeg,png,pdf"
          accept="image/png, image/gif, image/jpeg, application/pdf"
          :limit="1"
          required
          readonly
        ></attach>
      </div>
      <v-row v-if="writeAuth&form.aprlCode === 'A'">
        <v-col md="6" cols="12">
            <v-label>처리 상태</v-label>
            <v-radio-group v-model="form.procAprlCode" row class="mt-2">
              <v-radio label="승인" value="B"></v-radio>
              <v-radio label="불가" value="C"></v-radio>
            </v-radio-group>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>메모</v-label>
          <v-textarea v-model="form.memo" outlined class="mt-2" hide-details rows="4" placeholder="메모사항을 입력해 주세요." />
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 코드</v-label>
          <v-autocomplete v-model="form.cancelResnCode"
                          autocomplete="off"
                          :items="cancelResnList"
                          :item-value="'commCode'"
                          :item-text="'commCodeName'"
                          hide-details
                          @change="modifyCancelDesc(form.cancelResnCode)"
          />
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 사유</v-label>
          <v-textarea v-model="form.cancelResnDesc" outlined class="mt-2" hide-details rows="4" placeholder="취소사유를 입력해 주세요." />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col md="6" cols="12">
          <v-label>처리 상태</v-label>
          <v-radio-group v-model="form.aprlCode" disabled readonly row class="mt-2">
            <v-radio label="승인" value="B"></v-radio>
            <v-radio label="불가" value="C"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>메모</v-label>
          <v-textarea v-model="form.memo" disabled readonly outlined class="mt-2" hide-details rows="4" placeholder="메모사항을 입력해 주세요." />
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 코드</v-label>
          <v-text-field :value="form.cancelResnName" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>취소 사유</v-label>
          <v-textarea v-model="form.orgCancelResnDesc" disabled readonly outlined class="mt-2" hide-details rows="4" placeholder="취소사유를 입력해 주세요." />
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="info" @click="save()" v-if="writeAuth && form.aprlCode === 'A'">
          <v-icon>check</v-icon>처리
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
import commonService from '@/api/modules/system/commonCode.service'

export default {
  name: 'PartnerRequestDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null,
      // 원본 폼
      orgForm: {}
    }
  },
  computed: {
  },
  mounted () {
    this.selectCancelTypeCodeList()
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        const partnerRequest = await this.selectPartnerRequest()
        this.form = _.cloneDeep(partnerRequest)
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
      res.data.orgCancelResnDesc = res.data.cancelResnDesc
      res.data.cancelResnDesc = null
      res.data.orgcancelResnCode = res.data.cancelResnCode
      res.data.cancelResnCode = null
      return res.data
    },
    /**
     * 신청관리 > 위약환불신청 수정(관리자)
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        const form = _.cloneDeep(this.form)
        form.aprlCode = form.procAprlCode
        form.cancelResnDesc = form.orgCancelResnDesc + '\n' + '\n' + form.cancelResnDesc

        partnerRequestService.updatePartnerRequestForAdmin(form).then(res => {
          this.$dialog.alert('수정이 완료되었습니다.')
          this.close()
        })
      })
    },
    /** 취소 사유 코드 목록 조회 */
    selectCancelTypeCodeList () {
      commonService.selectDGNSCommonCodeList('RSV0096').then(res => {
        // 단순변심 코드 제외
        const cancelCodeList = []

        res.data.forEach(item => {
          if (item.commCode === '01') return true
          cancelCodeList.push(item)
        })

        this.cancelResnList = cancelCodeList
      })
    },
    /** 취소 사유 코드 선택/변경시 */
    modifyCancelDesc (info) {
      const cancel = this.cancelResnList.filter(data => data.commCode === info)
      this.form.cancelResnDesc = cancel[0].commCodeName
    },
    /**
     * 입력폼 초기화
     */
    resetForm () {
      this.form = _.cloneDeep(this.orgForm)
    }
  }
}
</script>
