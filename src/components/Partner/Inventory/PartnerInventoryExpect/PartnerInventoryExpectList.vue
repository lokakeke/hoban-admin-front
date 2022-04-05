<template>
    <v-row>
        <v-col cols="2" v-if="isSearch" id="scroll" class="pr-0">
            <v-tabs
                v-model="tabIndex"
                color="info"
                vertical
                class="border-left border-right border-top"
                active-class="tab-active">
                <v-tab v-for="(store, index) in list" :key="index" tabindex="-1"
                       @click="scrollTo(index)">
                    <span v-html="controlStoreName(store.storeName)"></span>
                </v-tab>
            </v-tabs>
        </v-col>
        <v-col cols="10">
            <v-tabs-items v-model="tabIndex" class="border-top">
                <v-tab-item v-for="store in list" :key="store.storeCode">
                    <v-col cols="12" class="text-left title font-weight-bold info--text">
                        <v-icon left>mdi-hospital-building</v-icon>
                        {{ store.storeName }}
                    </v-col>
                    <v-col cols="12" class="pa-0 pt-1 rm-btn">
                        <v-btn outlined small class="mr-2 mb-1" color="orange" @click="checkAll(store.rmTypeList)"
                               style="margin-left: 0.5em">
                            <v-icon left>{{ checkAllIcon(store.rmTypeList) }}</v-icon>
                            전체
                        </v-btn>
                        <v-btn v-for="room in store.rmTypeList" :key="room.rmTypeCode" small outlined color="primary"
                               @click="room.show = !room.show" class="mb-1">
                            <v-icon left>
                                {{ room.show ? "mdi-24px mdi-checkbox-marked" : "mdi-24px mdi-checkbox-blank-outline" }}
                            </v-icon>
                            {{ room.rmTypeName }}
                        </v-btn>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12" v-for="room in store.rmTypeList" :key="room.rmTypeCode" class="pa-0">
                        <v-col cols="12" class="subtitle-1 font-weight-bold pointer pl-0 pt-1 pb-0"
                               @click="room.show = !room.show">
                            <v-icon left class="pb-1">
                                {{ room.show ? "mdi-24px mdi-checkbox-marked" : "mdi-24px mdi-checkbox-blank-outline" }}
                            </v-icon>
                            <span>{{ room.rmTypeName }} : {{ room.rmTypeCode }}</span>
                        </v-col>
                        <v-expand-transition>
                            <v-simple-table class="bordered sticky-table" v-show="room.show" dense>
                                <thead>
                                <tr class="teal lighten-3">
                                    <th class="text-center sticky" style="left: 0; background-color: #80CBC4">날짜</th>
                                    <th v-for="date in store.dateList" :key="date.date" :class="date.color + '--text'"
                                        class="text-center font-weight-medium text--darken-1" v-html="date.label"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="partner in room.partnerList" :key="partner.ptnrNo" :class="partner.color">
                                    <td class="text-center font-weight-bold py-1 sticky"
                                        :style="{ 'background-color': partner.labelColor || '#B2DFDB', 'left': 0 }"
                                        v-html="partner.label"></td>
                                    <td v-for="date in partner.dateList" :key="date.date"
                                        class="text-right black--text">
                                        {{ date.count }}
                                        <!--{{date.leaveCount}} {{date.sumCount}} [ {{date.rank}} ] {{date.addCount}} { {{date.partnerCount}} }-->
                                    </td>
                                </tr>
                                </tbody>
                            </v-simple-table>
                        </v-expand-transition>
                    </v-col>
                </v-tab-item>
            </v-tabs-items>
        </v-col>
        <v-col v-if="isSearch && list.length === 0" cols="12" class="text-center title font-weight-bold mt-5 py-10">
            검색 결과가 없습니다.
        </v-col>
    </v-row>
</template>

<script>
import partnerInventoryExpectService from '@/api/modules/partner/partnerInventoryExpect.service'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  name: 'PartnerInventoryStatusList',
  data () {
    return {
      /**
             * 탭 선택 인덱스
             */
      tabIndex: 0,
      /**
             * 영업장별 입력 리스트
             */
      list: [],
      isSearch: false
    }
  },
  mounted () {
    // 리스트 검색
    this.search()
  },
  methods: {
    async search () {
      try {
        const res = await partnerInventoryExpectService.selectPartnerInventoryExpectList(this.value)
        this.list = res.data
        this.isSearch = true
      } catch (e) {
      }
    },
    checkAll (list) {
      if (list.length !== 0) {
        const showList = list.filter(data => data.show)
        if (list.length === showList.length) {
          for (const data of list) {
            data.show = false
          }
        } else {
          for (const data of list) {
            data.show = true
          }
        }
      }
    },
    checkAllIcon (list) {
      if (list.length === 0) {
        return 'mdi-24px mdi-checkbox-blank-outline'
      } else {
        const showList = list.filter(data => data.show)
        if (list.length === showList.length) {
          return 'mdi-24px mdi-checkbox-marked'
        } else if (showList.length > 0) {
          return 'mdi-24px mdi-checkbox-intermediate'
        } else {
          return 'mdi-24px mdi-checkbox-blank-outline'
        }
      }
    },
    controlStoreName (storeName) {
      if (storeName.indexOf('(') > -1) {
        const storeArray = storeName.split('(')
        return storeArray[0] + '<br/>(' + storeArray[1]
      } else {
        return storeName
      }
    },
    scrollTo (index) {
      if (this.tabIndex !== index) {
        // document.getElementById('scroll').offsetTop
        document.querySelector('.v-content__wrap').scrollTo({ top: 0, left: 0 })
      }
    }
  }
}
</script>

<style scoped>
.tab-active {
    background-color: #009688;
    color: white;
    font-weight: bold;
}

.v-tab {
    padding: 4px 6px 4px 6px;
    font-size: 13px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    height: auto !important;
}

.v-tab:last-child {
}

.rm-btn .v-btn {
    font-size: 12px !important;
}
</style>
