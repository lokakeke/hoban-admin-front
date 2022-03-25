<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      {{ dialogTitle }}
    </template>
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="text-center elevation-3 pa-5 d-flex flex-row">
          <h1 class="heading white ma-0 flex">
            <span class="px-3">{{ targetDate }}</span>
          </h1>
          <v-btn color="blue"
                 dark
                 rounded
                 @click.prevent.stop="showMemo()"
                 v-if="writeAuth && !isPartner"
          >
            <v-icon class="pr-2">sticky_note_2</v-icon> 메모
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs class="elevation-3" grow v-model="tab">
            <v-tab
                :key="index"
                active-class="inventory-active-tab"
                class="subtitle-1" v-for="(tabItem, index) in tabItems">
              <v-icon left>{{tab === index ? 'radio_button_checked' : 'radio_button_unchecked'}}</v-icon> {{ tabItem.text }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs-items v-model="tab">
            <v-tab-item
                :key="index"
                v-for="(item, index) in tabItems"
            >
              <app-card class="elevation-3">
                <template v-slot:heading>
                  <v-row dense no-gutters>
                    <v-col cols="8">
                      <div class="title font-weight-bold">
                        {{ item.text }}
                      </div>
                    </v-col>
                    <v-col cols="4" class="text-end">
                      <v-btn rounded
                             color="indigo"
                             class="white--text"
                             @click="isToggledSearchForm = !isToggledSearchForm"
                      >
                        검색조건 접기/펼치기
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <calculate-dialog
                    v-if="tab === index"
                    :calc-his-item="calcItem"
                    :calc-class="item.calcClass"
                    :menu="item.menu"
                    :is-toggled-search-form="isToggledSearchForm"
                />
              </app-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import CalculateDialog from "./CalculateDialog"
import calculationService from "Api/modules/ota/calculation.service"
import { mapGetters } from "vuex"

export default {
  components: { CalculateDialog },
  extends: DialogBase,
  name: 'Container',
  data: function () {
    return {
      calcItem: null,
      tab: null,
      targetDate: null,
      allowMenuList: [],
      elevation: 3,
      isToggledSearchForm: false
    }
  },
  created () {
    this.calcItem = this.instance.params.calcItem
    this.targetDate = moment(this.calcItem.calcBgnYmd).format('YYYY.MM')

    // 파트너일 경우에만 메뉴 권한 체크
    if (this.isPartner) {
      this.getPartnerMenuAuth()
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    dialogTitle () {
      const calcInd = this.calcItem.calcInd === '0' ? '객실' : this.calcItem.calcInd === '1' ? '패키지' : this.calcItem.calcInd === '2' ? '위약금' : 'TPNE'
      return `${calcInd} 정산 상세`
    },
    tabItems () {
      const tabItems = [
        { text: '전체 (관리자)', calcClass: '', menu: 'ADM' },
        { text: '전체 (파트너)', calcClass: '', menu: 'PTNR' },
        { text: '추가정산', calcClass: '', menu: 'ADD' },
        { text: '예외', calcClass: 'EXPT', menu: 'EXPT' },
        { text: '매출조정', calcClass: 'ADJUST', menu: 'ADJUST' },
        { text: '제외', calcClass: 'EXCL', menu: 'EXCL' }
      ]

      // 정산 유형에 따른 예외처리
      // 위약금 - 매출조정 탭(제거)
      if (this.calcItem.calcInd === '2') {
        const adjustIndex = tabItems.findIndex(data => data.menu === 'ADJUST')
        if (adjustIndex > -1) tabItems.splice(adjustIndex, 1)
      }
      // TPNE - 전체(파트너) 탭(제거)
      if (this.calcItem.calcInd === '3') {
        const ptnrIndex = tabItems.findIndex(data => data.menu === 'PTNR')
        if (ptnrIndex > -1) tabItems.splice(ptnrIndex, 1)
      }

      let chgTabItems = []
      if (this.isPartner) {
        chgTabItems.push(tabItems.find(item => item.menu === 'PTNR'))

        // allowMenuList 에 없는 메뉴는 삭제
        this.allowMenuList.forEach(data => {
          const tabObject = tabItems.find(item => item.menu === data)
          if (tabObject) chgTabItems.push(tabObject)
        })
      } else {
        chgTabItems = tabItems
      }

      return chgTabItems
    }
  },
  methods: {
    async getPartnerMenuAuth () {
      const response = await calculationService.retrievePartnerMenuAuth(this.user.number)
      const data = response.data

      this.allowMenuList = data.resultList
    },

    showMemo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/MemoDialog',
        params: {
          calcItem: this.calcItem
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
