<template>
  <v-form lazy-validation ref="form" autocomplete="off">
    <v-row align="center">
      <v-col cols="4" class="py-0">
        <v-radio-group v-model="searchForm.searchType" row hide-details>
          <v-radio label="일자별" value="D" color="info"></v-radio>
          <v-radio label="월별" value="M" color="info"></v-radio>
          <v-radio label="연도별" value="Y" color="info"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4" class="py-0">
        <v-row v-if="searchForm.searchType === 'D'" no-gutters>
          <v-col cols="6">
            <date-picker
              v-model="searchForm.searchFromDate"
              :max="searchForm.searchToDate"
              append-outer-icon="mdi-tilde"
              hide-details
              format="YYYY-MM-DD"
              required />
          </v-col>
          <v-col cols="6" class="pl-2">
            <date-picker
              v-model="searchForm.searchToDate"
              :min="searchForm.searchFromDate"
              hide-details
              format="YYYY-MM-DD"
              required />
          </v-col>
        </v-row>
        <v-row v-else-if="searchForm.searchType === 'M'" no-gutters>
          <v-col cols="6">
            <v-menu
              v-model="menuFrom"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="searchForm.searchFromMonth | date('YYYY[ 년 ]MM[ 월]')"
                  append-icon="zmdi zmdi-calendar-note"
                  append-outer-icon="mdi-tilde"
                  readonly
                  v-on="on"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="searchForm.searchFromMonth"
                :max="searchForm.searchToMonth"
                type="month"
                locale="ko-KR"
                no-title
                scrollable
                @input="menuFrom = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" class="pl-2">
            <v-menu
              v-model="menuTo"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="searchForm.searchToMonth | date('YYYY[ 년 ]MM[ 월]')"
                  append-icon="zmdi zmdi-calendar-note"
                  readonly
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="searchForm.searchToMonth"
                :min="searchForm.searchFromMonth"
                type="month"
                locale="ko-KR"
                no-title
                scrollable
                @input="menuTo = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row v-else-if="searchForm.searchType === 'Y'">
          <v-col cols="6" class="py-0">
            <v-autocomplete v-model="searchForm.searchFromYear" autocomplete="off" append-outer-icon="mdi-tilde"
                            :items="yearFromList" :rules="emptyRules" hide-details />
          </v-col>
          <v-col cols="6" class="py-0">
            <v-autocomplete v-model="searchForm.searchToYear" autocomplete="off"
                            :items="yearToList" :rules="emptyRules" hide-details />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">기간 타입을 선택해 주세요.</v-col>
        </v-row>
      </v-col>
      <v-col cols="4" class="text-right py-0 align-self-center">
        <v-btn rounded color="info" @click="search"><v-icon left>search</v-icon>검색 (F4)</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pt-0">
        <v-radio-group v-model="searchForm.searchKind" row hide-details>
          <v-radio label="전체" value="A" color="info"></v-radio>
          <v-radio label="상시" value="O" color="info"></v-radio>
          <v-radio label="전략" value="S" color="info"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col col="4" class="pt-0">
        <v-radio-group v-model="searchForm.saleKind" row hide-details>
          <v-radio label="판매" value="S" color="info"></v-radio>
          <v-radio label="사용" value="U" color="info"></v-radio>
          <v-radio label="취소" value="C" color="info"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4" class="text-right py-0 align-self-center" v-if="writeAuth">
        <v-btn outlined rounded color="info" @click="addData"><v-icon>add</v-icon>데이터 생성</v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="11">
        <select-all-list
          v-model="searchForm.chrgList"
          :items="chrgList"
          item-value="value"
          item-text="label"
          placeholder="담당자를 선택해 주세요."
          no-data-text="검색 가능한 담당자가 없습니다."
          :prefix="'담당자 : '"
          :classes="'pt-0 mt-0'"
          multiple clearable deletable-chips chips small-chips single-line required
        ></select-all-list>
      </v-col>
    </v-row>
    <v-row no-gutters v-show="tab === 1">
      <v-col cols="11" class="pt-1">
        <select-all-list
          v-model="searchForm.chnnlList"
          :items="chnnlList"
          item-value="value"
          item-text="label"
          placeholder="채널을 선택해 주세요."
          no-data-text="검색 가능한 채널리스트가 없습니다."
          :prefix="'채널 : '"
          :classes="'pt-0 mt-0'"
          :required="tab === 1"
          multiple clearable deletable-chips chips small-chips single-line
        ></select-all-list>
      </v-col>
    </v-row>
    <v-row no-gutters v-show="tab === 2">
      <v-col cols="11" class="pt-1">
        <select-all-list
          v-model="searchForm.ptnrList"
          :items="ptnrList"
          item-value="value"
          item-text="label"
          placeholder="파트너사를 선택해 주세요."
          no-data-text="검색 가능한 파트너사가 없습니다."
          :prefix="'파트너 : '"
          :classes="'pt-0 mt-0'"
          :required="tab === 2"
          multiple clearable deletable-chips chips small-chips single-line
        ></select-all-list>
      </v-col>
    </v-row>
    <v-row no-gutters  v-show="tab === 3" class="pt-1 pb-3">
      <v-col cols="12">
        <v-row no-gutters align="center">
          <span class="pr-2 black--text">우대번호</span>
          <v-btn outlined rounded small color="blue" @click="addTicketDialog">
            <v-icon color="blue" left>add</v-icon>선택
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="12" class="pt-2">
        <v-label v-if="!searchForm.ticketList || searchForm.ticketList.length === 0">
          우대번호를 선택해 주세요.
        </v-label>
        <div v-else>
          <v-chip
            v-for="item of searchForm.ticketList"
            :key="item.ticketNo"
            small
            close
            class="mr-2"
            @click:close="removeTicket(item)">
            {{item.ticketNm}} - {{item.ticketNo}}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import SelectAllList from 'Components/Select/SelectAllList.vue'
