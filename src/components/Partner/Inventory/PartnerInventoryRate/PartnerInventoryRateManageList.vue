<template>
    <app-card :heading="'재고예약 전송비율 관리 파트너'" col-classes="col-md-8 col-12 pl-0" :min-height="300" auto-height
              content-classes="py-1" custom-classes="border-info">
        <template v-slot:items>
            <v-row align="end">
                <v-col cols="12" class="text-left font-weight-bold pr-0 primary--text body-2">
                    <p class="mb-1">* 모든 비율의 합은 100% 이내여야 합니다. (본사 재고를 제외한 수량은 강제할당 됩니다.)</p>
                    <p class="mb-1 success--text">* 파트너를 드래그 하여 순서를 변경할 수 있습니다. (재고 분배는 화면순서별로 우선 진행됩니다.)</p>
                    <p class="mb-1">* 오늘 기준 <span class="info--text">( 오전 10시 )</span>, 30일 이후부터 예약이 잡힙니다.</p>
                    <p class="mb-1">* 자동 예약 예상 일자를 기준으로 전송 조건 설정 하신 요일, 객실 만 지정된 비율로 예약됩니다.</p>
                    <p class="mb-0 red--text">* 자동 예약 예상 일자 : {{ expectDate }} 요일 - 관리중인 파트너라도 예약일자에 객실상품이 이용중 이어야 예약이
                        잡힙니다.</p>
                </v-col>
            </v-row>
            <v-row align="end">
                <v-col cols="12" md="7" class="text-left">
                    <v-icon small left>check</v-icon>
                    {{ list.length }} 개 파트너사
                </v-col>
                <v-col cols="12" md="5" class="pt-0">
                    <v-text-field v-model="searchKeyword" hide-details single-line outlined small dense
                                  append-icon="mdi-magnify" label="Search" clearable autocomplete="off" />
                </v-col>
            </v-row>
            <v-form ref="companyForm" lazy-validation autocomplete="off">
                <v-card class="mb-3" color="teal lighten-5">
                    <v-card-text class="py-0">
                        <v-row align="center">
                            <v-col cols="7" class="font-weight-black subtitle-1 text-left py-1">
                                본사 소유비율 <br />* <small>입력 비율을 제외한 수량이 파트너에 분배됩니다.</small>
                            </v-col>
                            <v-col cols="5" class="pl-0 py-0">
                                <v-text-field v-model="companyData.rate" type="number" suffix="%"
                                              :rules="emptyRules.concat(rateRule)" single-line dense>
                                    <template v-slot:prepend-inner>
                                        <span class="mr-3 pt-2 text-nowrap info--text font-weight-bold">비율</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-form>
            <v-divider class="my-0 pb-2"></v-divider>
        </template>
        <v-form ref="form" lazy-validation autocomplete="off">
            <draggable v-model="list">
                <template v-for="item of filterList">
                    <v-hover v-slot:default="{ hover }" :key="item.partnerSeq">
                        <v-card raised
                                :elevation="hover ? 5 : 1"
                                style="cursor: move"
                                class="mb-1">
                            <v-card-text class="py-0">
                                <v-row dense align="center">
                                    <v-col cols="3" class="font-weight-black subtitle-1">
                                        {{ item.companyName }} <small>({{ item.ptnrId }})</small>
                                    </v-col>
                                    <v-menu
                                        offset-y
                                        transition="slide-y">
                                        <template v-slot:activator="{ on }">
                                            <v-col cols="6">
                                                <v-row dense>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            v-model="item.memNo"
                                                            v-on="on"
                                                            :rules="emptyRules"
                                                            readonly
                                                            placeholder="회원 번호를 선택해 주세요."
                                                            hide-details
                                                            class="pt-2"
                                                            label="회원 번호"
                                                            dense />
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            :value="item.agentCodeName"
                                                            v-on="on"
                                                            :rules="emptyRules"
                                                            readonly
                                                            hide-details
                                                            class="pt-2"
                                                            placeholder="대매사를 선택해 주세요."
                                                            label="대매사"
                                                            dense />
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </template>
                                        <v-list dense>
                                            <v-list-item v-for="(info, index) of item.rsvInfoList" :key="index"
                                                         class="border-bottom px-2" @click="selectInfo(item, info)">
                                                <v-list-item-action class="mr-2">
                                                    <v-icon>
                                                        {{ info.memNo === item.memNo && info.agentCode === item.agentCode ? "check_box" : "check_box_outline_blank" }}
                                                    </v-icon>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-row dense no-gutters align="center">
                                                        <v-col cols="6" class="border-left pl-1">
                                                            <p class="mb-1">{{ info.memName }}</p>
                                                            ( {{ info.memNo }} )
                                                        </v-col>
                                                        <v-col cols="6" class="border-left pl-2">
                                                            <p class="mb-1">{{ info.agentCodeName }}</p>
                                                            ( {{ info.agentCode }} )
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                    <v-col cols="3">
                                        <v-row dense align="center">
                                            <v-col cols="7">
                                                <v-text-field
                                                    v-model="item.rate"
                                                    type="number"
                                                    suffix="%"
                                                    label="비율"
                                                    placeholder="입력해 주세요."
                                                    dense
                                                    hide-details
                                                    class="pt-2"
                                                    :rules="emptyRules.concat(rateRule)" />
                                            </v-col>
                                            <v-col cols="5" class="text-right">
                                                <v-btn small color="red" outlined @click="removePartner(item)">
                                                    <v-icon left>arrow_back</v-icon>
                                                    제거
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-hover>
                </template>
            </draggable>
        </v-form>
        <template v-slot:action v-if="!searchKeyword">
            <v-row no-gutters align="center" class="px-4">
                <v-col xl="6" cols="12" class="primary--text">
                    <p :class="['mb-0', 0 > sum || sum > 100 ? 'red--text' : 'success--text']">
                        <span class="font-weight-black">합계 : {{ sum }} % </span>
                        <span class="font-weight-black ml-3">잔여 : {{ remainRate }} %</span>
                        <span class="ml-3">본사 : {{ companyData.rate || 0 }} %</span>
                        <span class="ml-3">파트너 : {{ partnerRate }} %</span>
                    </p>
                </v-col>
                <v-col xl="6" cols="12" class="text-right">
                    <v-btn rounded color="success" @click="reassignment" v-if="writeAuth">
                        <v-icon left>mdi-calendar-import</v-icon>
                        일자별 재할당 (F2)
                    </v-btn>
                    <v-btn rounded color="warning" @click="refreshCall">
                        <v-icon left>refresh</v-icon>
                        초기화 (F3)
                    </v-btn>
                    <v-btn rounded color="info" @click="submit" v-if="writeAuth">
                        <v-icon left>check</v-icon>
                        저장 (F4)
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </app-card>
</template>

