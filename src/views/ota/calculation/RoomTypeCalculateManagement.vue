<template>
  <v-row>
    <v-col>
      <app-card heading="객실 정산">
        <search-form :search-list.sync="searchList" :search-param.sync="searchParam" @search="search" />
        <v-data-table
            :headers="tableHeader"
            :items="tableData"
            :no-data-text="emptyText"
            :no-results-text="emptyText"
        >
          <template v-slot:item.b="{item}">
            <span @click="openDetailDialog(item)"
                  class="blue--text text-decoration-underline pointer"
            >
              {{ item.b }}
            </span>
          </template>
        </v-data-table>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'RoomTypeCalculateManagement',
  computed: {
    searchList () {
      return [
        { key: 'a', label: '정산 구분', type: 'text' },
        { key: 'b', label: '승인 코드', type: 'text' }
      ]
    }
  },
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      tableHeader: [
        { text: '정산 순번', value: 'a', align: 'center', sortable: false },
        { text: '정산 구분', value: 'b', align: 'center', sortable: false },
        { text: '승인 코드', value: 'c', align: 'center', sortable: false },
        { text: '정산 시작일', value: 'd', align: 'center', sortable: false },
        { text: '정산 종료일', value: 'e', align: 'center', sortable: false },
        { text: '관리 승인자 ID', value: 'f', align: 'center', sortable: false },
        { text: '관리 승인일시', value: 'g', align: 'center', sortable: false },
        { text: '자동 여부', value: 'h', align: 'center', sortable: false },
        { text: '사용 여부', value: 'i', align: 'center', sortable: false },
        { text: '삭제 여부', value: 'j', align: 'center', sortable: false },
        { text: '생성 일시', value: 'k', align: 'center', sortable: false }
      ],

      tableData: [
        { a: '1', b: '6월', c: '정산완료', d: '2020-06-01', e: '2020-06-30', f: 'admin', g: '2020-07-02', h: 'Y', i: 'Y', j: 'N', k: '2020-07-01' },
        { a: '2', b: '7월', c: '정산중', d: '2020-07-01', e: '2020-07-31', f: '-', g: '-', h: 'Y', i: 'Y', j: 'N', k: '2020-08-01' }
      ]
    }
  },
  methods: {
    search () {
      console.log('검색!')
    },
    openDetailDialog (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/Room/Container',
        params: {
          targetMonth: item.d
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true
        }
      })
    }
  }
}
</script>
