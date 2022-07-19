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
          아래 정보 수정시 상품의 재고/가격이 PMS 재고/가격 기준으로 일괄 변경됩니다.
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
                        :items="blockCodeList" label="블럭코드" v-model="blockCode" @change="selectRsvBlckCode()" :rules="emptyRules"></v-autocomplete>
      </v-col>
      <v-col cols="10" class="pt-1 pb-0">
        <v-alert dense outlined type="error" class="font-sm">
          블럭코드를 유의하여 등록해주세요.
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
              :items="roomTypeList"
              item-key="roomTypeCode"
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
              <template v-slot:item.roomTypeCode="{ item }">
                <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.roomTypeCode }}</span>
              </template>
              <template v-slot:item.roomTypeName="{ item }">
                <span :class="{ 'font-weight-bold': item.isOriginSelected }">{{ item.roomTypeName }}</span>
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
    storeId: {
      type: Number,
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
      roomTypeList: [],
      headers: [
        { text: '선택', value: 'isSelected', align: 'center', sortable: false },
        { text: '등록여부', value: 'isExist', align: 'center' },
        { text: '객실유형코드', value: 'roomTypeCode', align: 'left' },
        { text: '객실유형명', value: 'roomTypeName', align: 'left' }
      ],
      /**
       *  prop받은 블럭코드를 받을 data, 블럭코드목록
       */
      blockCode: '',
      blockCodeList: []
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
          obj.roomTypeList.map(roomObj => {
            let isSelected = false
            let isOriginSelected = false
            if (this.originRoomInfo &&
              this.originRoomInfo.storeCode === roomObj.storeCode &&
              this.originRoomInfo.roomTypeCode === roomObj.roomTypeCode) {
              isSelected = true
              isOriginSelected = true
            }
            roomObj.isSelected = isSelected
            roomObj.isOriginSelected = isOriginSelected
          })
          this.storeList.push({
            storeName: `${obj.storeName} (${obj.storeCode})`,
            storeCode: obj.storeCode,
            roomTypeList: obj.roomTypeList
          })
        })
        if (this.viewStoreCode) {
          this.storeCode = this.storeList.find(store => { return store.storeCode === this.viewStoreCode })
          this.roomTypeList = this.storeCode.roomTypeList
        }
      })
    },
    addItemInfo () {
      const selectRmTypeInfo = this.roomTypeList.find(item => { return item.isSelected === true })
      if (!this.storeCode) {
        this.$dialog.alert('사업장을 선택해주세요.')
        return
      } else if (!selectRmTypeInfo) {
        this.$dialog.alert('객실을 선택해주세요.')
        return
      } else if (this.mid === '') {
        this.$dialog.alert('회원번호를 입력해주세요.')
        return
      } else if (this.blockCode === '') {
        this.$dialog.alert('블럭코드를 선택해주세요.')
        return
      }
      const itemInfo = {
        storeId: this.storeId,
        blockCode: this.blockCode,
        storeCode: this.storeCode.storeCode,
        storeName: this.storeCode.storeName,
        roomTypeCode: selectRmTypeInfo.roomTypeCode,
        roomTypeName: selectRmTypeInfo.roomTypeName,
        mid: this.mid,
        packageYn: 'N'
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
      const selectRmTypeList = this.roomTypeList.filter(i => { return i.isSelected === true })
      if (selectRmTypeList.length === 0) {
        room.isSelected = true
      }
      if (room.isSelected) {
        this.roomTypeList.forEach(i => {
          if (room.roomTypeCode !== i.roomTypeCode) {
            i.isSelected = false
          }
        })
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: room.storeCode,
          roomTypeCode: room.roomTypeCode
        })
      }
    },
    selectRsvBlckCode () {
      this.$store.dispatch('naver/setRoomInfo', {
        blockCode: this.blockCode
      })
    },
    async selectBlckCode () {
      await commonCodeService.selectCommonCode('PACKAGE_BLOCK_CODE').then(res => {
        this.blockCodeList = res.data ? _.map(res.data, 'commonCode') : []
        /**
         *  블럭코드 주입
         */
        if (this.originRoomInfo && this.originRoomInfo.blockCode) {
          this.blockCode = this.originRoomInfo.blockCode
        }
      })
    },
    selectStore () {
      this.roomTypeList = this.storeCode.roomTypeList
      // 수정일 경우
      if (this.viewStoreCode !== this.storeCode.storeCode) {
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: '',
          roomTypeCode: '',
          mid: '',
          blockCode: ''
        })
        this.mid = ''
        this.blockCode = ''
        this.roomTypeList.forEach(roomObj => {
          roomObj.isSelected = false
          roomObj.isOriginSelected = false
        })
      } else {
        // storeCode 가 같을 경우 기존 데이터로 원복
        this.$store.dispatch('naver/setRoomInfo', {
          storeCode: this.originRoomInfo.storeCode,
          roomTypeCode: this.originRoomInfo.roomTypeCode,
          mid: this.originRoomInfo.mid,
          blockCode: this.originRoomInfo.blockCode
        })
        this.mid = _.cloneDeep(this.originRoomInfo.mid)
        this.blockCode = _.cloneDeep(this.originRoomInfo.blockCode)
        // 기존 등록된 객실 정보가 체크 및 텍스트 볼드처리
        this.roomTypeList.forEach(roomObj => {
          let isSelected = false
          let isOriginSelected = false
          if (this.originRoomInfo &&
            this.originRoomInfo.storeCode === roomObj.storeCode &&
            this.originRoomInfo.roomTypeCode === roomObj.roomTypeCode) {
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
