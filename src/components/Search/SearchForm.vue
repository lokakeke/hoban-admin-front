<template>
  <div>
    <v-form @submit.prevent="{emit, exportExcel}" lazy-validation ref="form" autocomplete="off">
      <v-row @keypress.enter="emit(false)" :dense="dense">
        <v-col
          :class="[param.cols !== undefined? 'col-'+param.cols: 'col-xl-2 col-md-3 col-sm-4 col-6', dense? 'px-2': '']"
          v-for="param of list"
          :key="param.key"
        >
          <template v-if="param.type === 'text'">
            <v-text-field
              :id="'form_' + param.key"
              v-model="param.value"
              append-icon="search"
              clearable
              :disabled="param.disabled"
              :label="param.label"
              :maxlength="param.maxlength"
              hide-details
              :rules="param.required? emptyRules: undefined"
            ></v-text-field>
          </template>
          <template v-else-if="param.type === 'select'">
            <v-autocomplete
              v-model="param.value"
              clearable
              hide-details
              :items="param.list"
              :disabled="param.disabled"
              :item-value="param.listValue"
              :item-text="param.listText"
              :label="param.label"
              no-data-text="데이터가 없습니다."
              @change="param.event !== undefined? param.event(param.value): undefined"
              :rules="param.required? emptyRules: undefined"
            ></v-autocomplete>
          </template>
          <template v-else-if="param.type === 'code'">
            <v-autocomplete
              v-model="param.value"
              clearable
              hide-details
              :items="param.list"
              :disabled="param.disabled"
              :item-value="'commCode'"
              :item-text="'commCodeName'"
              :label="param.label"
              no-data-text="데이터가 없습니다."
              @change="param.event !== undefined? param.event(param.value): undefined"
              :rules="param.required? emptyRules: undefined"
            ></v-autocomplete>
          </template>
          <template v-else-if="param.type === 'dgnsCode'">
            <v-autocomplete
              v-model="param.value"
              clearable
              hide-details
              :items="param.list"
              :disabled="param.disabled"
              :item-value="'commCode'"
              :item-text="'commCodeName'"
              :label="param.label"
              no-data-text="데이터가 없습니다."
              @change="param.event !== undefined? param.event(param.value): undefined"
              :rules="param.required? emptyRules: undefined"
            ></v-autocomplete>
          </template>
          <template v-else-if="param.type === 'date'">
            <date-picker
              v-model="param.value"
              :min="param.minDate"
              :max="param.maxDate"
              :label="param.label"
              :type="param.calendarType"
              :view-format="param.viewFormat"
              :required="param.required"
              :disabled="param.disabled"
              clearable
              hide-details
            ></date-picker>
          </template>
          <template v-else-if="param.type === 'dateRange'">
            <date-range-picker
              v-model="param.value"
              :min="param.minDate"
              :max="param.maxDate"
              :label="param.label"
              :required="param.required"
              :disabled="param.disabled"
              hide-details hide-placeholder
            ></date-range-picker>
          </template>
          <template v-else-if="param.type === 'boolean'">
            <v-checkbox
              v-model="param.value"
              :label="param.label"
              :true-value="param.trueValue"
              :false-value="param.falseValue"
              :disabled="param.disabled"
              hide-details
            ></v-checkbox>
          </template>
          <template v-else-if="param.type === 'staff'">
            <v-text-field
              v-model="param.value"
              clearable
              :label="param.label"
              hide-details
              readonly
              @click="openStaff(param)"
              class="add-text-input"
              @click:clear="param.text = ''"
              :rules="param.required? emptyRules: undefined"
              :disabled="param.disabled"
            >
              <template v-slot:append>
                <v-btn icon color="primary" @click="openStaff(param)" tabindex="-1" small>
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-text-field
                  :value="param.text"
                  hide-details
                  readonly
                  class="pt-0 mt-0"
                  @click="openStaff(param)"
                ></v-text-field>
              </template>
            </v-text-field>
          </template>
          <template v-else-if="param.type === 'region'">
            <v-text-field
              v-model="param.value"
              clearable
              :label="param.label"
              hide-details
              readonly
              @click="openRegion(param)"
              class="add-text-input"
              @click:clear="param.text = ''"
              :rules="param.required? emptyRules: undefined"
              :disabled="param.disabled"
            >
              <template v-slot:append>
                <v-btn icon color="primary" @click="openRegion(param)" tabindex="-1" small>
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-text-field
                  :value="param.text"
                  hide-details
                  readonly
                  class="pt-0 mt-0"
                  @click="openRegion(param)"
                ></v-text-field>
              </template>
            </v-text-field>
          </template>
          <template v-else-if="param.type === 'checkList'">
            <v-row no-gutters justify="space-between">
              <div class="v-input v-input--hide-details theme--light v-input--selection-controls v-input--checkbox pointer" @click="checkToggle(param)">
                <div class="v-input__slot">
                  <div class="v-input--selection-controls__input">
                    <v-icon>{{checkAllList(param)}}</v-icon>
                  </div>
                  <div class="v-label theme--light">전체 선택</div>
                </div>
              </div>
              <v-checkbox
                v-for="(check, index) of param.list"
                :key="index"
                v-model="param.value"
                :label="check[param.listText]"
                :value="check[param.listValue]"
                multiple
                hide-details
              ></v-checkbox>
            </v-row>
          </template>
          <template v-else-if="param.type === 'selectMulti'">
            <v-autocomplete
              v-model="param.value"
              clearable
              hide-details
              multiple
              :items="param.list"
              :item-value="param.listValue"
              :item-text="param.listText"
              :label="param.label"
              :rules="param.required? emptyRules: undefined"
              :disabled="param.disabled"
            >
              <template v-slot:prepend-item>
                <v-list-item @click="checkToggle(param)">
                  <v-list-item-action>
                    <v-icon>{{checkAllList(param)}}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>전체 선택</v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
          </template>
          <template v-else-if="param.type === 'partner'">
            <v-autocomplete
              v-model="param.value"
              clearable
              hide-details
              :items="partnerList"
              :item-value="'ptnrNo'"
              :item-text="'ptnrName'"
              :label="param.label"
              @change="param.event !== undefined? param.event(param.value): undefined"
              :rules="param.required? emptyRules: undefined"
              :disabled="param.disabled"
            ></v-autocomplete>
          </template>
          <template v-else-if="param.type === 'business'">
            <v-text-field
              v-model="param.value"
              clearable
              :label="param.label"
              hide-details
              readonly
              @click="openBusinessId(param)"
              class="add-text-input"
              @click:clear="param.text = ''"
              :rules="param.required? emptyRules: undefined"
              :disabled="param.disabled"
            >
              <template v-slot:append>
                <v-btn icon color="primary" @click="openBusinessId(param)" tabindex="-1" small>
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-text-field
                  :value="param.text"
                  hide-details
                  readonly
                  class="pt-0 mt-0"
                  @click="openBusinessId(param)"
                ></v-text-field>
              </template>
            </v-text-field>
          </template>
        </v-col>
      </v-row>
    </v-form>
    <v-row justify="space-between">
      <v-col cols="6" align-self="center" class="pr-0">
        <v-row no-gutters v-if="!disablePagination" align="end">
          <v-autocomplete
            v-model="recordsPerPage"
            :items="pageList"
            :item-value="'value'"
            :item-text="'text'"
            style="max-width: 120px"
            @change="emit(true)"
            label="페이지당 게시물"
            hide-details
          ></v-autocomplete>
          <div class="black--text ml-5">총 {{searchParam.total}} 건 {{searchParam.page}} / {{pages}} 페이지</div>
        </v-row>
      </v-col>
      <v-col cols="6" align-self="center" class="text-right pl-0">
        <slot name="buttons" :data="list" :emit="emit"></slot>
        <v-btn v-if="excel" outlined rounded color="green" @click="exportExcel">
          <v-icon left>dashboard</v-icon>엑셀 다운로드 (F2)
        </v-btn>
        <v-btn v-if="isExist" outlined rounded color="green" @click="emit(true)">
          <v-icon left>refresh</v-icon>초기화 (F4)
        </v-btn>
        <v-btn outlined rounded color="primary" @click="emit">
          <v-icon left>search</v-icon>검색 (F3)
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/**
   * @이름 : 공통모듈 - 검색폼
   * @작성자 : sh.jin
   * @작성일자 : 2019/09/02
   * @설명: 검색조건을 지정한 Array 정보를 넘겨받아 검색폼을 생성하며, 검색 클릭 시 json 형태로 검색값을 return 해준다.
   * @return: 검색결과 json
   * @param search-param: 검색결과 json 결과값이 search-param 의 q 에 담긴다. * .sync 필요
   * @param init-search: 폼 구성 후 초기 검색을 실행하지 여부. 선언이 되있다면, 초기 검색을 실행한다. default: false
   * @param disable-pagination: 리스트가 pagination 을 필요로 하지 않는지 여부. default: false
   * @param dense: 검색폼 간격을 좁게 만들지 여부. default: false
   * @param excel: 폼 버튼영역에 엑셀 다운로드 버튼을 노출할지 여부
   * @param cols: 검색 필드 간격을 직접 지정할 경우 숫자로 넣어준다.
   * @param search-list: 검색폼을 구성할 정보가 담겨있는 Array 리스트 이다.
   *  {
   *     key: 검색결과가 담길 key 값. - 정보 없을 시 생성안함
   *
   *     defaultValue: 초기 생성시 검색값을 맵핑 시킬 값. default: undefined
   *
   *     label: 컴포넌트 label 에 맵핑될 텍스트값. default: ''
   *
   *     required: 필수 입력항목인지 체크한다. default: false
   *
   *     disabled: disabled 처리한다. default: false
   *
   *     type: 검색 폼에 구성될 타입. - 맵핑되는 정보 없을 시 생성안함
   *
   *          1.text: input type text 컴포넌트를 생성한다.
 *                * event: keypress.enter 이벤트 시 실행될 함수를 맵핑시킨다.(textfield 값을 인자로 넘겨준다.) default: undefined
   *
   *          2.select: select box 컴포넌트를 생성한다.
   *              * list: type 이 select 일 경우 select box 를 구성할 Array list 이다. default: []
   *              * listValue: select 박스의 value field 이름을 맵핑시킨다. default: 'value'
   *              * listText: select 박스의 text field 이름을 맵핑시킨다. default: 'text'
   *              * event: select 박스의 change 이벤트 시 실행될 함수를 맵핑시킨다.(선택값을 인자로 넘겨준다.) default: undefined
   *
   *          3.date: date picker 컴포넌트를 생성한다.
   *              * format: type 이 date/ dateRange 일 경우 날짜 리턴타입의 format 을 지정한다. 날짜타입으로 리턴을 받으려면 기재하지 않아야 한다. default: undefined
   *              * minDate: type 이 date/ dateRange 일 경우 min-date(date 타입) 정보를 지정한다. default: undefined
   *              * maxDate: type 이 date/ dateRange 일 경우 max-date(date 타입) 정보를 지정한다. default: undefined
   *
   *          4.dateRange: date range picker 컴포넌트를 생성한다.
   *              * format: type 이 date/ dateRange 일 경우 날짜 리턴타입의 format 을 지정한다. 날짜타입으로 리턴을 받으려면 기재하지 않아야 한다. default: undefined
   *              * minDate: type 이 date/ dateRange 일 경우 min-date(date 타입) 정보를 지정한다. default: undefined
   *              * maxDate: type 이 date/ dateRange 일 경우 max-date(date 타입) 정보를 지정한다. default: undefined
   *              * startField: type 이 dateRange 일 경우 검색 시작날짜 값 이름을 맵핑시킨다. default: key + 'Start'
   *              * endField: type 이 dateRange 일 경우 검색 종료날짜 값 이름을 맵핑시킨다. default: key + 'End'
   *
   *          5.boolean: check box 컴포넌트를 생성한다.
   *              * trueValue: type 이 boolean 일 경우 true 경우의 값. default: true
   *              * falseValue: type 이 boolean 일 경우 false 경우의 값. default: false
   *              * includeFalse: type 이 boolean 일 경우 false 값을 검색결과에 포함시킬 지 여부. default: false
   *
   *          6.code: comm code 데이터를 조회하여 select box 컴포넌트를 생성한다.
   *              * commCode: type 이 code 일 경우 검색 될 parentCommCode 값. default: 없음
   *              * event: select 박스의 change 이벤트 시 실행될 함수를 맵핑시킨다.(선택값을 인자로 넘겨준다.) default: undefined
   *
   *          7.dgnsCode: DGNS comm code 데이터를 조회하여 select box 컴포넌트를 생성한다.
   *              * commCode: type 이 code 일 경우 검색 될 commTypeCode 값. default: 없음
   *              * event: select 박스의 change 이벤트 시 실행될 함수를 맵핑시킨다.(선택값을 인자로 넘겨준다.) default: undefined
   *
   *          8.staff: 대명 사원 검색폼을 생성한다.
   *
   *          9.region: 지역 코드 검색폼을 생성한다.
   *
   *          10.checkList: checkList 선택.
   *              * list: type 이 select 일 경우 select box 를 구성할 Array list 이다. default: []
   *              * listValue: select 박스의 value field 이름을 맵핑시킨다. default: 'value'
   *              * listText: select 박스의 text field 이름을 맵핑시킨다. default: 'text'
   *              * commCode: 존재 하면 common code 에서 리스트 를 조회한다.. default: undefined
   *
   *          11.selectMulti: select Multi 선택.
   *              * list: type 이 checkList 일 경우 select box 를 구성할 Array list 이다. default: []
   *              * listValue: select 박스의 value field 이름을 맵핑시킨다. default: 'value'
   *              * listText: select 박스의 text field 이름을 맵핑시킨다. default: 'text'
   *              * commCode: 존재 하면 common code 에서 리스트 를 조회한다.. default: undefined
   *
   *          12.partner: 파트너 리스트를 생성한다.
   *              * event: select 박스의 change 이벤트 시 실행될 함수를 맵핑시킨다.(선택값을 인자로 넘겨준다.) default: undefined
   *
   *          13.business: businessId & 파트너명 검색폼을 생성한다.
   *  }
   *
   * @event search: 검색 버튼을 눌렀을 때 실행 될 함수를 연결한다.(검색 폼 에 focus 가 된 상태에서 enter 이벤트 또한 작동한다.)
   * @event export: 엑셀 다운로드 버튼을 눌렀을때 실행 될 함수를 연결한다.
   * @event refresh: 필수 항목을 제외한 모든 항목이 초기화하여 검색된다.
   **/

