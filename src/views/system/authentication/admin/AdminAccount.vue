<template>
  <v-row wrap>
    <app-card :heading="'관리자 리스트'" col-classes="col-12">
      <search-form init-search :search-param.sync="searchParam" :search-list="searchList" @search="search"></search-form>
      <v-data-table :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="list" hide-default-footer disable-pagination
                    @click:row="showDetail($event)" class="click-row bordered">
        <template v-slot:item.passwordReset="{item}">
          <account-password-reset :item="item"></account-password-reset>
        </template>
        <template v-slot:item.lastLoginDt="{ item }">
          {{ item.lastLoginDt | date('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:item.telNo="{item}">
          <mask-tel-number :text="item.telNo" @search="viewTelNo(item)" />
        </template>
        <template v-slot:item.email="{item}">
          <mask-email :text="item.email" />
        </template>
      </v-data-table>
      <div class="mt-3 text-right" v-if="writeAuth">
        <v-btn rounded color="info" @click="showDetail()"><v-icon left>person_add</v-icon> 관리자 추가</v-btn>
      </div>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import adminAccountService from '@/api/modules/system/authentication/admin/adminAccount.service'
import adminMenuAuthGroupService from '@/api/modules/system/authentication/admin/adminMenuAuthGroup.service'
import maskTelNumber from '@/components/Mask/MaskTelNumber.vue'
import MaskEmail from '@/components/Mask/MaskEmail.vue'
import AccountPasswordReset from '@/components/System/Authentication/Admin/AccountPasswordReset.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  components: { maskTelNumber, AccountPasswordReset, MaskEmail },
  name: 'account',
  computed: {
    searchList () {
      return [
        { key: 'adminBusinessNo', label: '관리자 사번', type: 'text' },
        { key: 'loginId', label: '로그인 ID', type: 'text' },
        { key: 'adminName', label: '성명', type: 'text' },
        { key: 'menuAuthGroupId', label: '메뉴 권한 그룹', type: 'select', list: this.groupList, listValue: 'menuAuthGroupId', listText: 'menuAuthGroupName' },
        { key: 'useYn', label: '미사용 계정', type: 'boolean', trueValue: 'N' },
        { key: 'lockYn', label: '잠김 계정', type: 'boolean', trueValue: 'Y' }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      groupList: [],
      deptList: [],
      headers: [
        { text: '관리자 사번', value: 'adminBusinessNo', align: 'center' },
        { text: '로그인 ID', value: 'loginId', align: 'center' },
        { text: '성명', value: 'adminName', align: 'center' },
        { text: '휴대폰 번호', value: 'telNo', align: 'center' },
        { text: '이메일 주소', value: 'email', align: 'center' },
        { text: '사용 여부', value: 'useYn', align: 'center' },
        { text: '잠김 여부', value: 'lockYn', align: 'center' },
        { text: '비밀번호 초기화', value: 'passwordReset', align: 'center' },
        { text: '마지막 로그인 날짜', value: 'lastLoginDatetime', align: 'center' },
        { text: '메뉴권한', value: 'menuAuthGroupName', align: 'center' }
      ]
    }
  },
  mounted () {
    adminMenuAuthGroupService.selectMenuAuthGroupListInUse().then(res => {
      this.groupList = res.data
    })
    // 부서코드 조회
    commonCodeService.selectCommonCode('COMM0006').then(res => {
      this.deptList = res.data
    })
  },
  methods: {
    search () {
      adminAccountService.selectAdminAccountList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    async viewTelNo (item) {
      const res = await adminAccountService.selectAdminAccount(item.loginId)
      item.telNo = res.data.telNo
    },
    async showDetail (info) {
      let isNew = true
      let formData = { loginId: '', useYn: 'Y', tempPwYn: 'Y', deptCode: '' }
      if (info) {
        isNew = false
        const res = await adminAccountService.selectAdminAccount(info.loginId)
        formData = res.data
      }
      await this.$store.dispatch('dialog/open', {
        componentPath: '/System/Authentication/Admin/AdminAccountForm',
        params: {
          title: `관리자 ${isNew ? '추가' : '상세/수정'}`,
          isNew,
          formData,
          groupList: this.groupList,
          deptList: this.deptList
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          closeCallback: (params) => {
            if (params && params.change) {
              this.search()
            }
          }
        }
      })
    }
  }
}
</script>
