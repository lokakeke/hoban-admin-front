<template>
  <v-row wrap>
    <app-card :heading="'전송 이력 관리'" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        v-if="searchVal.sorts.length > 0 && searchVal.sendStatus.length > 0"
        @search="search"></search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="sendNo"
            hide-default-footer
            disable-sort
            disable-pagination
            class="bordered">
            <template v-slot:item.sendNo="{item}">
              <div @click="open(item)" class="pointer pa-3 font-weight-bold">
                <v-icon>search</v-icon>
                {{ item.sendNo }}
              </div>
            </template>
            <template v-slot:item.sendStatus="{item}">
              <v-chip v-if="item.sendStatus === '전송성공'" small color="success">{{ item.sendStatus }}</v-chip>
              <v-chip v-else-if="item.sendStatus === '전송실패'" small color="error">{{ item.sendStatus }}</v-chip>
              <v-chip v-else small color="info">{{ item.sendStatus }}</v-chip>
            </template>
            <template v-slot:item.dtlCount="{item}">
              {{ item.dtlCount | price }}
            </template>
            <template v-slot:item.crtDt="{item}">
              {{ item.crtDt | dateSet }}
            </template>
            <template v-slot:item.crtId="{item}">
              {{ item.crtId || 'SYSTEM' }}
            </template>
            <template v-slot:item.updDt="{item}">
              {{ item.updDt | dateSet }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import service from '@/api/modules/naver/scheduleSend.service'

export default {
  name: 'ScheduleSend',
  components: {},
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0,
        sort: 'crtDt'
      },
      list: [],
      headers: [
        { text: '전송번호', value: 'sendNo', align: 'center', sortable: false },
        { text: '서비스명', value: 'businessId', align: 'center', sortable: false },
        { text: '전송상태', value: 'sendStatus', align: 'center', sortable: false },
        { text: '전송상세 개수', value: 'dtlCount', align: 'center', sortable: false },
        { text: '관리자', value: 'crtId', align: 'center', sortable: false },
        { text: '전송시작날짜', value: 'crtDt', align: 'center', sortable: false },
        { text: '전송종료날짜', value: 'updDt', align: 'center', sortable: false }
      ],
      /**
       * 검색
       */
      searchVal: {
        sorts: [],
        sendStatus: []
      }
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'useYmd', label: '날짜', type: 'dateRange', startField: 'useBgnYmd', endField: 'useEndYmd', format: 'YYYYMMDD', defaultValue: [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')], cols: 4 },
        { key: 'sendNo', label: '전송번호', type: 'text', cols: 4 },
        { key: 'crtId', label: '관리자', type: 'text', cols: 4 },
        { key: 'sorts', label: '정렬', type: 'select', list: this.searchVal.sorts, listValue: 'value', listText: 'text', cols: 2 },
        { key: 'sendStatus', label: '전송상태', type: 'selectMulti', list: this.searchVal.sendStatus, listValue: 'value', listText: 'text', cols: 6 },
        { key: 'businessId', label: '서비스명', type: 'text', cols: 4 }
      ]
    }
  },
  methods: {
    /**
     * 조회
     */
    search () {
      for (const key in this.searchParam.q) {
        if (key === 'sendStatus') {
          this.searchParam.q[key] = _.join(this.searchParam.q[key], ',')
        }
      }
      service.selectScheduleSendMstList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    /**
     * 검색기준 세팅
     */
    getSearchVal () {
      service.selectSearchList('mst').then(response => {
        response.data.forEach(item => {
          this.searchVal[item.code].push(item)
        })
      })
    },
    /**
     * 상세정보 팝업 열기
     */
    open (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/ScheduleSend/ScheduleSendForm',
          params: {
            form: item,
            search: this.search
          },
          options: {
            fullscreen: false,
            scrollable: true
          }
        })
      })
    }
  },
  mounted () {
    this.getSearchVal()
  }
}
</script>

<style scoped>

</style>
