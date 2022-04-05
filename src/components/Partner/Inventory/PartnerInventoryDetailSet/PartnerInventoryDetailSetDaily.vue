<template>
  <div>
    <v-row align="start" no-gutters v-if="!isDialog">
      <v-col cols="12">
        <p class="mb-3 font-weight-bold title primary--text">* 일자별 잔여재고 상세할당</p>
      </v-col>
    </v-row>
    <v-card outlined>
      <v-card-text v-if="select" class="pb-0 px-2 pt-2">
        <v-row no-gutters>
          <v-col cols="6">
            <span class="subtitle-1 info--text">영업장</span>
            <p class="mt-0 mb-1 pl-3 subtitle-1 font-weight-bold" v-html="select.storeName"></p>
          </v-col>
          <v-col cols="6">
            <span class="subtitle-1 info--text">객실유형</span>
            <v-btn icon absolute right small @click="initSelect" v-if="!isDialog"><v-icon>close</v-icon></v-btn>
            <p class="mt-0 mb-1 pl-3 subtitle-1 font-weight-bold">{{select.rmTypeName}}</p>
          </v-col>
          <v-col cols="6">
            <span class="subtitle-1 info--text">일자</span>
            <p class="mt-0 mb-1 pl-3 subtitle-1 font-weight-bold">{{select.date}}</p>
          </v-col>
          <v-col cols="6">
            <span class="subtitle-1 info--text">잔여재고</span>
            <p class="mt-0 mb-1 pl-3 subtitle-1 font-weight-bold">{{select.stockQty}}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else class="title font-weight-bold text-center">
        * 기준정보를 선택 해 주세요.
      </v-card-text>
    </v-card>
    <v-card v-if="select" flat>
      <div class="py-3 pl-3 title font-weight-bold">
        <v-icon>list</v-icon> 파트너 리스트
        <small>* 객실 상품 이용중인 파트너만 설정 가능합니다.</small>
      </div>
      <v-form ref="form" lazy-validation autocomplete="off">
      <v-list>
        <v-list-item v-for="(item, index) of partnerList" :key="item.ptnrNo" class="px-1" :class="{'border-top': index !== 0}">
          <v-row no-gutters align="center">
            <v-col cols="3" class="pointer" @click="check(item)">
              <v-icon left>{{item.check? 'check_box': 'check_box_outline_blank'}}</v-icon>
              {{item.ptnrName}} <!--<small>( {{item.ptnrId}} )</small>-->
            </v-col>
            <v-menu
              offset-y
              transition="slide-y">
              <template v-slot:activator="{ on }">
                <v-col cols="7">
                  <v-row no-gutters>
                    <v-col cols="6" class="pr-2 pt-3">
                      <v-text-field
                        v-on="on"
                        class="py-1"
                        autocomplete="off"
                        v-model="item.memNo"
                        :rules="item.check? emptyRules: undefined"
                        readonly
                        :hide-details="'auto'"
                        :disabled="!item.check"
                        placeholder="회원 번호를 선택해 주세요."
                        label="회원 번호"
                        dense />
                    </v-col>
                    <v-col cols="6" class="pr-2 pt-3">
                      <v-text-field
                        autocomplete="off"
                        v-on="on"
                        class="py-1"
                        :value="item.agentCode | label(item.rsvInfoList, 'agentCode', 'agentCodeName')"
                        :rules="item.check? emptyRules: undefined"
                        readonly
                        :hide-details="'auto'"
                        :disabled="!item.check"
                        placeholder="대매사를 선택해 주세요."
                        label="대매사"
                        dense />
                    </v-col>
                  </v-row>
                </v-col>
              </template>
              <v-list dense>
                <v-list-item v-for="(info, index) of item.rsvInfoList" :key="index" class="border-bottom px-2" @click="selectInfo(item, info)">
                  <v-list-item-action class="mr-2">
                    <v-icon>{{info.memNo === item.memNo && info.agentCode === item.agentCode ? 'check_box': 'check_box_outline_blank'}}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-row dense no-gutters align="center">
                      <v-col cols="2">
                        회원번호
                      </v-col>
                      <v-col cols="4" class="border-left pl-1">
                        <p class="mb-1">{{info.memName}}</p>
                        ( {{info.memNo}} )
                      </v-col>
                      <v-col cols="2" class="border-left pl-1">
                        대매사
                      </v-col>
                      <v-col cols="4" class="border-left pl-1">
                        <p class="mb-1">{{info.agentCodeName}}</p>
                        ( {{info.agentCode}} )
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-col cols="2" class="pt-3">
              <v-currency-field
                class="py-1"
                autocomplete="off"
                v-model="item.qty"
                label="전송 재고"
                placeholder="입력해 주세요."
                :rules="item.check? emptyRules.concat(oneOrMoreRegex): undefined"
                :disabled="!item.check"
                :hide-details="'auto'"
                dense />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
      </v-form>
      <v-card-actions>
        <v-row no-gutters justify="space-between" align="end">
          <div :class="errorCheck.error ? 'red--text': 'blue--text'">
            <span>잔여 재고: {{select.stockQty}} , </span>
            <span class="ml-2">입력 재고: {{insertQty}}</span>
            <span v-if="errorCheck.error" class="ml-3">( * {{errorCheck.errorMsg}} )</span>
          </div>
          <v-btn v-if="writeAuth" color="info" @click="submit"><v-icon left>check</v-icon>저장</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import partnerInventoryDetailSetService from '@/api/modules/partner/partnerInventoryDetailSet.service'

