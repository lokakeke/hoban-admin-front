<template>
  <v-row>
    <app-card :heading="'입력 조건 선택'" col-classes="col-12">
      <v-alert dense outlined type="success" class="font-sm">
        휴무일은 판매여부로 관리됩니다.
      </v-alert>
      <v-alert dense outlined type="error" class="font-sm mb-0">
        임시 테이블에 일정 저장 완료시 알림이 옵니다. 임시 일정 메뉴에서 승인 처리 후 최종 일정 데이터가 생성됩니다.
      </v-alert>
      <template v-if="!nextStep">
        <v-form ref="form" lazy-validation autocomplete="off">
          <v-row>
            <v-col cols="6">
              <div class="font-weight-bold subtitle-1">서비스 선택</div>
              <v-autocomplete
                v-model="selectBusiness"
                :items="businessCodeList"
                item-value="storeId"
                item-text="serviceName"
                :rules="emptyRules"
                @change="selectItemList"
                autocomplete="off"
                placeholder="서비스를 선택해 주세요."
                return-object hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="itemList.length > 0">
              <div class="font-weight-bold subtitle-1">상품 선택<span class="font-sm font-weight-light"> (상품명, 패키지번호, 회원번호로 검색 가능합니다.)</span></div>
              <select-all-list
                v-model="selectItem"
                :items="itemList"
                item-value="itemId"
                :item-text="setItemText"
                autocomplete="off"
                label="상품을 선택해 주세요."
                multiple clearable deletable-chips chips small-chips return-object dense single-line required />
            </v-col>
            <v-col cols="12" class="pb-0">
              <div class="font-weight-bold subtitle-1">날짜 선택</div>
            </v-col>
          </v-row>
        </v-form>
        <v-row align="center">
          <v-col cols="3" class="pt-0">
            <date-range-picker v-model="selectDate" hide-details :min="min" :max="max"></date-range-picker>
          </v-col>
          <v-col cols="2">
            <v-btn outlined rounded block color="success" @click="setDate"><v-icon left>check</v-icon>기간 적용</v-btn>
          </v-col>
          <v-col cols="2" class="text-left">
            <v-switch v-model="isBusinessDay" true-value="Y" false-value="N" inset color="blue" hide-details class="mt-0">
              <template v-slot:label>
                <span class="font-weight-bold subtitle-1" :class="isBusinessDay === 'Y' ? 'blue--text' : 'grey--text'">{{ isBusinessDay === 'Y' ? '판매' : '휴무' }}</span>
              </template>
            </v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-row justify="start" class="px-4">
              <v-checkbox style="min-width: 90px;" v-for="day of days" :key="day.key" v-model="day.value" :label="day.text" hide-details :color="day.color"></v-checkbox>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="start">
            <v-icon color="#3182ce">lens</v-icon>
            선택된 날짜
          </v-col>
          <v-col>
            <vc-date-picker v-model="dates" is-inline :columns="$screens({xl:4, lg: 4, md: 2, sm:1})" :min-date="min" :max-date="max" mode="multiple"></vc-date-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-left pb-0">
            <v-btn large rounded color="success" @click="setData" :disabled="selectItem.length === 0"><v-icon left>check</v-icon>조건 선택</v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col sm="3" cols="12">
            <div class="headline mb-3"><v-icon color="info" left>done_outline</v-icon>서비스</div>
            <div class="subtitle-1 mt-2">
              {{ selectBusiness.serviceName }}
            </div>
          </v-col>
          <v-col sm="3" cols="12" headline>
            <div class="headline mb-3"><v-icon color="info" left>done_outline</v-icon>상품</div>
            <div class="subtitle-2 mt-2" v-for="item of selectItem" :key="item.itemId">
              {{ item.name }}
            </div>
          </v-col>
          <v-col sm="4" cols="12" headline>
            <div class="headline mb-3"><v-icon color="info" left>done_outline</v-icon>기간</div>
            <div class="subtitle-1 mt-2" v-html="datesText"></div>
          </v-col>
          <v-col sm="2" cols="12" headline>
            <div class="headline mb-3"><v-icon color="info" left>done_outline</v-icon>판매 여부</div>
            <div class="subtitle-1 mt-2">
              <v-chip outlined :color="isBusinessDay === 'Y' ? 'blue' : 'red'">
                {{ isBusinessDay === 'Y' ? '판매' : '휴무' }}
              </v-chip>
            </div>
          </v-col>
          <v-col cols="12" class="text-right py-0">
            <v-btn rounded color="accent" @click="refreshSet">
              <v-icon left>refresh</v-icon>
              재선택
            </v-btn>
            <v-btn rounded color="primary" @click="save" :disabled="isDisabledSave">
              <v-icon left>save</v-icon>
              임시 테이블 저장
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <loading
        :active.sync="showLoading"
        :is-full-page="false"
        :z-index="10"
      >
        <slot>
          <span class="red--text font-weight-bold font-2x">이미 존재하는 임시 일정 데이터가 있습니다.<br />승인/삭제 후 등록 가능합니다.</span>
        </slot>
      </loading>
    </app-card>
  </v-row>
