<template>
    <dialog-base :instance="instance">
        <template v-slot:title>
            <v-icon left>search</v-icon>
            사원 조회
        </template>
        <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="4"
                     init-search></search-form>
        <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="emplNo"
                      hide-default-footer class="click-row" @click:row="select($event)">
            <template v-slot:item.telNo="{item}">
                <mask-tel-number :text="item.telNo" @search="viewTelNo(item)" />
            </template>
        </v-data-table>
        <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        <template v-slot:actions>
            <v-btn outlined rounded color="primary" @click="close">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import accountService from 'Api/modules/system/account.service'
import maskTelNumber from 'Components/Mask/MaskTelNumber.vue'

export default {
  extends: DialogBase,
  components: { maskTelNumber },
  name: 'AdminSearch',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        { text: '관리자 사번', value: 'emplNo', align: 'center' },
        { text: '로그인 ID', value: 'loginId', align: 'center' },
        { text: '성명', value: 'mngmUserNm', align: 'center' },
        { text: '휴대폰 번호', value: 'telNo', align: 'center' },
        { text: '이메일 주소', value: 'email', align: 'center' },
        { text: '사용 여부', value: 'useYn', align: 'center' },
        { text: '잠김 여부', value: 'lockYn', align: 'center' }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'emplNo', label: '관리자 사번', type: 'text' },
        { key: 'loginId', label: '로그인 ID', type: 'text' },
        { key: 'mngmUserNm', label: '성명', type: 'text' }
      ]
    }
  },
  methods: {
    search () {
      accountService.selectAccountList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    async viewTelNo (item) {
      const res = await accountService.selectAccount(item.loginId)
      item.telNo = res.data.telNo
    },
    select (row) {
      if (row.emplNo) {
        this.$dialog.confirm(`${row.mngmUserNm} 을 선택 하시겠습니까?`).then(() => {
          this.close({ data: row })
        })
      }
    }
  }
}
</script>
