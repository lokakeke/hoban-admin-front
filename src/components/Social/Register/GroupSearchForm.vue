<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">정산 그룹번호 검색</span>
    </template>
    <v-row>
      <v-col cols="12">
        <v-row @keypress.enter="search">
          <v-col cols="3">
            <v-text-field v-model="searchParam.q.ticketNo" append-icon="search" clearable label="우대번호" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="searchParam.q.calcNo" append-icon="search" clearable label="정산 그룹번호" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="searchParam.q.calcNm" append-icon="search" clearable label="정산 그룹번호 명" hide-details></v-text-field>
          </v-col>
          <v-col cols="3" class="text-right" align-self="end">
            <v-btn outlined rounded color="info" @click="openAddDialog">
              <v-icon>add</v-icon>
              생성
            </v-btn>
            <v-btn outlined rounded color="primary" @click="search">
              <v-icon>search</v-icon>
              검색
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="font-weight-black">총 {{searchParam.total}} 건 {{searchParam.page}} / {{pages}} 페이지</div>
          </v-col>
        </v-row>
        <v-data-table
          :no-data-text="'데이터가 없습니다.'"
          :no-result-text="'데이터가 없습니다..'"
          :headers="headers"
          :items="groupList"
          class="bordered pointer"
          @click:row="setCalcNo($event)"
          hide-default-footer>
          <template v-slot:item.ticketCnt="{item}">
            <span v-if="item.ticketCnt === '0'">-</span>
            <span v-else>{{item.ticketCnt}}개</span>
          </template>
          <template v-slot:item.detail="{ item }">
            <v-btn text block rounded color="green" @click.prevent.stop="detailInfo(item)">
              상세보기
            </v-btn>
          </template>
        </v-data-table>
        <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import ticketCalcService from 'Api/modules/social/ticketCalc.service'

export default {
  extends: DialogBase,
  name: 'GroupSearchForm',
  data () {
    return {
      headers: [
        { text: '정산 그룹번호', value: 'calcNo', align: 'center', sortable: false },
        { text: '정산 그룹 명', value: 'calcNm', align: 'center', sortable: false },
        { text: '등록된 우대번호', value: 'ticketCnt', align: 'center', sortable: false },
        { text: '상세보기', value: 'detail', align: 'center', sortable: false }
      ],
      searchParam: {
        q: {},
        page: 1,
        size: 7,
        total: 0
      },
      data: {},
      groupList: []
    }
  },
  computed: {
    // PAGE 계산
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
    // 우대번호, 우대번호 명, 파트너번호 set
    if (this.instance.params.data) {
      this.data = this.instance.params.data
      this.searchParam.q.ptnrNo = this.data.ptnrNo
    }
    this.search()
  },
  methods: {
    // 정산 그룹번호 생성 Modal
    openAddDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/GroupAddForm',
        params: {
          data: this.data
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: params => {
            if (params && params.data) {
              this.groupList.splice(0, 0, { calcNo: params.data.calcNo, calcNm: params.data.calcNm, ticketCnt: 0 })
              // this.groupList.push({ calcNo: params.data.calcNo, calcNm: params.data.calcNm, ticketCnt: 0 })
            }
          }
        }
      })
    },
    // 그룹 번호 조회
    search () {
      ticketCalcService.selectCalcGroupList(this.searchParam).then(res => {
        if (res.data) {
          this.groupList = res.data
          this.searchParam.total = res.pagination.total
        }
      })
    },
    // 그룹번호 select
    setCalcNo (info) {
      this.close({ data: info })
    },
    // 정산 그룹번호 상세 Modal
    detailInfo (info) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/GroupDetailForm',
        params: {
          data: info
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 800
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