import statisticsService from 'Api/modules/social/statistics.service'

export default {
  // extends: DialogBase,
  name: 'StatisticsSearchForm',
  model: {
    prop: 'tab'
  },
  props: {
    tab: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  components: { SelectAllList },
  data () {
    return {
      searchForm: {},
      yearList: [],
      chrgList: [],
      chnnlList: [],
      ptnrList: [],
      menuFrom: false,
      menuTo: false
    }
  },
  computed: {
    yearFromList () {
      // 최대 기간이하
      if (this.searchForm.searchToYear) {
        return this.yearList.filter(data => data.value <= this.searchForm.searchToYear)
      } else {
        return this.yearList
      }
    },
    yearToList () {
      // 최소 기간이상
      if (this.searchForm.searchFromYear) {
        return this.yearList.filter(data => data.value >= this.searchForm.searchFromYear)
      } else {
        return this.yearList
      }
    }
  },
  async mounted () {
    // 담당자 리스트 조회
    this.chrgList = await statisticsService.selectChrgList()
    this.chnnlList = await statisticsService.selectChnnlList()
    this.ptnrList = await statisticsService.selectPtnrList()
    // 기본 검색조건 셋팅
    this.searchForm = await this.$store.dispatch('social/statistics/initCondition')
    // 키 입력 이벤트 추가
    await this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F4',
          action: this.search
        }
      ]
    })
    // 연도 리스트 : 이전 10년 ~ 내년 까지 리스트를 만든다
    const yearLength = 9
    const year = parseInt(moment().format('YYYY')) + 1
    const yearList = []
    for (let index = 0; index < yearLength; index++) {
      const data = (year - index) + ''
      yearList.push({ value: data, text: data + ' 년' })
    }
    this.yearList = yearList
  },
  methods: {
    async search () {
      try {
        await this.validForm(this.$refs.form)
        // 우대번호 tab 일시 validation
        if (this.tab === 3 && this.searchForm.ticketList.length === 0) {
          this.$dialog.alert('우대번호를 선택 해 주세요.')
          return
        }
        await this.$store.dispatch('social/statistics/setCondition', this.searchForm)
        this.$emit('search')
      } catch (e) {}
    },
    /**
     * 우대번호 조회/선택 dialog open
     * @param form searchForm
     */
    addTicketDialog (form) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Statistics/TicketSearchDialog',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              // 중복 제거후 추가해 준다.
              this.searchForm.ticketList = this.searchForm.ticketList.concat(params.data.filter(data => {
                return this.searchForm.ticketList.filter(row => row.ticketNo === data.ticketNo).length === 0
              }))
            }
          }
        }
      })
    },
    removeTicket (ticket) {
      this.searchForm.ticketList.splice(this.searchForm.ticketList.findIndex(data => data.ticketNo === ticket.ticketNo), 1)
    },
    addData () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Statistics/AddStatistics',
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 800
        }
      })
    }
  }
}
</script>
