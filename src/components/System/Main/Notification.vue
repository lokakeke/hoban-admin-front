<template>
  <app-card heading="알림" col-classes="col-6">
    <v-col cols="12" class="primary--text pa-0 pb-2 pl-1">
      총 {{searchParam.total}} 건 {{searchParam.page}} / {{pages}} 페이지
    </v-col>
    <sticky-table
      :items="list"
      :headers="headers"
      :fixed-column-length="1"
      :no-data-text="'수신한 알림이 없습니다.'"
      dense
    >
      <template v-slot:crtDt="{item}">
        {{ item.crtDt | dateSet }}
      </template>
      <template v-slot:readingDt="{item}">
        {{ item.readingDt | dateSet }}
      </template>
    </sticky-table>
    <!--<v-data-table
      v-dragscroll="{target: '.v-data-table__wrapper'}"
      :no-data-text="'수신한 알림이 없습니다.'"
      :headers="headers"
      :items="list"
      disable-sort
      hide-default-footer
      disable-pagination
      dense
      :class="list.length > 0 ? 'grab-row': ''"
    >
      <template v-slot:item.crtDt="{item}">
        {{ item.crtDt | dateSet }}
      </template>
      <template v-slot:item.readingDt="{item}">
        {{ item.readingDt | dateSet }}
      </template>
    </v-data-table>-->
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
  </app-card>
</template>

<script>
import { mapGetters } from 'vuex'
import systemService from '@/api/modules/message/messageAdmin.service'
import StickyTable from '@/components/Common/StickyTable.vue'

export default {
  name: 'Notification',
  components: { StickyTable },
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
        { text: '알림 구분', value: 'notifyCodeName', align: 'center' },
        { text: '알림 메세지', value: 'notifyName', align: 'center' },
        { text: '읽음 여부', value: 'readingYn', align: 'center' },
        { text: '알림명', value: 'title', align: 'center' },
        { text: '생성 일시', value: 'crtDt', align: 'center' },
        { text: '읽은 일시', value: 'readingDt', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters({ partnerYn: 'auth/partnerYn' }),
    pages () {
      const check = Boolean(this.searchParam.size == null || this.searchParam.total == null || this.searchParam.total === 0)
      if (check) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      if (this.isPartner) {
        partnerService.selectAllNotification(this.searchParam).then(res => {
          if (res.data) {
            this.list = res.data
            this.searchParam.total = res.pagination.total
          }
        })
      } else {
        systemService.selectAllMessage(this.searchParam).then(res => {
          if (res.data) {
            this.list = res.data
            this.searchParam.total = res.pagination.total
          }
        })
      }
    }
  }
}
</script>