import commonCodeService from '@/api/modules/system/commonCode.service'
import partnerAccountService from '@/api/modules/system/authentication/partner/partnerAccount.service'

export default {
  props: {
    searchParam: Object,
    searchList: Array,
    initSearch: Boolean,
    excel: Boolean,
    isExist: {
      type: Boolean,
      default: true
    },
    cols: Number,
    disablePagination: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  name: 'searchForm',
  data () {
    return {
      list: [],
      partnerList: undefined,
      col: undefined,
      pageList: [
        { text: '10 개', value: 10 },
        { text: '20 개', value: 20 },
        { text: '50 개', value: 50 },
        { text: '100 개', value: 100 },
        { text: '500 개', value: 500 },
        { text: '1000 개', value: 1000 },
        { text: '5000 개', value: 5000 },
        { text: '10000 개', value: 10000 },
        { text: '50000 개', value: 50000 },
        { text: '100000 개', value: 100000 }
      ],
      recordsPerPage: 0
    }
  },
  computed: {
    pages () {
      if (
        this.searchParam.size == null ||
          this.searchParam.total == null ||
          this.searchParam.total === 0
      ) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
    }
  },
  watch: {
    searchList (newVal, oldVal) {
      for (let index = 0; index < newVal.length; index++) {
        if (['select', 'selectMulti', 'checkList'].indexOf(newVal[index].type) >= 0 && oldVal[index]) {
          if (newVal[index].list !== oldVal[index].list) {
            const row = newVal[index]
            const item = this.list.find(data => data.key === row.key)
            if (item) {
              item.list = row.list
              item.value = row.defaultValue || undefined
            }
          }
        }
      }
    }
  },
  mounted () {
    // 페이지당 갯수 설정
    this.recordsPerPage = this.searchParam.size ? this.searchParam.size : 10
    if (this.cols !== undefined && this.cols > 0 && this.cols <= 12) {
      // 전체 cols 를 지정하였을 경우
      this.col = Math.floor(12 / this.cols)
    }
    this.makeForm(this.searchList)
    if (this.initSearch) {
      this.$nextTick().then(() => {
        this.emit(false)
      })
    }
    // key press event match
    const eventList = [
      {
        target: 'F3',
        action: this.emit
      },
      {
        target: 'F4',
        action: this.emit,
        param: true
      }
    ]
    if (this.excel) {
      eventList.push({
        target: 'F2',
        action: this.exportExcel
      })
    }
    this.$store.dispatch('keypress/addKeyEventList', { eventList })
  },
  methods: {
    checkAllList (param) {
      if (!param.list || !param.value || param.value.length === 0) {
        return 'check_box_outline_blank'
      } else if (param.list.length === param.value.length) {
        return 'check_box'
      } else if (param.value.length > 0) {
        return 'indeterminate_check_box'
      }
    },
    checkToggle (param) {
      // 초기화
      if (!param.list || param.list.length === 0) {
        return
      } else if (!param.value) {
        param.value = []
      }
      if (param.list.length === param.value.length) {
        param.value = []
      } else {
        param.value = param.list.map(data => {
          return data[param.listValue]
        })
      }
    },
    searchCommCode (data, parentCommCode) {
      commonCodeService.selectCommonCode(parentCommCode).then(res => {
        data.list = res.data
      })
    },
    searchDgnsCommCode (data, commTypeCode) {
      commonCodeService.selectDGNSCommonCodeList(commTypeCode).then(res => {
        data.list = res.data
      })
    },
    makeForm (info) {
      const rtnArray = []
      // 기본틀을 만든다.
      for (const param of info) {
        if (param.key && param.type) {
          const type = param.type
          const data = {
            key: param.key,
            value: param.defaultValue ? param.defaultValue : undefined,
            defaultValue: param.defaultValue ? param.defaultValue : undefined,
            type: type,
            label: param.label ? param.label : '',
            maxlength: param.maxlength ? param.maxlength : '',
            required: param.required !== undefined && param.required === true,
            disabled: param.disabled !== undefined && param.disabled === true
          }
          // col 사이즈 직접 지정하였을 경우 먼저 적용
          if (param.cols) {
            data.cols = param.cols
          } else if (this.col !== undefined) {
            // 전체 col 사이즈 적용하였을 경우 적용
            data.cols = this.cols
          }
          if (type === 'text') {
            // 변경 이벤트 맵핑
            if (param.event !== undefined) {
              data.event = param.event
            }
            rtnArray.push(data)
          } else if (type === 'staff' || type === 'region') {
            data.refIndex = rtnArray.filter(data => data.type === type).length
            rtnArray.push(data)
          } else if (type === 'business') {
            rtnArray.push(data)
          } else if (type === 'select') {
            // 변경 이벤트 맵핑
            if (param.event !== undefined) {
              data.event = param.event
            }
            // 셀럭트 리스트의 value 필드 - default : value
            data.listValue = param.listValue ? param.listValue : 'value'
            // 셀럭트 리스트의 text 필드 - default : text
            data.listText = param.listText ? param.listText : 'text'
            // 셀렉트 타입 의 셀렉트 리스트
            if (param.list && param.list.length > 0) {
              data.list = param.list
            } else {
              data.list = []
            }
            rtnArray.push(data)
          } else if (type === 'date' || type === 'dateRange') {
            // minDate , maxDate 를 셋팅한다.
            data.minDate = param.minDate ? param.minDate : undefined
            data.maxDate = param.maxDate ? param.maxDate : undefined
            // format
            data.format = param.format ? param.format : undefined
            // dateRange 일 경우 startField 와 endField 셋팅 - 없을경우 key + 'Start', key + 'End' 로 셋팅
            if (type === 'dateRange') {
              data.startField = param.startField
                ? param.startField
                : param.key + 'Start'
              data.endField = param.endField
                ? param.endField
                : param.key + 'End'
            }
            data.calendarType = param.calendarType
            data.viewFormat = param.viewFormat
            rtnArray.push(data)
          } else if (type === 'boolean') {
            // true value, false value check
            data.trueValue = param.trueValue ? param.trueValue : true
            data.falseValue = param.falseValue ? param.falseValue : false
            // false value 를 검색값에 포함시킬지 여부
            data.includeFalse = param.includeFalse === true
            if (data.includeFalse) {
              data.value = data.falseValue
            }
            rtnArray.push(data)
          } else if (type === 'code') {
            // 변경 이벤트 맵핑
            if (param.event !== undefined) {
              data.event = param.event
            }
            // parent comm cd 가 있을 경우만 진행한다.
            if (param.commCode) {
              // code select box 를 만든다.
              data.list = []
              this.searchCommCode(data, param.commCode)
              rtnArray.push(data)
            }
          } else if (type === 'dgnsCode') {
            // 변경 이벤트 맵핑
            if (param.event !== undefined) {
              data.event = param.event
            }
            // parent comm cd 가 있을 경우만 진행한다.
            if (param.commCode) {
              // code select box 를 만든다.
              data.list = []
              this.searchDgnsCommCode(data, param.commCode)
              rtnArray.push(data)
            }
          } else if (type === 'selectMulti' || type === 'checkList') {
            // 공통 코드 조회인자 아닌지 판단한다.
            let listValue = ''
            let listText = ''
            data.list = []
            if (param.commCode) {
              listValue = 'commCode'
              listText = 'commCodeName'
              // 코드 조회
              this.searchCommCode(data, param.commCode)
            } else {
              listValue = param.listValue ? param.listValue : 'value'
              listText = param.listText ? param.listText : 'text'
              // 셀렉트 타입 의 셀렉트 리스트
              if (param.list && param.list.length > 0) {
                data.list = param.list
              }
            }
            data.listValue = listValue
            data.listText = listText
            rtnArray.push(data)
          } else if (type === 'partner') {
            // 변경 이벤트 맵핑
            if (param.event !== undefined) {
              data.event = param.event
            }
            // 파트너 리스트를 조회한다.
            if (!this.partnerList) {
              partnerAccountService.selectPartnerFullList().then(res => {
                this.partnerList = res.data
              })
            }
            rtnArray.push(data)
          }
        }
      }
      this.list = rtnArray
    },
    emit (isRefresh) {
      // form validation
      this.validForm(this.$refs.form).then(() => {
        const q = {}
        for (const data of this.list) {
          // 초기화일 경우 처리
          if (isRefresh === true) {
            // 초기값이 있다면 초기값으로 계산
            if (data.defaultValue) {
              data.value = data.defaultValue
            } else if (!data.required) {
              // 필수가 아닐경우만 초기화
              data.value = undefined
            }
          }
          // 값이 있을경우 넘겨준다.
          if (data.value !== undefined && data.value !== null && data.value !== '') {
            // 검색기간 value 셋팅 - startFile / endField
            if (data.type === 'dateRange') {
              if (data.format !== undefined) {
                q[data.startField] = data.value[0] ? moment(data.value[0]).format(data.format) : null
                q[data.endField] = data.value[1] ? moment(data.value[1]).format(data.format) : null
              } else {
                q[data.startField] = data.value[0] ? moment(data.value[0]).toDate() : null
                q[data.endField] = data.value[1] ? moment(data.value[1]).toDate() : null
              }
            } else if (data.type === 'date' && data.format !== undefined) {
              // 검색날짜 - 포맷이 있다면 string format 으로 셋팅
              q[data.key] = moment(data.value).format(data.format)
            } else if (data.type === 'boolean') {
              // boolean 형 데이터 는 false 벨류를 포함 시킬지 여부를 판단한다.
              if (data.includeFalse) {
                q[data.key] = data.value
              } else if (data.value === data.trueValue) {
                // false 벨류를 포함시키지 않으면 true 일경우만 포함시킨다.
                q[data.key] = data.value
              }
            } else {
              q[data.key] = data.value
            }
          }
        }
        const searchForm = _.cloneDeep(this.searchParam)
        searchForm.page = 1
        searchForm.size = this.recordsPerPage
        searchForm.q = q
        this.$emit('update:searchParam', searchForm)
        this.$emit('search')
      }).catch(() => {})
    },
    exportExcel () {
      this.$emit('export')
    },
    openRegion (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/RegionSearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: param => {
            if (param && param.data) {
              item.value = param.data.regionCode
              item.text = param.data.regionName
            }
          }
        }
      })
    },
    openStaff (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/StaffSearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: param => {
            if (param && param.data) {
              item.value = param.data.adminSeq
              item.text = param.data.adminName
            }
          }
        }
      })
    },
    openBusinessId (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/History/BusinessIdPopup',
        params: {
          item: ''
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              item.value = params.data.businessId
              item.text = params.data.ptnrName
            }
          }
        }
      })
    }
  }
}
</script>