export default {
  model: {
    prop: 'select',
    event: 'change'
  },
  props: {
    select: {
      type: Object,
      default () {
        return null
      }
    },
    /**
     * 다이얼로그 창에서 호출된 상태인지 판단
     */
    isDialog: {
      type: Boolean,
      default () {
        return false
      }
    },
    partnerOrigin: {
      type: Array,
      default () {
        return []
      }
    }
  },
  name: 'PartnerInventoryDetailSetDaily',
  data () {
    return {
      partnerList: []
    }
  },
  watch: {
    select (newVal) {
      if (newVal) {
        this.changeSelect()
      }
    }
  },
  computed: {
    insertQty () {
      if (this.partnerList && this.partnerList.length > 0) {
        return this.partnerList.filter(data => data.check && !isNaN(data.qty) && data.qty).reduce((sum, data) => sum + parseInt(data.qty), 0)
      } else {
        return 0
      }
    },
    errorCheck () {
      const data = {
        error: false,
        errorMsg: ''
      }
      if (parseInt(this.select.stockQty) === 0) {
        data.error = true
        data.errorMsg = '잔여 재고량이 없습니다.'
      } else if (this.insertQty === 0) {
        data.error = true
        data.errorMsg = '입력 재고량이 없습니다.'
      } else if (this.select.stockQty < this.insertQty) {
        data.error = true
        data.errorMsg = '입력 재고량이 잔여 재고량을 초과하였습니다.'
      }
      return data
    }
  },
  async mounted () {
    // 다이얼로그 호출 시 직접 change 이벤트 호출
    if (this.isDialog) {
      this.changeSelect()
    }
  },
  methods: {
    /**
     * 블럭 기준정보 데이터 선택 이벤트 - 입력 데이터 초기화
     */
    async changeSelect () {
      this.partnerList = this.partnerOrigin.map(data => {
        return Object.assign({}, data, {
          storeCode: this.select.storeCode,
          rmTypeCode: this.select.rmTypeCode,
          ciYmd: this.replaceAll(this.select.date, '-', ''),
          qty: undefined,
          agentCode: '',
          memNo: '',
          check: false
        })
      })
      // reset validation
      await this.$nextTick()
      this.$refs.form.resetValidation()
    },
    /**
     * 블럭 기준정보 선택 데이터 초기화
     */
    initSelect () {
      this.$emit('change', null)
    },
    /**
     * 체크박스 클릭 이벤트
     * @param item 업체 row 데이터
     */
    check (item) {
      item.check = !item.check
      // false 일 경우 값을 날려준다.
      if (!item.check) {
        item.qty = undefined
        item.agentCode = ''
        item.memNo = ''
      } else {
        // true 일 경우 자동으로 agentCode 및 memNo 를 셋팅해준다.
        if (item.rsvInfoList && _.isArray(item.rsvInfoList) && item.rsvInfoList.length > 0) {
          item.agentCode = item.rsvInfoList[0].agentCode
          item.memNo = item.rsvInfoList[0].memNo
        }
      }
    },
    /**
     * 저장
     */
    async submit () {
      try {
        // form valid
        await this.validForm(this.$refs.form)
        // 재고 valid
        if (this.errorCheck.error) {
          this.$dialog.alert(this.errorCheck.errorMsg)
        } else {
          await this.$dialog.confirm('잔여재고를 할당 하시겠습니까?')
          // 전송 리스트
          const insertList = this.partnerList.filter(data => data.check).map(data => {
            return {
              ptnrNo: data.ptnrNo,
              storeCode: data.storeCode,
              rmTypeCode: data.rmTypeCode,
              ciYmd: data.ciYmd,
              memNo: data.memNo,
              agentCode: data.agentCode,
              rmCnt: data.qty
            }
          })
          // 선택 정보
          const param = {
            storeCode: this.select.storeCode,
            rmTypeCode: this.select.rmTypeCode,
            ciYmd: this.select.date,
            rsvBlckCode: this.select.rsvBlckCode,
            insertList
          }
          const res = await partnerInventoryDetailSetService.insertPartnerInventoryDetailSetList(param)
          // 결과 팝업 호출
          await this.$store.dispatch('dialog/open', {
            componentPath: '/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetResult',
            params: {
              list: res.data
            },
            options: {
              fullscreen: false,
              scrollable: true,
              width: 1000
            }
          })
          // 재조회
          this.$emit('refresh')
        }
      } catch (e) {}
    },
    /**
     * 회원번호, 대매사 선택 이벤트
     * @param item
     * @param info
     */
    selectInfo (item, info) {
      item.memNo = info.memNo
      item.agentCode = info.agentCode
    }
  }
}
</script>

<style scoped>
  .v-list .v-list-item div {
    font-size: 14px;
  }
</style>
