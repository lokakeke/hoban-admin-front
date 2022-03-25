<template>
  <v-row>
    <v-col cols="12" class="pb-0">
      <v-autocomplete :style="{'max-width':'250px'}"
        :items="rsvBlckCdList" label="블럭코드" v-model="rsvBlckCd" @change="selectRsvBlckCd()" :rules="emptyRules"></v-autocomplete>
    </v-col>
    <v-col cols="10" class="pt-1 pb-0">
      <v-alert dense outlined type="error" class="font-sm">
        소노문 비발디파크 (구 더 파크 호텔), 소노캄 여수 (구 엠블호텔 여수), 소노캄 고양 의 경우 블럭코드 [002] 를 선택해주세요.
      </v-alert>
    </v-col>
    <v-col cols="2" class="pt-1 pb-0">
      <v-btn v-if="type === 'new'" class="float-right" outlined rounded color="info" @click="addItemInfo()">
        <v-icon left>add</v-icon>상품정보등록
      </v-btn>
    </v-col>
    <v-col class="pt-0">
      <v-card>
        <app-card col-classes="col-12" heading="객실 리스트">
          <v-alert v-if="type !== 'new'" dense outlined type="info" class="font-sm">
            기존 등록된 객실은 볼드처리 되어 보여집니다.
          </v-alert>
          <v-data-table
            :no-data-text="'검색 결과가 없습니다.'"
            :headers="headers"
            :items="list"
            item-key="rmTypeCd"
            hide-default-footer
            disable-pagination
            dense
            class="bordered pointer"
          >
            <template v-if="type === 'new'" v-slot:header.isSelected>
              <v-simple-checkbox v-model="isAllSelected" @input="selectAllItem($event)"></v-simple-checkbox>
            </template>
            <template v-if="type === 'new'" v-slot:item.isSelected="{ item }">
              <v-simple-checkbox v-model="item.isSelected"></v-simple-checkbox>
            </template>
            <template v-else v-slot:item.isSelected="{ item }">
              <v-simple-checkbox v-model="item.isSelected" @input="selectItem(item)"></v-simple-checkbox>
            </template>
            <template v-slot:item.isExist="{ item }">
              <v-chip v-if="item.isExist" small color="success">등록</v-chip>
              <v-chip v-else small color="gray">미등록</v-chip>
            </template>
            <template v-slot:item.store="{ item }">
              <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.store }}</span>
            </template>
            <template v-slot:item.rmType="{ item }">
              <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.rmTypeNm }} ({{ item.rmTypeCd }})</span>
            </template>
          </v-data-table>
        </app-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import itemService from "Api/modules/naver/item.service"
import commonCodeService from "Api/modules/system/commonCode.service"
import { mapGetters } from "vuex"

