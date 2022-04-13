<template>
  <app-card heading="예치금" col-classes="col-6">
    <v-col cols="12" class="primary--text pa-0 pb-2 pl-1">
      총 {{searchParam.total}} 건 {{searchParam.page}} / {{pages}} 페이지
    </v-col>
    <v-data-table
      :no-data-text="'예치금 내역이 없습니다.'"
      :headers="headers"
      :items="list"
      disable-sort
      hide-default-footer
      disable-pagination
      dense
    >
      <!-- 금액 -->
      <template v-slot:item.amt="{item}">
        <strong>{{item.amt | price}}원</strong>
      </template>
      <!-- 사용여부 -->
      <template v-slot:item.useYn="{ item }">
        <strong class="info--text" v-if="item.useYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>사용</strong>
        <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>사용안함</strong>
      </template>
      <!-- 등록일시 -->
      <template v-slot:item.crtDt="{item}">{{item.crtDt | dateSet}}</template>
    </v-data-table>
    <search-pagination
      v-model="searchParam"
      :total-visible="10"
      circle
      @change="selectDepositList"
    ></search-pagination>
  </app-card>
</template>

<script>
import depositAccountService from '@/api/modules/api/depositAccount.service'

export default {
  name: 'Deposit',
  props: {
    taskType: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 5,
        total: 0
      },
      list: [],
      headers: [
        {
          text: '예치금 KEY',
          value: 'depoKey',
          align: 'center',
          sortable: false
        },
        { text: '파트너명', value: 'companyName', align: 'center', sortable: false },
        { text: '예치금', value: 'amt', align: 'center', sortable: false },
        { text: '사용여부', value: 'useYn', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    pages () {
      if (
        this.searchParam.size == null ||
        this.searchParam.total == null ||
        this.searchParam.total === 0
      ) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
    }
  },
  mounted () {
    this.selectDepositList()
  },
  methods: {
    selectDepositList () {
      this.searchParam.q.taskType = this.taskType
      depositAccountService.selectDepositAccountList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    /**
     * 등록/수정 Dialog 열기
     */
    openDialog (item = {}) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/Deposit/DepositAccountDialog',
        params: {
          item
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectDepositList()
          }
        }
      })
    }
  }
}
</script>