<script>
import partnerInventoryRateService from '@/api/modules/partner/partnerInventoryRate.service'
import { mapGetters } from 'vuex'

export default {
  props: {
    company: {
      type: Object,
      required: true
    },
    refresh: {
      type: Function
    }
  },
  name: 'PartnerInventoryRateManageList',
  data () {
    return {
      searchKeyword: '',
      rateRule: [v => (v > -1 && v <= 100) || '0~100% 사이의 숫자만 허용됩니다.'],
      list: [],
      companyData: {}
    }
  },
  watch: {
    managementList (newList) {
      this.list = newList
    },
    company (newData) {
      this.companyData = newData
      this.$refs.companyForm.resetValidation()
    }
  },
  mounted () {
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        { target: 'F2', action: this.reassignment, writeAuth: true },
        { target: 'F3', action: this.refreshCall },
        { target: 'F4', action: this.submit, writeAuth: true }]
    })
  },
  computed: {
    ...mapGetters({
      managementList: 'partner/inventory/managementList',
      noneList: 'partner/inventory/noneList'
    }),
    expectDate () {
      // 당일 10시 인지 아닌지 판단.
      if (parseInt(moment().format('HH') < 10)) {
        // 당일 10시 일경우 오늘 + 30일
        return '오늘 오전 10시 -> ' + moment().add(30, 'days').format('YYYY 년 MM 월 DD 일 (ddd)')
      } else {
        // 당일 10시가 지났을 경우 오늘 + 31일
        return '내일 오전 10시 -> ' + moment().add(31, 'days').format('YYYY 년 MM 월 DD 일 (ddd)')
      }
    },
    filterList () {
      if (this.searchKeyword) {
        return this.list.filter(data => data.companyName.includes(this.searchKeyword))
      } else {
        return this.list
      }
    },
    sum () {
      let sum = 0
      if (this.companyData.rate && !isNaN(this.companyData.rate)) {
        sum += parseFloat(this.companyData.rate)
      }
      for (const item of this.list) {
        if (item.rate && !isNaN(item.rate)) {
          sum += parseFloat(item.rate)
        }
      }
      return Math.round(sum * 1e12) / 1e12
    },
    remainRate () {
      return Math.round((100 - this.sum) * 1e12) / 1e12
    },
    partnerRate () {
      return Math.round((this.sum - (this.companyData.rate || 0)) * 1e12) / 1e12
    }
  },
  methods: {
    /**
         * 저장
         */
    async submit () {
      try {
        await this.validForm(this.$refs.companyForm)
        await this.validForm(this.$refs.form)
        if (this.sum < 0 || this.sum > 100) {
          this.$dialog.alert('비율의 합계는 0 ~ 100 % 사이여야 합니다.')
          return
        }
        await this.$dialog.confirm('파트너별 재고관리 비율을 입력하시겠습니까?<br/><span style="font-weight: bold">자동 예약 예상 일자를 기준으로 전송 조건 설정 하신 요일, 객실 만 지정된 비율로 예약됩니다.</span>')
        // 전송데이터 리스트를 만든다.
        // 본사 데이터
        const list = [{ ptnrYn: 'N', rate: this.companyData.rate, sortSeq: 0 }]
        // 파트너 데이터
        let sortSeq = 1
        for (const partner of this.list) {
          list.push({
            partnerSeq: partner.partnerSeq,
            ptnrYn: 'Y',
            rate: partner.rate,
            sortSeq: sortSeq,
            memNo: partner.memNo,
            agentCode: partner.agentCode
          })
          sortSeq++
        }
        await partnerInventoryRateService.insertPartnerInventoryRateList(list)
        this.refresh()
        this.$dialog.alert('재고예약 비율을 입력하였습니다.')
      } catch (e) {
      }
    },
    /**
         * 선택 파트너 목록에서 제거
         * @param item
         */
    async removePartner (item) {
      try {
        await this.$dialog.confirm(`${item.companyName}를 재고관리목록에서 제거 하시겠습니까?`)
        // 관리 리스트에서 제거
        const list = this.list
        list.splice(list.findIndex(data => data.partnerSeq === item.partnerSeq), 1)
        await this.$store.dispatch('partner/inventory/setList', list)
        // 미관리 리스트에 추가
        const noneList = this.noneList
        noneList.push(Object.assign({}, item, { rate: '', add: false }))
        await this.$store.dispatch('partner/inventory/setNoneList', noneList)
      } catch (e) {
      }
    },
    /**
         * 재조회
         */
    refreshCall () {
      this.$dialog.confirm('데이터를 초기화 하시겠습니까?').then(() => {
        this.searchKeyword = ''
        this.refresh()
      })
    },
    /**
         * 회원번호, 대매사 선택 이벤트
         * @param item
         * @param info
         */
    selectInfo (item, info) {
      item.memNo = info.memNo
      item.agentCode = info.agentCode
      item.agentCodeName = info.agentCodeName
    },
    /**
         * 일자별 재할당 팝업 호출
         */
    reassignment () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Inventory/PartnerInventoryReassignment/PartnerInventoryReassignment',
        params: {},
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
