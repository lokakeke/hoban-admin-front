<template>
    <v-row wrap>
        <app-card :heading="'API 서비스 리스트'" col-classes="col-12">
            <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search"
                         init-search></search-form>
            <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" disable-sort hide-default-footer
                          disable-pagination
                          @click:row="open($event)" class="click-row bordered">
                <template v-slot:item.useDate="{item}">
                    {{ item.useStartDate | date }} ~ {{ item.useEndDate | date }}
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
import service from '@/api/modules/api/service.service'
import excelMixin from '@/mixins/excelMixin'

export default {
  name: 'service',
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
        { text: '파트너명', value: 'companyName', align: 'center' },
        { text: '업무 구분', value: 'taskTypeCodeName', align: 'center' },
        { text: '업무 구분이름', value: 'taskTypeName', align: 'center' },
        { text: '객실용 회원번호', value: 'memberNo', align: 'center' },
        { text: '계약 기간', value: 'useDate', align: 'center' },
        { text: '사용여부', value: 'useYn', align: 'center' },
        { text: '예치금 적용여부', value: 'depositYn', align: 'center' }
      ],
      taskTypeList: []
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
            listValue: 'commonCode',
            listText: 'commonCodeName'
          }
        ]
      } else {
        return [
          { key: 'businessId', label: 'BUSINESS ID', type: 'text' },
          { key: 'companyName', label: '파트너명', type: 'text' },
          { key: 'taskType', label: '업무 구분', type: 'code', commonCode: 'TASK_TYPE' },
          { key: 'memNo', label: '회원번호', type: 'text' },
          {
            key: 'useDate',
            label: '계약 기간',
            type: 'dateRange',
            startField: 'useStartDate',
            endField: 'useEndDate',
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
      })
    }
  },
  methods: {
    search () {
      // 조회
      service.selectServiceList(this.searchParam).then(res => {
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
        componentPath: '/Api/Service/ServiceDialog',
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
      this.downLoadExcel('/api/cms/system/service/excel', 'API 서비스 리스트', this.searchParam)
    }
  }
}
</script>
