<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon>지역 코드 조회
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="4" init-search></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="regionCode"
                  hide-default-footer class="click-row" @click:row="select($event)"></v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/common/region.service'

export default {
  extends: DialogBase,
  name: 'RegionSearch',
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
        { text: '지역 명', value: 'regionName', align: 'center', sortable: false },
        { text: '지역 코드', value: 'regionCode', align: 'center', sortable: false },
        { text: '사용 여부', value: 'useYn', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'regionName', label: '지역 명', type: 'text' },
        { key: 'regionCode', label: '지역 코드', type: 'text' }
      ]
    }
  },
  methods: {
    search () {
      // 조회
      service.selectRegionList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = this.list.length
      })
    },
    select (row) {
      if (row.regionCode) {
        this.$dialog.confirm(`${row.regionName} 을 선택 하시겠습니까?`).then(() => {
          this.close({ data: row })
        })
      }
    }
  }
}
</script>