export default {
  name: 'PackageRoomInfoComponent',
  props: {
    dmStoreId: {
      type: String,
      required: true
    },
    originRoomInfo: Object,
    pkgNo: String,
    pkgNm: String,
    isPackageSearch: Boolean,
    type: {
      type: String,
      default: 'new'
    }
  },
  data: function () {
    return {
      list: [],
      headers: [
        { text: '선택', value: 'isSelected', align: 'center', sortable: false },
        { text: '등록여부', value: 'isExist', align: 'center' },
        { text: '영업장명 / 코드', value: 'store', align: 'left' },
        { text: '객실유형명 / 코드', value: 'rmType', align: 'left' },
        { text: '동명 / 코드', value: 'dong', align: 'center' },
        { text: '평형명 / 코드', value: 'pyeong', align: 'center' },
        { text: '객실종류명 / 코드', value: 'roomType', align: 'center' }
      ],
      isAllSelected: false,
      /**
       *  prop받은 블럭코드를 받을 data, 블럭코드목록
       */
      rsvBlckCd: '',
      rsvBlckCdList: []
    }
  },
  computed: {
    ...mapGetters({
      roomInfo: 'naver/roomInfo',
      emptyRoomInfo: 'naver/emptyRoomInfo'
    })
  },
  watch: {
    isPackageSearch (value) {
      if (value) {
        this.getPackageRoomTypeList()
      }
    },
    list: {
      handler (value) {
        const selectedLength = value.filter(item => { return item.isSelected === true }).length
        this.isAllSelected = (selectedLength > 0 && selectedLength === value.length)
      },
      deep: true
    }
  },
  methods: {
    getPackageRoomTypeList () {
      itemService.selectPackageRoomList(this.dmStoreId, this.pkgNo).then((response) => {
        const data = response.data
        this.list = []
        data.map(obj => {
          // 기존 등록된 객실 정보가 체크 및 텍스트 볼드처리
          let isSelected = false
          let isOriginSelected = false
          if (this.originRoomInfo &&
            this.originRoomInfo.mid === this.pkgNo &&
            this.originRoomInfo.storeCd === obj.storeCd &&
            this.originRoomInfo.rmTypeCd === obj.rmTypeCd) {
            isSelected = true
            isOriginSelected = true
          }
          this.list.push({
            store: `${obj.storeNm} (${obj.storeCd})`,
            dong: `${obj.dongNm} (${obj.dongCd})`,
            pyeong: `${obj.pyeongNm} (${obj.pyeongCd})`,
            roomType: `${obj.rmKindNm} (${obj.rmKindCd})`,
            rmTypeCd: obj.rmTypeCd,
            rmTypeNm: obj.rmTypeNm,
            storeNm: obj.storeNm,
            storeCd: obj.storeCd,
            useYn: obj.otaExistYn,
            initPersCnt: obj.initPersCnt,
            isSelected: isSelected,
            isOriginSelected: isOriginSelected,
            isExist: obj.isExist
          })
        })
      })
    },
    addItemInfo () {
      // 검증
      const selectItemList = this.list.filter(item => { return item.isSelected === true })
      if (selectItemList.length === 0) {
        this.$dialog.alert('객실을 선택해주세요.')
        return
      } else if (this.rsvBlckCd === '') {
        this.$dialog.alert('블럭코드를 선택해주세요.')
        return
      }
      const itemList = selectItemList.map(item => {
        return {
          dmStoreId: this.dmStoreId,
          mid: this.pkgNo,
          pkgNm: this.pkgNm,
          rsvBlckCd: this.rsvBlckCd,
          storeCd: item.storeCd,
          storeNm: item.storeNm,
          rmTypeCd: item.rmTypeCd,
          rmTypeNm: item.rmTypeNm,
          maxPersonCount: item.initPersCnt,
          pkgYn: 'Y'
        }
      })
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemListAddModal',
        params: {
          itemList: itemList
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    selectAllItem (isSelected) {
      this.list.forEach(item => {
        item.isSelected = isSelected
      })
    },
    selectItem (item) {
      const selectItemList = this.list.filter(i => { return i.isSelected === true })
      if (selectItemList.length === 0) {
        item.isSelected = true
      }
      if (item.isSelected) {
        this.list.forEach(i => {
          if (item.rmTypeCd !== i.rmTypeCd) {
            i.isSelected = false
          }
        })
        this.$store.dispatch('naver/setRoomInfo', {
          mid: this.pkgNo,
          storeCd: item.storeCd,
          rmTypeCd: item.rmTypeCd
        })
      }
    },
    selectRsvBlckCd () {
      this.$store.dispatch('naver/setRoomInfo', {
        rsvBlckCd: this.rsvBlckCd
      })
    },
    async selectBlckCd () {
      await commonCodeService.selectCommonCode('PKG_BLCK_CD').then(res => {
        this.rsvBlckCdList = res.data ? _.map(res.data, 'commCd') : []
        /**
         *  블럭코드 주입
         */
        this.rsvBlckCd = this.roomInfo.rsvBlckCd
      })
    }
  },
  created () {
    if (this.type === 'new') {
      this.$store.dispatch('naver/setRoomInfo', this.emptyRoomInfo)
    }
  },
  mounted () {
    this.getPackageRoomTypeList()
    /**
     *  블럭리스트 주입
     */
    this.selectBlckCd()
  }
}
</script>
