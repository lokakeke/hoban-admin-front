<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-right pb-0">
          <v-btn outlined rounded color="info" @click="openDialog()">
            <v-icon left>add</v-icon>추가
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-simple-table class="bordered click-row">
            <thead>
            <tr>
              <th class="text-center">닉네임</th>
              <th class="text-center">휴대폰 번호</th>
              <th class="text-center">이메일 주소</th>
              <th class="text-center">사용여부</th>
              <th class="text-center">슈퍼바이저 권한</th>
              <th class="text-center">마지막 로그인 일시</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in list" :key="index" @click="openDialog(item)">
              <td class="text-center">{{item.chrgNm}}</td>
              <td class="text-center"><mask-tel-number :text="item.telNo" @search="viewTelNo(item)" /></td>
              <td class="text-center"><mask-email :text="item.email"></mask-email></td>
              <td class="text-center">{{item.useYn}}</td>
              <td class="text-center">{{item.mainAuthYn}}</td>
              <td class="text-center">{{item.lastLoginDt | date('YYYY-MM-DD HH:mm:ss')}}</td>
            </tr>
            <tr v-if="!list || list.length === 0">
              <td colspan="6" class="text-center">담당자 정보가 없습니다.</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import partnerChargeService from 'Api/modules/partner/partnerCharge.service'
import maskTelNumber from 'Components/Mask/MaskTelNumber.vue'
import MaskEmail from 'Components/Mask/MaskEmail.vue'

export default {
  components: { maskTelNumber, MaskEmail },
  props: {
    partnerNo: String,
    isModify: Boolean
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.searchList()
  },
  name: 'PartnerAddChargeManagement',
  methods: {
    searchList () {
      this.list = []
      partnerChargeService.selectPartnerChargeList(this.partnerNo).then(res => {
        this.list = res.data
      })
    },
    async viewTelNo (item) {
      const res = await partnerChargeService.selectPartnerChargeDetail({ ptnrNo: item.ptnrNo, ptnrChrgId: item.ptnrChrgId })
      item.telNo = res.data.telNo
    },
    openDialog (row) {
      const isNew = row === undefined
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerAddChargeDialog',
        params: {
          isNew,
          form: row || { ptnrNo: this.partnerNo, ptnrChrgId: '', chrgNm: '', telNo: '', email: '', useYn: 'Y', mainAuthYn: 'N' },
          list: this.list
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.search) {
              this.searchList()
            }
          }
        }
      })
    }
  }
}
</script>
