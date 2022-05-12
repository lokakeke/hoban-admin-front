<template>
  <v-row wrap>
    <app-card :heading="'파트너 리스트'" col-classes="col-12">
      <search-form init-search :search-param.sync="searchParam" :search-list="searchList" @search="search"/>
      <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="partnerNo" hide-default-footer disable-pagination
                    class="click-row bordered" @click:row="open($event)">
        <template v-slot:item.passwordReset="{item}">
          <partner-password-reset v-if="!isPartner || isSupervisor" :item="item" block />
          <span v-else> - </span>
        </template>
        <template v-slot:item.addAuthNo="{item}">
          <span v-if="!isPartner || isSupervisor">{{item.addAuthNo}}</span>
          <span v-else>**********</span>
        </template>
        <template v-slot:item.login="{item}">
          <partner-login-for-admin :item="item"></partner-login-for-admin>
        </template>
        <template v-slot:item.companyTelNo="{item}">
          <mask-tel-number :text="item.companyTelNo" @search="viewTelNo(item)" />
        </template>
      </v-data-table>
      <v-row>
        <v-col cols="12" class="text-right pb-0" v-if="writeAuth">
          <v-btn rounded color="info" @click="open()"><v-icon left>add</v-icon>신규 등록</v-btn>
        </v-col>
      </v-row>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import service from '@/api/modules/system/authentication/partner/partnerAccount.service'
import authService from '@/api/modules/system/authentication/partner/partnerMenuAuthGroup.service'
import maskTelNumber from '@/components/Mask/MaskTelNumber.vue'
import PartnerPasswordReset from '@/components/Partner/Management/PartnerPasswordReset.vue'
import PartnerLoginForAdmin from '@/components/Partner/Management/PartnerLoginForAdmin.vue'
import excelMixin from '@/mixins/excelMixin'

export default {
  components: { maskTelNumber, PartnerPasswordReset, PartnerLoginForAdmin },
  name: 'Partner',
  mixins: [excelMixin],
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      menuAuthList: []
    }
  },
  mounted () {
    authService.selectPartnerMenuAuthGroupListInUse().then(res => {
      this.menuAuthList = res.data
    })
    if (this.isPartner === true) {
      this.headers.forEach((header, headerIndex) => {
        if (header.text === '로그인') {
          this.headers.splice(headerIndex, 1)
        }
      })
    }
  },
  computed: {
    headers () {
      const headers = [
        { text: '업체 번호', value: 'partnerSeq', align: 'center', sortable: false },
        { text: '업체 명', value: 'companyName', align: 'center', sortable: false },
        { text: '로그인 아이디', value: 'loginId', align: 'center', sortable: false },
        { text: '사업자 번호', value: 'companyNo', align: 'center', sortable: false },
        { text: '관리자 성명', value: 'ceoName', align: 'center', sortable: false },
        { text: '관리자 연락처', value: 'companyTelNo', align: 'center', sortable: false },
        { text: '메뉴 권한', value: 'menuAuthGroupName', align: 'center', sortable: false },
        { text: '추가 인증번호', value: 'addAuthNo', align: 'center', sortable: false },
        { text: '잠김 여부', value: 'lockYn', align: 'center', sortable: false }
      ]
      if (!this.isPartner) {
        // 소셜
        headers.push({ text: '블랙리스트여부', value: 'blacklistYn', align: 'center', sortable: false })
      }
      headers.push({ text: '비밀번호 초기화', value: 'passwordReset', align: 'center', sortable: false })
      if (!this.isPartner) {
        // 로그인처리
        headers.push({ text: '로그인', value: 'login', align: 'center', sortable: false })
      }
      headers.push({ text: '마지막 로그인 일자', value: 'lastLoginDatetime', align: 'center', sortable: false })
      return headers
    },
    searchList () {
      const searchList = [
        { key: 'companyName', label: '파트너명', type: 'text' },
        { key: 'loginId', label: '로그인 아이디', type: 'text' },
        { key: 'ceoName', label: '대표자 성명', type: 'text' },
        { key: 'menuAuthGroupId', label: '메뉴 권한', type: 'select', list: this.menuAuthList, listValue: 'menuAuthGroupId', listText: 'menuAuthGroupName' },
        {
          key: 'lockYn',
          label: '잠김 여부',
          type: 'select',
          list: [
            { text: 'Y', value: 'Y' },
            { text: 'N', value: 'N' }
          ]
        }
      ]
      if (!this.isPartner) {
        searchList.push({ key: 'blacklistYn', label: '블랙리스트 여부', type: 'select', list: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }] })
      }
      searchList.push({ key: 'available', label: '서비스 효력여부', type: 'select', defaultValue: 'Y', list: [{ text: '활성중', value: 'Y' }, { text: '비활성', value: 'N' }] })
      return searchList
    }
  },
  methods: {
    search () {
      // 조회
      service.selectPartnerList(this.searchParam).then(res => {
        const list = []
        for (const data of res.data) {
          if (data.lastLoginDatetime) {
            data.lastLoginDatetime = moment(data.lastLoginDatetime).format('YYYY.MM.DD HH:mm:ss')
          } else {
            data.lastLoginDatetime = ' -- '
          }
          list.push(data)
        }
        this.list = list
        this.searchParam.total = res.pagination.total
      })
    },
    async viewTelNo (item) {
      const res = await service.selectPartnerDetails(item.partnerSeq)
      item.companyTelNo = res.data.companyTelNo
    },
    open (rowData) {
      let isModify = false
      let partnerSeq = 0
      let partnerName = ''
      if (rowData) {
        isModify = true
        partnerSeq = rowData.partnerSeq
        partnerName = rowData.companyName
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerDialog',
        params: {
          isModify,
          partnerSeq,
          partnerName,
          search: this.search
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    },
    passwordReset (row) {
      this.$dialog.confirm(`${row.companyName} 의 임시 비밀번호 발급을 진행하시겠습니까?`).then(() => {
        service.createTemporaryPassword(row.loginId).then(res => {
          console.log('임시 비밀번호 확인용 : ', res.data)
          this.$dialog.alert('임시 비밀번호가 발급되었습니다.')
        })
      })
    },
    exportExcel () {
      this.downLoadExcel('/api/cms/system/partner/excel', '파트너 리스트', this.searchParam)
    }
  }
}
</script>
