<template>
  <div>
    <app-card>
      <template v-slot:heading>
        <div class="title font-weight-bold">전체 메시지 조회</div>
        <v-spacer/>
        <v-btn outlined rounded color="cyan" @click="readAll">전체 메시지 읽음</v-btn>
      </template>
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" init-search/>
      <v-data-table disable-pagination :no-data-text="emptyText" :headers="headers" :items="list" disable-sort hide-default-footer class="click-row bordered"/>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"/>
    </app-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import adminMessageService from '@/api/modules/message/messageAdmin.service'
import partnerMessageService from '@/api/modules/message/messagePartner.service'
import messageService from '@/api/modules/system/message.service'

export default {
  name: 'MessageBoard',
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
        { text: '알림 구분', value: 'messageCodeName', align: 'center' },
        { text: '알림 메세지', value: 'message', align: 'center' },
        { text: '알림명', value: 'messageName', align: 'center' },
        { text: '생성 일시', value: 'createDatetime', align: 'center' },
        { text: '읽음 여부', value: 'readYn', align: 'center' },
        { text: '읽은 일시', value: 'readDatetime', align: 'center' }
      ],
      readingValue: [
        { text: '읽음', value: 'Y' },
        { text: '읽지 않음', value: 'N' }
      ],
      groupList: [],
      messageIdList: []
    }
  },
  computed: {
    ...mapGetters({ partnerYn: 'auth/partnerYn' }),
    searchList () {
      return [
        { key: 'messageType', label: '메시지 구분', type: 'select', list: this.groupList, listValue: 'messageType', listText: 'messageCodeName' },
        { key: 'messageId', label: '알림 메세지', type: 'select', list: this.messageIdList, listValue: 'messageId', listText: 'messageName' },
        { key: 'message', label: '메시지', type: 'text' },
        { key: 'readYn', label: '읽음 여부', type: 'select', list: this.readingValue, listValue: 'value', listText: 'text' }
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
        partnerMessageService.selectAllMessage(this.searchParam).then(res => {
          if (res.data) {
            this.list = res.data
            this.searchParam.total = res.pagination.total
          }
        })
      } else {
        adminMessageService.selectAllMessage(this.searchParam).then(res => {
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
        partnerMessageService.selectMessageType().then(res => {
          this.groupList = res.data
        })
      } else {
        adminMessageService.selectMessageType().then(res => {
          this.groupList = res.data
        })
      }
    },
    /** 알림 메세지 목록 조회 */
    selectNotifyIdList () {
      messageService.selectList().then(res => {
        this.messageIdList = res.data
      })
    },
    /** 전체 읽음 */
    async readAll () {
      await this.$store.dispatch('message/readAll')
      this.search()
    }
  }
}
</script>
