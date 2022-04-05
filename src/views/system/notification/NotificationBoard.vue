<template>
  <div>
    <app-card>
      <template v-slot:heading>
        <div class="title font-weight-bold">전체 알림 조회</div>
        <v-spacer/>
        <v-btn outlined rounded color="cyan" @click="readAll">전체 알림 읽음</v-btn>
      </template>
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" init-search/>
      <v-data-table disable-pagination :no-data-text="emptyText" :headers="headers" :items="list" disable-sort hide-default-footer class="click-row bordered"/>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"/>
    </app-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import systemService from '@/api/modules/notification/notification.service'
import partnerService from '@/api/modules/notification/partnerNotification.service'
import notiManageService from '@/api/modules/system/notification.service'

export default {
  name: 'NotificationBoard',
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
        { text: '알림 구분', value: 'notifyCodeName', align: 'center' },
        { text: '알림 메세지', value: 'notifyName', align: 'center' },
        { text: '알림명', value: 'title', align: 'center' },
        { text: '생성 일시', value: 'crtDt', align: 'center' },
        { text: '읽음 여부', value: 'readingYn', align: 'center' },
        { text: '읽은 일시', value: 'readingDt', align: 'center' }
      ],
      readingValue: [
        { text: '읽음', value: 'Y' },
        { text: '읽지 않음', value: 'N' }
      ],
      groupList: [],
      notiIdList: []
    }
  },
  computed: {
    ...mapGetters({ partnerYn: 'auth/partnerYn' }),
    searchList () {
      return [
        { key: 'notifyType', label: '알림 구분', type: 'select', list: this.groupList, listValue: 'notifyType', listText: 'notifyCodeName' },
        { key: 'notifyId', label: '알림 메세지', type: 'select', list: this.notiIdList, listValue: 'notifyId', listText: 'notifyName' },
        { key: 'title', label: '알림명', type: 'text' },
        { key: 'readingYn', label: '읽음 여부', type: 'select', list: this.readingValue, listValue: 'value', listText: 'text' }
      ]
    }
  },
  mounted () {
    this.selectTypeList()
    this.selectNotifyIdList()
  },
  methods: {
    /** 검색 */
    search () {
      if (this.isPartner) {
        partnerService.selectAllNotification(this.searchParam).then(res => {
          if (res.data) {
            this.list = res.data
            this.searchParam.total = res.pagination.total
          }
        })
      } else {
        systemService.selectAllNotification(this.searchParam).then(res => {
          if (res.data) {
            this.list = res.data
            this.searchParam.total = res.pagination.total
          }
        })
      }
    },
    /** 알림 구분 목록 조회 */
    selectTypeList () {
      if (this.isPartner) {
        partnerService.selectNotificationType().then(res => {
          this.groupList = res.data
        })
      } else {
        systemService.selectNotificationType().then(res => {
          this.groupList = res.data
        })
      }
    },
    /** 알림 메세지 목록 조회 */
    selectNotifyIdList () {
      notiManageService.selectList().then(res => {
        this.notiIdList = res.data
      })
    },
    /** 전체 읽음 */
    async readAll () {
      await this.$store.dispatch('notification/readAll')
      this.search()
    }
  }
}
</script>
