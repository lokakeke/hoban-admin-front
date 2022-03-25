<template>
  <dialog-base :instance="instance" :title="'변경 Log 조회'">
    <v-row>
      <v-col class="pt-0"/>
      <v-col class="pt-0">
        <v-text-field v-model="filterText" class="mb-1" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="filterList" dense disable-pagination fixed-header hide-default-footer disable-sort class="click-row bordered"/>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import roomService from 'Api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'ChangeLogsPopup',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        { text: 'No', value: 'number', align: 'center' },
        { text: '이전로그내역', value: 'logBefDesc', align: 'center' },
        { text: '이후로그내역', value: 'logAftDesc', align: 'center' },
        { text: '변경사유', value: 'logResn', align: 'center' },
        { text: '변경일시', value: 'logDt', align: 'center' },
        { text: '변경자', value: 'logId', align: 'center' }
      ],
      keyRsvNo: '',
      changeLogs: {},
      filterText: ''
    }
  },
  computed: {
    filterList () {
      if (this.changeLogs && this.changeLogs.length > 0) {
        if (this.filterText) {
          return this.changeLogs.filter(data => (data.logBefDesc && data.logBefDesc.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1) ||
                                        (data.logAftDesc && data.logAftDesc.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1) ||
                                        data.logResn.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1 ||
                                        data.logId.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1)
        } else {
          return this.changeLogs
        }
      } else {
        return []
      }
    }
  },
  mounted () {
    this.keyRsvNo = _.cloneDeep(this.instance.params.keyRsvNo)
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const res = await roomService.selectChangeLogs(this.keyRsvNo)
      this.changeLogs = res.data.resultList
      if (this.changeLogs.length === 0) {
        this.$dialog.alert('변경 Log가 없습니다.')
      } else {
        for (let i = 1; i < this.changeLogs.length + 1; i++) {
          this.changeLogs[i - 1].number = i
        }
      }
    }
  }
}
</script>