</template>

<script>
import SelectAllList from '@/components/Select/SelectAllList.vue'
import itemService from '@/api/modules/naver/item.service'
import scheduleService from '@/api/modules/naver/schedule.service'
import Loading from 'vue-loading-overlay'

export default {
  name: 'Schedule',
  components: {
    Loading,
    SelectAllList
  },
  data () {
    return {
      nextStep: false,
      days: [
        { value: true, key: 0, text: '일요일', color: 'red' },
        { value: true, key: 1, text: '월요일', color: 'primary' },
        { value: true, key: 2, text: '화요일', color: 'primary' },
        { value: true, key: 3, text: '수요일', color: 'primary' },
        { value: true, key: 4, text: '목요일', color: 'primary' },
        { value: true, key: 5, text: '금요일', color: 'primary' },
        { value: true, key: 6, text: '토요일', color: 'blue' }
      ],
      selectDate: [],
      dates: [],
      min: moment().format('YYYY-MM-DD'),
      max: moment().add(6, 'months').format('YYYY-MM-DD'),
      businessCodeList: [],
      selectBusiness: {},
      itemList: [],
      selectItem: [],
      scheduleItemList: [],
      scheduleDateList: [],
      isDisabledSave: false,
      showLoading: false,
      isBusinessDay: 'Y'
    }
  },
  computed: {
    datesText () {
      let text = ''
      const dates = _.cloneDeep(this.dates).sort((d1, d2) => new Date(d1).getTime() - new Date(d2).getTime())
      text += moment(_.first(dates)).format('YYYY 년 MM월 DD일') + ' ~ ' + moment(_.last(dates)).format('YYYY 년 MM월 DD일') +
        '<br/><span class="red--text lighten-4">' + dates.length + '일이 선택 되었습니다.</span>'
      return text
    }
  },
  mounted () {
    /**
     * 사업장 리스트 조회
     */
    itemService.selectBusinessCodeList().then(res => {
      this.businessCodeList = res.data
    })
    // 승인 대기중인 스케줄 데이터가 있는지 확인
    this.checkScheduleTemp()
  },
  beforeDestroy () {
    this.showLoading = false
  },
  methods: {
    checkScheduleTemp () {
      scheduleService.countScheduleTempMst({ status: 'I' }).then((result) => {
        if (!result || result.data !== 0) {
          this.$dialog.alert('이미 존재하는 임시 일정 데이터가 있습니다. 승인/삭제 후 등록 가능합니다.').then(() => {
            this.showLoading = true
          })
        } else {
          this.showLoading = false
        }
      })
    },
    selectItemList () {
      this.itemList = []
      this.selectItem = []
      const param = {
        storeId: this.selectBusiness.storeId,
        filterItem: 'Y',
        scheduleSendYn: 'Y',
        sorts: 'recent'
      }
      itemService.selectItemList(param).then(res => {
        if (res.data && res.data.length > 0) {
          this.itemList = res.data
        } else {
          this.$dialog.alert('등록된 상품이 없습니다. 상품을 등록해주세요.')
        }
      })
    },
    /**
     * 선택 날짜 적용
     */
    setDate () {
      if (this.selectDate.length !== 2 || this.selectDate[0] == null || this.selectDate[1] == null) {
        this.$dialog.alert('기간 적용 될 날짜를 선택해 주세요.')
      } else {
        // 기간 설정
        const startDate = moment(this.selectDate[0])
        const endDate = moment(this.selectDate[1])
        const days = endDate.diff(moment(startDate), 'days')
        // 날짜설정을 만든다.
        const dates = []
        for (let i = 0; i <= days; i++) {
          const date = moment(startDate).add(i, 'days')
          const selectDay = date.day()
          // 요일 분석
          for (const day of this.days) {
            if (day.value && day.key === selectDay) {
              dates.push(date.toDate())
            }
          }
        }
        this.dates = dates
      }
    },
    setData () {
      this.validForm(this.$refs.form).then(() => {
        if (this.selectItem.length === 0) {
          this.$dialog.alert('상품을 선택해 주세요.')
        } else if (this.dates.length === 0) {
          this.$dialog.alert('적용 될 날짜를 선택해 주세요.')
        } else {
          const formatDateList = []
          for (const date of this.dates) {
            formatDateList.push({
              startDate: moment(date).format('YYYY-MM-DD'),
              endDate: moment(date).format('YYYY-MM-DD')
            })
          }
          const formatItemList = []
          for (const item of this.selectItem) {
            formatItemList.push({
              businessId: item.businessId,
              bizItemId: item.bizItemId
            })
          }
          this.scheduleDateList = _.cloneDeep(formatDateList)
          this.scheduleItemList = _.cloneDeep(formatItemList)
          this.nextStep = true
        }
      })
    },
    /**
     * 선택 기초 데이터 초기화
     */
    refreshSet () {
      this.$dialog.confirm('조건을 재선택 하시겠습니까? <br/>입력하신 데이터는 사라지게 됩니다.').then(() => {
        this.initData()
      })
    },
    initData () {
      this.isBusinessDay = 'Y'
      this.nextStep = false
      this.scheduleDateList = []
      this.scheduleItemList = []
      this.selectBusiness = {}
      this.selectItem = []
      this.itemList = []
      this.selectDate = []
      this.dates = []
      this.days = [
        { value: true, key: 0, text: '일요일', color: 'red' },
        { value: true, key: 1, text: '월요일', color: 'primary' },
        { value: true, key: 2, text: '화요일', color: 'primary' },
        { value: true, key: 3, text: '수요일', color: 'primary' },
        { value: true, key: 4, text: '목요일', color: 'primary' },
        { value: true, key: 5, text: '금요일', color: 'primary' },
        { value: true, key: 6, text: '토요일', color: 'blue' }
      ]
    },
    setItemText (item) {
      return `${item.packageYn === 'Y' ? '[패키지]' : '[객실]'} ${item.name} (${item.mid}) ${Number(item.scheduleCnt) === 0 ? ' : 신규' : ''}`
    },
    save () {
      this.$dialog.confirm('저장을 하시겠습니까? <br/>임시 테이블에 일정 저장 완료시 알림이 옵니다. 임시 일정 메뉴에서 승인 처리 후 최종 일정 데이터가 생성됩니다.').then(() => {
        this.isDisabledSave = true
        const paramList = {
          firstDate: moment(_.first(this.dates)).format('YYYY-MM-DD'),
          lastDate: moment(_.last(this.dates)).format('YYYY-MM-DD'),
          businessId: this.selectBusiness.businessId,
          isBusinessDay: this.isBusinessDay,
          dateList: this.scheduleDateList,
          itemList: this.scheduleItemList
        }
        scheduleService.insertScheduleTempMst(paramList).then(() => {
          this.initData()
          this.isDisabledSave = false
          this.$dialog.alert('알림이 오면 임시 일정 메뉴에서 승인해주세요.').then(() => {
            this.showLoading = true
          })
        }).catch(() => {
          this.initData()
          this.isDisabledSave = false
          setTimeout(() => {
            // 승인 대기중인 스케줄 데이터가 있는지 확인
            this.checkScheduleTemp()
          }, 2000)
        })
      })
    }
  }
}
</script>
