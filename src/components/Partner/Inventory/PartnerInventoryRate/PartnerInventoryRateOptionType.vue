<template>
    <app-card :heading="'재고예약 전송비율 영업장/객실타입 설정'" col-classes="col-md-8 col-12 pl-0" :min-height="300" auto-height
              content-classes="pt-1">
        <template v-slot:items>
            <v-row align="center">
                <v-col cols="12" class="text-left font-weight-bold pr-0 primary--text body-2">
                    <p class="mb-1 info--text">* O.T.A 관리중인 영업장/객실타입 중 자동전송 할 타입만 선택하실 수 있습니다.</p>
                    <p class="mb-0 info--text">* 선택이 되어도 사용여부가 'N' , 이거나 자동전송일자가 사용기간에 포함이 안되면 자동예약에서 제외됩니다.</p>
                </v-col>
                <v-col cols="2" class="py-0 text-left">
          <span class="pointer" @click="checkAll">
            <v-icon left>{{ checkIcon }}</v-icon>전체선택
          </span>
                </v-col>
                <v-col cols="4" class="pa-0">
                    <v-text-field v-model="searchKeyword" hide-details dense append-icon="search"
                                  placeholder="검색어를 입력해 주세요." solo clearable></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0 text-right">
                    <v-btn rounded color="primary" @click="checkExpand(typeList)">
                        <v-icon left>expand_more</v-icon>
                        선택 열림
                    </v-btn>
                    <v-btn rounded color="primary" @click="toggleAll(true)">
                        <v-icon left>expand_more</v-icon>
                        전체 열림
                    </v-btn>
                    <v-btn rounded color="warning" @click="toggleAll(false)">
                        <v-icon left>expand_less</v-icon>
                        전체 닫힘
                    </v-btn>
                    <v-btn rounded color="info" @click="submit" v-if="writeAuth">
                        <v-icon left>check</v-icon>
                        저장 (F4)
                    </v-btn>
                </v-col>
            </v-row>
        </template>
        <v-row dense align="center" v-for="store of typeFilterList" :key="store.storeCode"
               class="pa-0 pr-2 store-type border-bottom">
            <v-col lg="6" cols="12">
                <v-row no-gutters align="center">
                    <v-btn small icon @click="expand(store)">
                        <v-icon>{{ store.expand ? "arrow_drop_down" : "arrow_right" }}</v-icon>
                    </v-btn>
                    <v-btn small icon @click="checkStore(store)" class="mr-1">
                        <v-icon color="primary">{{ storeIcon(store) }}</v-icon>
                    </v-btn>
                    <span @click="expand(store)" class="store-label primary--text pointer">{{ store.storeName }}<small> - {{ store.storeCode
                        }}</small></span>
                </v-row>
            </v-col>
            <v-col lg="6" cols="12" class="text-right">
                <span class="mr-2 primary--text">사용 : {{ store.useYn }} ,</span>
                <span class="primary--text">기간 : {{ store.saleBgnYmd | date }} ~ {{ store.saleEndYmd | date }}</span>
            </v-col>
            <v-col cols="12" v-show="store.expand" class="pl-12 ml-1 pr-4 py-0">
                <v-row dense class="room-type pointer border-bottom"
                       v-for="rmType of store.rmTypeList" :key="rmType.storeCode + '_' + rmType.rmTypeCode"
                       @click="checkRmType(rmType)">
                    <v-col lg="6" cols="12">
                        <v-row no-gutters align="center">
                            <v-icon class="mr-2">
                                {{ rmType.inventoryDistbYn === "Y" ? "check_box" : "check_box_outline_blank" }}
                            </v-icon>
                            <span>{{ rmType.rmTypeName }}<small> - {{ rmType.rmTypeCode }}</small></span>
                        </v-row>
                    </v-col>
                    <v-col lg="6" cols="12" class="text-right">
                        <span class="mr-2">사용 : {{ rmType.useYn }} ,</span>
                        <span>기간 : {{ rmType.saleBgnYmd | date }} ~ {{ rmType.saleEndYmd | date }}</span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-if="!typeFilterList || typeFilterList.length === 0">
            <v-col cols="12" class="text-center font-weight-bold pt-6">영업장/객실타입 데이터가 없습니다.</v-col>
        </v-row>
    </app-card>
</template>

<script>
import partnerInventoryRateService from '@/api/modules/partner/partnerInventoryRate.service'

