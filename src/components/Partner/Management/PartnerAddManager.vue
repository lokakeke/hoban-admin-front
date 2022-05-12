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
              <td class="text-center">{{item.managerName}}</td>
              <td class="text-center"><mask-tel-number :text="item.telNo" @search="viewTelNo(item)" /></td>
              <td class="text-center"><mask-email :text="item.email"></mask-email></td>
              <td class="text-center">{{item.useYn}}</td>
              <td class="text-center">{{item.mainAuthYn}}</td>
              <td class="text-center">{{item.lastLoginDatetime}}</td>
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
import partnerManagerService from '@/api/modules/partner/partnerManager.service'
import maskTelNumber from '@/components/Mask/MaskTelNumber.vue'
import MaskEmail from '@/components/Mask/MaskEmail.vue'

export default {
  components: { maskTelNumber, MaskEmail },
  props: {
    partnerSeq: Number,
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
  name: 'PartnerAddCharge',
  methods: {
    searchList () {
      this.list = []
      // FIXME partnerSeq props 로 받아와서 넘기도록 수정
      partnerManagerService.selectPartnerManagerList(1).then(res => {
        this.list = res.data
      })
    },
    async viewTelNo (item) {
      const res = await partnerManagerService.selectPartnerManagerDetail({ partnerSeq: item.partnerSeq, partnerManagerId: item.partnerManagerId })
      item.telNo = res.data.telNo
    },
    openDialog (row) {
      const isNew = row === undefined
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerAddManagerDialog',
        params: {
          isNew,
          form: row || { partnerSeq: this.partnerSeq, partnerManagerId: '', managerName: '', telNo: '', email: '', useYn: 'Y', mainAuthYn: 'N' },
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
