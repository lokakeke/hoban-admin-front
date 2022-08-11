<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'패키지(PKG) 등록관리'">
                <search-form :search-list.sync="searchList" :search-param.sync="searchParam" init-search @search="search" />
                <v-data-table :headers="headers" :items="list" :no-data-text="'검색 결과가 없습니다.'"
                              @click:row="openDialog($event)"
                              class="bordered pointer"
                              disable-pagination hide-default-footer>
                </v-data-table>
                <v-row>
                    <v-col>
                        <span class="blue--text">※ 패키지 메뉴는 패키지 명에 마우스를 올리면 볼 수 있습니다.</span>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn @click="openDialog()" color="info" outlined rounded v-if="writeAuth">
                            <v-icon small>add</v-icon>객실패키지 추가
                        </v-btn>
                    </v-col>
                </v-row>
                <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import packageService from '@/api/modules/userSystem/package.service'
// import { mapGetters } from 'vuex'
export default {
  name: 'PackageManagement',
  computed: {
    // ...mapGetters({ user: 'auth/user' }),
    searchList () {
      return [
        { key: 'localCode', label: '지역코드', type: 'text' },
        { key: 'localName', label: '지역명', type: 'text' },
        { key: 'packageNo', label: '패키지번호', type: 'text' },
        { key: 'packageName', label: '패키지명', type: 'text' },
        { key: 'useYn', label: '판매중인 상품만 보기', type: 'boolean', trueValue: 'Y', defaultValue: 'Y' }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        { text: '판매 여부', value: 'useYn', align: 'center', sortable: false },
        { text: '지역 명(코드)', value: 'local', align: 'center', sortable: false },
        { text: '패키지번호', value: 'packageNo', align: 'center', sortable: true },
        { text: '패키지명', value: 'packageName', align: 'center', sortable: true },
        { text: '패키지 설명', value: 'packageDesc', align: 'center', sortable: false, width: '15%' },
        { text: '판매 시작', value: 'saleStartDate', align: 'center', sortable: false },
        { text: '판매 종료', value: 'saleEndDate', align: 'center', sortable: false },
        { text: '박 / 객', value: 'roomNightCount', align: 'center', sortable: false },
        { text: '당일 예약', value: 'todayRsvYn', align: 'center', sortable: false },
        { text: '당일 상품', value: 'todaySaleYn', align: 'center', sortable: false },
        { text: '블럭코드', value: 'blockCode', align: 'center', sortable: false },
        { text: '설정복사', value: 'copySet', align: 'center', sortable: false }
      ],
      list: []
    }
  },
  mounted () {
    this.selectPackageList()
  },
  methods: {
    // 조회
    search () {
      console.log('search')
    },
    // 테스트 조회
    selectPackageList () {
      packageService.selectPackageList().then(res => {
        console.log(res)
        this.list = res.data
      })
    },
    // 상세 팝업
    openDialog (row) {
      const params = {
        packageNoProp: null,
        isEdit: false
      }
      if (row) {
        params.packageNoProp = row.packageNo
        params.isEdit = true
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/UserSystem/Package/Container',
        params,
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

<style scoped>

</style>