export default {
  name: 'PartnerInventoryRateOptionType',
  data () {
    return {
      typeList: [],
      searchKeyword: ''
    }
  },
  computed: {
    // 객실타입 리스트 필터링
    typeFilterList () {
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase().replace(/\s/gi, '')
        return this.typeList.filter(store => {
          const storeName = (store.storeName || '').toLowerCase().replace(/\s/gi, '')
          const storeCode = (store.storeCode || '').toLowerCase()
          if (storeName.indexOf(keyword) > -1 || storeCode.indexOf(keyword) > -1) {
            return true
          } else {
            return (store.rmTypeList || []).filter(rm => {
              const rmTypeName = (rm.rmTypeName || '').toLowerCase().replace(/\s/gi, '')
              const rmTypeCode = (rm.rmTypeCode || '').toLowerCase()
              return rmTypeName.indexOf(keyword) > -1 || rmTypeCode.indexOf(keyword) > -1
            }).length > 0
          }
        })
      } else {
        return this.typeList
      }
    },
    // 전체 선택/해제 체크
    checkIcon () {
      if (this.typeList.length > 0) {
        const totalSize = this.typeList.reduce((sum, row) => sum + (row.rmTypeList || []).length, 0)
        const checkSize = this.typeList.reduce((sum, row) => sum + (row.rmTypeList || []).filter(data => data.inventoryDistbYn === 'Y').length, 0)
        if (totalSize === checkSize) {
          return 'check_box'
        } else if (checkSize > 0) {
          return 'indeterminate_check_box'
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    }
  },
  async mounted () {
    // 설정 객실타입 조회
    await this.searchTypeList()
    await this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        { target: 'F4', action: this.submit, writeAuth: true }
      ]
    })
  },
  methods: {
    /**
         * 객실타입 설정리스트 조회
         */
    async searchTypeList () {
      const res = await partnerInventoryRateService.selectPartnerInventoryRateTypeList()
      this.typeList = this.checkExpand(res.data)
    },
    /**
         * 초기에 체크된 객실타입이 있으면 store 에 expand true 셋팅
         * @param storeList 초기 리스트
         * @return storeList
         */
    checkExpand (storeList) {
      for (const store of storeList) {
        // 체크된 객실타입이 있는지 검사 하여 초기 열림 설정
        store.expand = store.rmTypeList && store.rmTypeList.filter(data => data.inventoryDistbYn === 'Y').length > 0
      }
      return storeList
    },
    /**
         * 영업장 열림/닫힘
         * @param store
         */
    expand (store) {
      store.expand = !store.expand
    },
    /**
         * 영업장 체크박스
         * @param store
         */
    storeIcon (store) {
      if (store.rmTypeList && store.rmTypeList.length > 0) {
        const checkLength = store.rmTypeList.filter(data => data.inventoryDistbYn === 'Y').length
        if (checkLength > 0) {
          return 'check_box'
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    },
    /**
         * 영업장 클릭 이벤트
         * @param store
         */
    checkStore (store) {
      if (store.rmTypeList && store.rmTypeList.length > 0) {
        const rmTypeLength = store.rmTypeList.length
        const checkLength = store.rmTypeList.filter(data => data.inventoryDistbYn === 'Y').length
        let flag = 'Y'
        if (rmTypeLength === checkLength) {
          flag = 'N'
        }
        store.expand = flag === 'Y'
        for (const rmType of store.rmTypeList) {
          rmType.inventoryDistbYn = flag
        }
      }
    },
    /**
         * 객실타입 클릭 이벤트
         * @param rmType
         */
    checkRmType (rmType) {
      rmType.inventoryDistbYn = rmType.inventoryDistbYn === 'Y' ? 'N' : 'Y'
    },
    /**
         * 전체 열림/ 닫힘
         * @param isOpen
         */
    toggleAll (isOpen) {
      for (const store of this.typeList) {
        store.expand = isOpen
      }
    },
    /**
         * 전체 선택/해제
         */
    checkAll () {
      if (this.typeList.length > 0) {
        const totalSize = this.typeList.reduce((sum, row) => sum + (row.rmTypeList || []).length, 0)
        const checkSize = this.typeList.reduce((sum, row) => sum + (row.rmTypeList || []).filter(data => data.inventoryDistbYn === 'Y').length, 0)
        const flag = totalSize === checkSize ? 'N' : 'Y'
        for (const store of this.typeList) {
          store.expand = flag === 'Y'
          const rmTypeList = store.rmTypeList || []
          for (const rmType of rmTypeList) {
            rmType.inventoryDistbYn = flag
          }
        }
      }
    },
    /**
         * 설정 객실타입 저장
         */
    async submit () {
      try {
        // 체크된 리스트만 만든다.
        let insertList = []
        for (const store of this.typeList) {
          if (store.rmTypeList) {
            insertList = insertList.concat(store.rmTypeList.filter(data => data.inventoryDistbYn === 'Y'))
          }
        }
        await this.$dialog.confirm(`${insertList.length} 개 의 객실타입을 선택하셨습니다.<br/>객실타입 설정을 하시겠습니까?`)
        await partnerInventoryRateService.insertPartnerInventoryRateTypeList(insertList)
        this.$dialog.alert('객실타입을 설정 하였습니다.')
        this.searchTypeList()
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped>
div.store-type:last-child {
    border-bottom: none;
}

div.room-type:last-child {
    border-bottom: none;
}
</style>
