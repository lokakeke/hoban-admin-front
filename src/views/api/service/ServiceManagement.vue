<template>
    <v-row wrap>
        <app-card :heading="'API 서비스 리스트'" col-classes="col-12">
            <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search"
                         init-search></search-form>
            <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" disable-sort hide-default-footer
                          disable-pagination
                          @click:row="open($event)" class="click-row bordered">
                <template v-slot:item.useYmd="{item}">
                    {{ item.useBgnYmd | date }} ~ {{ item.useEndYmd | date }}
                </template>
            </v-data-table>
            <v-row v-if="writeAuth">
                <v-col cols="12" class="text-right pb-0">
                    <v-btn outlined rounded color="info" @click="open()">
                        <v-icon left>add</v-icon>
                        API 서비스 등록
                    </v-btn>
                </v-col>
            </v-row>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        </app-card>
    </v-row>
</template>

<script>
import service from 'Api/modules/api/serviceManagement.service'
import excelMixin from 'Mixins/excelMixin'

export default {
  name: 'serviceManagement',
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
      headers: [
        { text: 'BUSINESS ID', value: 'businessId', align: 'center' },
        { text: '파트너명', value: 'ptnrNm', align: 'center' },
        { text: '업무 구분', value: 'taskTypeCdNm', align: 'center' },
        { text: '업무 구분이름', value: 'taskTypeNm', align: 'center' },
        { text: '판매 채널', value: 'saleChnnlNm', align: 'center' },
        { text: '객실용 회원번호', value: 'memNo', align: 'center' },
        { text: '계약 기간', value: 'useYmd', align: 'center' },
        { text: '사용여부', value: 'useYn', align: 'center' },
        { text: '예치금 적용여부', value: 'depoYn', align: 'center' }
      ],
      taskTypeList: [],
      saleChnnlList: []
    }
  },
  computed: {
    searchList () {
      if (this.isPartner) {
        return [
          { key: 'businessId', label: 'BUSINESS ID', type: 'text' },
          {
            key: 'taskType',
            label: '업무 구분',
            type: 'select',
            list: this.taskTypeList,
            listValue: 'commCd',
            listText: 'commCdNm'
          },
          {
            key: 'saleChnnl',
            label: '판매 채널',
            type: 'select',
            list: this.saleChnnlList,
            listValue: 'commCd',
            listText: 'commCdNm'
          }
        ]
      } else {
        return [
          { key: 'businessId', label: 'BUSINESS ID', type: 'text' },
          { key: 'ptnrNm', label: '파트너명', type: 'text' },
          { key: 'taskType', label: '업무 구분', type: 'code', commCd: 'TASK_TYPE' },
          { key: 'saleChnnl', label: '판매 채널', type: 'code', commCd: 'CHANNEL' },
          { key: 'memNo', label: '회원번호', type: 'text' },
          {
            key: 'useYmd',
            label: '계약 기간',
            type: 'dateRange',
            startField: 'useBgnYmd',
            endField: 'useEndYmd',
            format: 'YYYYMMDD'
          },
          {
            key: 'useYn',
            label: '사용 여부',
            type: 'select',
            list: [
              { text: '사용', value: 'Y' },
              { text: '미사용', value: 'N' }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    // 파트너 로그인일 경우 등록된 업무구분, 판매채널 조회
    if (this.partnerYn === 'Y') {
      service.selectPartnerCodeList().then(res => {
        if (res.data.taskTypeList) {
          this.taskTypeList = res.data.taskTypeList
        }
        if (res.data.saleChnnlList) {
          this.saleChnnlList = res.data.saleChnnlList
        }
      })
    }
  },
  methods: {
    search () {
      // 조회
      service.selectServiceManagementList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    open (row) {
      let isNew = true
      let item = {}
      if (row) {
        isNew = false
        item = row
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Service/ServiceManagementDialog',
        params: {
          isNew,
          item,
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
    exportExcel () {
      this.downLoadExcel('/api/system/serviceManagement/excel', 'API 서비스 리스트', this.searchParam)
    }
  }
}
</script>
