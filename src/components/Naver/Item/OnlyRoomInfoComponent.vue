<template>
  <v-container fluid class="pt-0">
    <v-row v-if="type === 'new'" no-gutters justify="space-between">
      <v-col cols="12">
        <v-alert dense outlined type="error" class="mb-0">
          객실 선택 후 상품정보등록을 해주세요.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else no-gutters justify="space-between">
      <v-col cols="12">
        <v-alert dense outlined type="error" class="mb-0">
          아래 정보 수정시 상품의 재고/가격이 DGNS 재고/가격 기준으로 일괄 변경됩니다.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div class="font-weight-bold subtitle-1">사업장 선택<span class="font-sm font-weight-light"> (사업장명, 사업장코드로 검색 가능합니다.)</span></div>
        <v-autocomplete
          v-model="storeCode"
          :items="storeList"
          item-value="storeCode"
          item-text="storeName"
          :rules="emptyRules"
          @change="selectStore"
          autocomplete="off"
          placeholder="사업장을 선택해 주세요."
          return-object
          hide-details
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-text-field :style="{'max-width':'250px'}" v-model="mid" label="회원번호" :rules="emptyRules" maxlength="20"></v-text-field>
      </v-col>
      <v-col cols="12" class="pb-0">
        <v-autocomplete :style="{'max-width':'250px'}"
                        :items="rsvBlckCodeList" label="블럭코드" v-model="rsvBlckCode" @change="selectRsvBlckCode()" :rules="emptyRules"></v-autocomplete>
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
              :items="rmTypeList"
              item-key="rmTypeCode"
              hide-default-footer
              disable-pagination
              dense
              class="bordered pointer"
            >
              <template v-slot:item.isSelected="{ item }">
                <v-simple-checkbox v-model="item.isSelected" @input="selectRoom(item)" :disabled="(viewStoreCode !== storeCode.storeCode && item.isExist) || (item.isExist && !item.isOriginSelected)"></v-simple-checkbox>
              </template>
              <template v-slot:item.isExist="{ item }">
                <v-chip v-if="item.isExist" small color="success">등록</v-chip>
                <v-chip v-else small color="gray">미등록</v-chip>
              </template>
              <template v-slot:item.rmTypeCode="{ item }">
                <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.rmTypeCode }}</span>
              </template>
              <template v-slot:item.rmTypeName="{ item }">
                <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.rmTypeName }}</span>
              </template>
            </v-data-table>
          </app-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import { mapGetters } from 'vuex'

