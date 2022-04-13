<template>
  <v-row wrap>
    <v-col sm="12">
      <app-card :heading="'객실(PKG) 등록관리'">
        <search-form :search-list.sync="searchList" :search-param.sync="searchParam" init-search @search="search" />
        <v-data-table :headers="headers" :items="list" :no-data-text="'검색 결과가 없습니다.'"
                      @click:row="openDialog('edit', $event)"
                      class="bordered pointer"
                      disable-pagination hide-default-footer>
          <template v-slot:item.useYn="{item}">
            <template v-if="!writeAuth">{{ item.useYn === 'Y' ? '판매' : '미판매' }}</template>
            <template v-else>
              <div @click.prevent.stop="changeRoomPackageUseYn(item)">
              <span v-if="item.useYn === 'Y'">
                <v-icon class="primary--text" x-large>toggle_on</v-icon> 판매
              </span>
                <span v-else>
                <v-icon class="grey--text" x-large>toggle_off</v-icon> 미판매
              </span>
              </div>
            </template>
          </template>
          <template v-slot:item.lcal="{item}">
            {{item.lcalName}} ({{ item.lcalCode }})
          </template>
          <template v-slot:item.pkgName="{item}">
            <v-tooltip bottom z-index="1000">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  {{ item.pkgName }}
                </div>
              </template>
              <span>{{ item.pkgMenuName }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.pkgDesc="{item}">
            <v-tooltip bottom z-index="1000">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <span>{{ item.pkgDesc | textTruncate(25) }}</span>
                </div>
              </template>
              {{ item.pkgDesc }}
            </v-tooltip>
          </template>
          <template v-slot:item.saleBgnYmd="{item}">
            {{ item.saleBgnYmd | date}}
          </template>
          <template v-slot:item.saleEndYmd="{item}">
            {{ item.saleEndYmd | date}}
          </template>
          <template v-slot:item.rmNightCnt="{item}">
            {{ item.stayNights }} / {{ item.rmCnt }}
          </template>
          <template v-slot:item.todayRsvYn="{item}">
            {{ item.todayRsvYn === 'Y' ? '가능' : '불가능'}}
          </template>
          <template v-slot:item.rsvBlckCode="{item}">
            {{ isPartner ? '-' : item.rsvBlckCode }}
          </template>
          <template v-slot:item.copySet="{item}">
            <v-btn v-if="writeAuth" icon @click="openSettingRegDialog(item)">
              <v-icon>content_copy</v-icon>
            </v-btn>
            <span v-else>-</span>
          </template>
        </v-data-table>
        <v-row>
          <v-col>
            <span class="blue--text">※ 패키지 메뉴는 패키지 명에 마우스를 올리면 볼 수 있습니다.</span>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="openDialog('add', null)" color="info" outlined rounded v-if="writeAuth">
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
import packageService from '@/api/modules/ota/package.service'
import { mapGetters } from 'vuex'

export default {
  name: 'RoomPackage',
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    searchList () {
      return [
        { key: 'lcalCode', label: '지역코드', type: 'text' },
        { key: 'lcalName', label: '지역명', type: 'text' },
        { key: 'pkgNo', label: '패키지번호', type: 'text' },
        { key: 'pkgName', label: '패키지명', type: 'text' },
        { key: 'useYn', label: '판매중인 상품만 보기', type: 'boolean', trueValue: 'Y', defaultValue: 'Y' }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      headers: [
        { text: '판매 여부', value: 'useYn', align: 'center', sortable: false },
        { text: '지역 명(코드)', value: 'lcal', align: 'center', sortable: false },
        { text: '패키지번호', value: 'pkgNo', align: 'center', sortable: true },
        { text: '패키지명', value: 'pkgName', align: 'center', sortable: true },
        { text: '패키지 설명', value: 'pkgDesc', align: 'center', sortable: false, width: '15%' },
        { text: '판매 시작', value: 'saleBgnYmd', align: 'center', sortable: false },
        { text: '판매 종료', value: 'saleEndYmd', align: 'center', sortable: false },
        { text: '박 / 객', value: 'rmNightCnt', align: 'center', sortable: false },
        { text: '당일 예약', value: 'todayRsvYn', align: 'center', sortable: false },
        { text: '당일 상품', value: 'todaySaleYn', align: 'center', sortable: false },
        { text: '블럭코드', value: 'rsvBlckCode', align: 'center', sortable: false },
        { text: '설정복사', value: 'copySet', align: 'center', sortable: false }
      ],
      list: []
    }
  },
  methods: {
    openDialog (mode, event) {
      const pkgNo = (mode === 'edit') ? event.pkgNo : ''
      const isEdit = mode === 'edit'
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Package/Container',
        params: {
          pkgNoProp: pkgNo,
          isEdit,
          getRoomPackageRegisterList: this.getRoomPackageRegisterList
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true
        }
      })
    },
    search () {
      this.getRoomPackageRegisterList()
    },
    // 등록된 패키지 리스트 조회
    getRoomPackageRegisterList () {
      if (this.isPartner) {
        this.searchParam.q.partnerSeq = this.user.number
      }
      packageService.selectRoomPackageRegisterList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    // 패키지 판매상태 변경
    changeRoomPackageUseYn (event) {
      this.$dialog.confirm(`${event.pkgNo} 패키지의 판매 상태를 변경하시겠습니까?`).then(() => {
        const obj = {}
        obj.pkgNo = event.pkgNo
        obj.useYn = event.useYn === 'Y' ? 'N' : 'Y'

        packageService.updateRoomPackageUseYn(obj).then(res => {
          // 업데이트 성공
          if (res.data === 1) {
            this.getRoomPackageRegisterList()
          }
        })
      })
    },
    // 패키지 메뉴 출력
    showMenu (items) {
      return items.map((item) => item.pkgMenuName).join(', ')
    },
    // 등록된 패키지 설정으로 일괄설정 팝업
    async openSettingRegDialog (pkgInfo) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Package/SettingRegDialog',
        params: {
          pkgInfo: pkgInfo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '1200',
          closeCallback: (param) => {
            if (param) {
              this.getRoomPackageRegisterList()
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
