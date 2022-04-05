  <template>
  <dialog-base :instance="instance" title="영업장 조회">
    <v-form ref="form" lazy-validation autocomplate="off">
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination/>
      <v-row>
        <v-col>
          <v-data-table title="코드 목록" :headers="isPartner ? ptnrHeaders : headers" :items="storeList" @click:row="chooseStore($event)" disable-sort :no-data-text="'검색 결과가 없습니다.'">
            <template v-slot:item.useYn="{ item }">
              <v-simple-checkbox v-model="item.flag" disabled/>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import roomService from '@/api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'StoreSearchPopup',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        {
          text: 'No',
          value: 'number',
          align: 'center',
          width: '15%'
        },
        {
          text: '코드',
          value: 'storeCode',
          align: 'center',
          width: '15%'
        },
        {
          text: '코드명',
          value: 'storeName',
          align: 'center',
          width: '60%'
        },
        {
          text: '사용여부',
          value: 'useYn',
          align: 'center',
          width: '10%'
        }
      ],
      ptnrHeaders: [
        {
          text: 'No',
          value: 'number',
          align: 'center',
          width: '15%'
        },
        {
          text: '코드',
          value: 'storeCode',
          align: 'center',
          width: '15%'
        },
        {
          text: '코드명',
          value: 'storeName',
          align: 'center',
          width: '70%'
        }
      ],
      storeList: [],
      useList: [
        { code: '전체', value: null },
        { code: '사용', value: '1' },
        { code: '미사용', value: '0' }
      ],
      pkgStoreList: [],
      filterText: '',
      roomType: {},
      item: {},
      isSearch: false
    }
  },
  computed: {
    searchList () {
      let list = [
        { key: 'storeCode', label: '코드명/No', type: 'text', cols: 4 }
      ]
      if (!this.isPartner) {
        list = list.concat([{ key: 'useYn', label: '사용여부', type: 'select', list: this.useList, listText: 'code', listValue: 'value', defaultValue: this.useList[0].value, cols: 4 }])
      }
      return list
    },
    filterList () {
      if (this.storeList && this.storeList.length > 0) {
        if (this.filterText) {
          return this.storeList.filter(data => data.storeCode.indexOf(this.filterText) !== -1 || data.storeName.indexOf(this.filterText) !== -1)
        } else {
          return this.storeList
        }
      } else {
        return []
      }
    }
  },
  mounted () {
    this.item = _.cloneDeep(this.instance.params.item.itemInfo)
    this.roomType = _.cloneDeep(this.instance.params.item.roomType)
    this.isSearch = _.cloneDeep(this.instance.params.item.isSearch)
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const param = {}
      if (this.searchParam.q.storeCode) {
        param.storeCode = this.searchParam.q.storeCode
      }
      if (this.isSearch) { // 검색창에서 영업장 조회
        if (this.isPartner) { // 파트너
          if (this.roomType.value === 'OTA_ROOM_API') { // 객실
            param.useYn = '1'
            const res = await roomService.selectStoreInfoForSearch(param)
            this.noStoreList(res.data)
          } else { // 패키지
            param.pkgNo = this.item.pkgNo
            param.useYn = 'Y'
            const res = await roomService.selectStoreInfoByPkgNo(param)
            this.noStoreList(res.data)
          }
        } else { // 관리자
          if (this.roomType.value === 'OTA_ROOM_API') { // 객실
            this.searchParam.q.useYn ? param.useYn = this.searchParam.q.useYn : param.useYn = '1'
            const res = await roomService.selectStoreInfoForSearch(param)
            this.noStoreList(res.data)
          } else { // 패키지
            param.pkgNo = this.item.pkgNo
            if (this.searchParam.q.useYn === '1') {
              param.useYn = 'Y'
            } else if (this.searchParam.q.useYn === '0') {
              param.useYn = 'N'
            } else {
              param.useYn = ''
            }
            const res = await roomService.selectStoreInfoByPkgNo(param)
            this.noStoreList(res.data)
          }
        }
      } else {
        if (this.isPartner) { // 파트너
          if (this.roomType.value === 'OTA_ROOM_API') { // 객실
            param.useYn = '1'
            const res = await roomService.selectStoreInfo(param)
            this.noStoreList(res.data)
          } else { // 패키지
            param.pkgNo = this.item.pkgNo
            param.useYn = 'Y'
            const res = await roomService.selectStoreInfoByPkgNo(param)
            this.noStoreList(res.data)
          }
        } else { // 관리자
          if (this.roomType.value === 'OTA_ROOM_API') { // 객실
            this.searchParam.q.useYn ? param.useYn = this.searchParam.q.useYn : param.useYn = '1'
            const res = await roomService.selectStoreInfo(param)
            this.noStoreList(res.data)
          } else { // 패키지
            param.pkgNo = this.item.pkgNo
            if (this.searchParam.q.useYn === '1') {
              param.useYn = 'Y'
            } else if (this.searchParam.q.useYn === '0') {
              param.useYn = 'N'
            } else {
              param.useYn = ''
            }
            const res = await roomService.selectStoreInfoByPkgNo(param)
            this.noStoreList(res.data)
          }
        }
      }
    },
    /**
     * 1개의 영업장 선택
     */
    chooseStore (row) {
      this.close({ data: row })
    },
    /**
     * 화면에 보여줄 형태로 가공
     */
    noStoreList (param) {
      this.storeList = param
      if (param && param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
      } else {
        if (this.isPartner) {
          this.storeList = this.storeList.filter(data => this.storeList.some(item => data.storeCode === item.storeCode))
        }
        this.addCheckBox(this.storeList)
        for (let i = 1; i < this.storeList.length + 1; i++) {
          this.storeList[i - 1].number = i
        }
      }
    },
    /**
     * 사용여부 체크박스 생성
     */
    addCheckBox (items) {
      for (const item of items) {
        item.useYn === '1' || item.useYn === 'Y' ? item.flag = true : item.flag = false
      }
    }
  }
}
</script>