export default {
  name: 'OnlyRoomInfoComponent',
  props: {
    dmStoreId: {
      type: String,
      required: true
    },
    originRoomInfo: {},
    viewStoreCode: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'new'
    }
  },
  data: function () {
    return {
      mid: '',
      storeCode: '',
      storeList: [],
      rmTypeList: [],
      headers: [
        { text: '선택', value: 'isSelected', align: 'center', sortable: false },
        { text: '등록여부', value: 'isExist', align: 'center' },
        { text: '객실유형코드', value: 'rmTypeCode', align: 'left' },
        { text: '객실유형명', value: 'rmTypeName', align: 'left' }
      ],
      /**
       *  prop받은 블럭코드를 받을 data, 블럭코드목록
       */
      rsvBlckCode: '',
      rsvBlckCodeList: []
    }
  },
  computed: {
    ...mapGetters({
      roomInfo: 'naver/roomInfo',
      emptyRoomInfo: 'naver/emptyRoomInfo'
    })
  },
  watch: {
    'originRoomInfo.mid' (value) {
      this.mid = value
    },
    mid (value) {
      this.$store.dispatch('naver/setRoomInfo', {
        mid: value
      })
    }
  },
  created () {
    if (this.type === 'new') {
      this.$store.dispatch('naver/setRoomInfo', this.emptyRoomInfo)
    }
  },
  mounted () {
    this.getOnlyRoomList()
    /**
     *  블럭리스트 주입
     */
    this.selectBlckCode()
    /**
     *  회원번호 주입
     */
    if (this.originRoomInfo && this.originRoomInfo.mid) {
      this.mid = this.originRoomInfo.mid
    }
  },
  methods: {
    async getOnlyRoomList () {
      await itemService.selectOnlyRoomList().then((response) => {
        const data = _.orderBy(response.data, 'storeCode')
        this.storeList = []
        data.map(obj => {
          // 기존 등록된 객실 정보가 체크 및 텍스트 볼드처리
          obj.rmTypeList.map(roomObj => {
            let isSelected = false
            let isOriginSelected = false
            if (this.originRoomInfo &&
              this.originRoomInfo.storeCode === roomObj.storeCode &&
              this.originRoomInfo.rmTypeCode === roomObj.rmTypeCode) {
              isSelected = true
              isOriginSelected = true
            }
            roomObj.isSelected = isSelected
            roomObj.isOriginSelected = isOriginSelected
          })
          this.storeList.push({
            storeName: `${obj.storeName} (${obj.storeCode})`,
            storeCode: obj.storeCode,
            rmTypeList: obj.rmTypeList
          })
        })
        if (this.viewStoreCode) {
          this.storeCode = this.storeList.find(store => { return store.storeCode === this.viewStoreCode })
          this.rmTypeList = this.storeCode.rmTypeList
        }
      })
    },
    addItemInfo () {
      const selectRmTypeInfo = this.rmTypeList.find(item => { return item.isSelected === true })
      if (!this.storeCode) {
        this.$dialog.alert('사업장을 선택해주세요.')
        return
      } else if (!selectRmTypeInfo) {
        this.$dialog.alert('객실을 선택해주세요.')
        return
      } else if (this.mid === '') {
        this.$dialog.alert('회원번호를 입력해주세요.')
        return
      } else if (this.rsvBlckCode === '') {
        this.$dialog.alert('블럭코드를 선택해주세요.')
        return
      }
      const itemInfo = {
        dmStoreId: this.dmStoreId,
        rsvBlckCode: this.rsvBlckCode,
        storeCode: this.storeCode.storeCode,
        storeName: this.storeCode.storeName,
        rmTypeCode: selectRmTypeInfo.rmTypeCode,
        rmTypeName: selectRmTypeInfo.rmTypeName,
        mid: this.mid,
        pkgYn: 'N'
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemAddModal',
        params: {
          itemInfo: itemInfo
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    selectRoom (room) {
      const selectRmTypeList = this.rmTypeList.filter(i => { return i.isSelected === true })
      if (selectRmTypeList.length === 0) {
        room.isSelected = true
      }
      if (room.isSelected) {
        this.rmTypeList.forEach(i => {
          if (room.rmTypeCode !== i.rmTypeCode) {
            i.isSelected = false
          }
        })
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: room.storeCode,
          rmTypeCode: room.rmTypeCode
        })
      }
    },
    selectRsvBlckCode () {
      this.$store.dispatch('naver/setRoomInfo', {
        rsvBlckCode: this.rsvBlckCode
      })
    },
    async selectBlckCode () {
      await commonCodeService.selectCommonCode('PKG_BLCK_CD').then(res => {
        this.rsvBlckCodeList = res.data ? _.map(res.data, 'commCode') : []
        /**
         *  블럭코드 주입
         */
        if (this.originRoomInfo && this.originRoomInfo.rsvBlckCode) {
          this.rsvBlckCode = this.originRoomInfo.rsvBlckCode
        }
      })
    },
    selectStore () {
      this.rmTypeList = this.storeCode.rmTypeList
      // 수정일 경우
      if (this.viewStoreCode !== this.storeCode.storeCode) {
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: '',
          rmTypeCode: '',
          mid: '',
          rsvBlckCode: ''
        })
        this.mid = ''
        this.rsvBlckCode = ''
        this.rmTypeList.forEach(roomObj => {
          roomObj.isSelected = false
          roomObj.isOriginSelected = false
        })
      } else {
        // storeCode 가 같을 경우 기존 데이터로 원복
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: this.originRoomInfo.storeCode,
          rmTypeCode: this.originRoomInfo.rmTypeCode,
          mid: this.originRoomInfo.mid,
          rsvBlckCode: this.originRoomInfo.rsvBlckCode
        })
        this.mid = _.cloneDeep(this.originRoomInfo.mid)
        this.rsvBlckCode = _.cloneDeep(this.originRoomInfo.rsvBlckCode)
        // 기존 등록된 객실 정보가 체크 및 텍스트 볼드처리
        this.rmTypeList.forEach(roomObj => {
          let isSelected = false
          let isOriginSelected = false
          if (this.originRoomInfo &&
            this.originRoomInfo.storeCode === roomObj.storeCode &&
            this.originRoomInfo.rmTypeCode === roomObj.rmTypeCode) {
            isSelected = true
            isOriginSelected = true
          }
          roomObj.isSelected = isSelected
          roomObj.isOriginSelected = isOriginSelected
        })
      }
    }
  }
}
</script>
