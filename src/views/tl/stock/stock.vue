<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container fluid pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <vue-tour :steps="steps"/>
        <v-row>
          <v-col cols="8" class="text-left">
            <branch-list :brcNo.sync="param.brcNo" :branchList.sync="branchList" :branchName.sync="param.branchName"
                         @change="branchChange()" class="stock-step-0 mb-2"></branch-list>
            <v-menu v-model="menu" bottom offset-y :close-on-content-click="false" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" outlined rounded :color="param.tlRmTypeCodeList && param.tlRmTypeCodeList.length > 0 ? 'green' : 'grey'" class="stock-step-1 mb-2">
                  {{ roomTypeArray | textTruncate(60, '..') }}
                  <v-icon>{{ menu ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="green" dark dense>
                  <v-toolbar-title>TL-LINCOLN 객실타입 선택</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="menu = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text class="pa-0">
                  <select-list :selected.sync="param.tlRmTypeCodeList" :array="roomTypeList" :itemValue="'tlRmTypeCode'"
                               :itemText="'tlRmTypeName'"></select-list>
                </v-card-text>
                <v-divider class="ma-0"></v-divider>
                <v-card-actions>
                  <v-label icon>
                    <v-icon>error_outlined</v-icon>
                    중복선택이 가능합니다.
                  </v-label>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col align-self="center" class="text-right">
            <v-btn outlined rounded @click="showManual()" color="green" class="mb-2">
              <v-icon>search</v-icon>
              메뉴얼
            </v-btn>
            <v-btn outlined rounded @click="search()" color="primary" class="stock-step-3 mb-2">
              <v-icon>search</v-icon>
              검색
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="4" align-self="center">
            <v-radio-group v-model="param.periodType" row @change="periodChange()" hide-details class="mt-0">
              <v-radio label="2주일" value="2w" class="stock-step-2"></v-radio>
              <v-radio label="기간선택" value="p"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="4" align-self="center">
            <date-picker v-if="param.periodType === 'p'" :shortcuts="false" :value-type="'format'" :not-before="new Date()"
                         append-to-body v-model="param.selectDate" :lang="lang" range @change="checkDate()">
            </date-picker>
            <v-item-group v-else>
              <v-item>
                <v-btn icon dark @click="weekChange(true)">
                  <v-icon left color="black">
                    keyboard_arrow_left
                  </v-icon>
                </v-btn>
              </v-item>
              <v-item>
                <date-picker @change="weekChange()" append-to-body :clearable="false" format="YYYY 년 MM 월 DD 일"
                             v-model="param.selectDate" :lang="lang" :not-before="new Date()"></date-picker>
              </v-item>
              <v-item>
                <v-btn icon dark @click="weekChange(false)">
                  <v-icon right color="black">
                    keyboard_arrow_right
                  </v-icon>
                </v-btn>
              </v-item>
            </v-item-group>
          </v-col>
          <v-col cols="4" align-self="center" class="text-right">
            <v-menu v-if="loading" v-model="menuPeriod" bottom offset-y left :close-on-content-click="false"
                    transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" outlined rounded :color="'green'" class="stock-step-4">
                  기본입력값 셋팅
                  <v-icon>{{ menuPeriod ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="green" dark dense>
                  <v-toolbar-title>기본 셋팅값 선택</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="menuPeriod = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-layout justify-end>
                  <v-btn @click="settingBasic()" rounded small color="green" class="white--text mt-2 mr-2">
                    <v-icon>check</v-icon>
                    적용
                  </v-btn>
                </v-layout>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item>
                    <v-list-item-action style="width: 90px">
                      <v-checkbox v-model="basic.all" label="전체요일" suffix="%" color="green"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="pl-3 pr-3">
                      <v-layout justify-space-between>
                        <v-flex xs4>
                          <v-text-field class="mt-0" type="number" v-model="basic.rate" suffix="%" hide-details label="설정비율" :disabled="!basic.all"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                          <v-switch :label="basic.use? '판매' : '중지'" v-model="basic.use" color="primary" class="justify-center"
                                    :disabled="!basic.all" hide-details></v-switch>
                        </v-flex>
                        <v-flex xs4>
                          <v-switch :label="basic.rsvAuto? '예약 자동' : '예약 수동'" v-model="basic.rsvAuto" color="orange" class="justify-center"
                                    hide-details :disabled="!basic.all"></v-switch>
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-for="day of basic.days" :key="day.key">
                    <v-list-item-action style="width: 90px">
                      <v-checkbox v-model="day.value" :label="day.text" color="green" class="justify-start"
                                  :disabled="day.disabled"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="pl-3 pr-3">
                      <v-layout justify-space-between>
                        <v-flex xs4>
                          <v-text-field type="number" v-model="day.rate" suffix="%" label="설정비율" hide-details class="mt-0"
                                        :disabled="basic.all"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                          <v-switch :label="day.use? '판매' : '중지'" v-model="day.use" color="primary" class="justify-center"
                                    hide-details :disabled="basic.all"></v-switch>
                        </v-flex>
                        <v-flex xs4>
                          <v-switch :label="day.rsvAuto? '예약 자동' : '예약 수동'" v-model="day.rsvAuto" color="orange" class="justify-center"
                                    hide-details :disabled="basic.all"></v-switch>
                        </v-flex>
                      </v-layout>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-label icon>
                    <v-icon>error_outlined</v-icon>
                    요일별 셋팅을 원하시면 체크후 입력하여 주세요.
                    <!--                                            <br/>
                                                                <v-icon>error_outlined</v-icon>
                                                                룸타입별 마스터블럭을 기준으로 셋팅됩니다.-->
                  </v-label>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <template v-if="!body || body.length === 0">
          <v-layout row wrap>
            <v-flex xs12>
              <h2 class="mt-4 text-center font-weight-regular">조건을 선택해 주세요.</h2>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <v-layout justify-space-between>
            <v-btn v-if="loading" outlined small rounded @click="closeAll()" color="primary">
              전체 {{ menuClose ? '접기' : '펼치기' }}
              <v-icon>{{ menuClose ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
            </v-btn>
            <v-btn v-if="loading" outlined small rounded @click="insertAll()" color="info" class="stock-step-16">
              <v-icon>check</v-icon>
              전체저장
            </v-btn>
          </v-layout>
          <v-divider></v-divider>
        </template>
        <template v-for="(room, bodyIndex) in body">
          <v-layout :key="bodyIndex" justify-space-between class="mb-1" :class="bodyIndex !== 0 ? 'mt-3' : ''">
            <h5 class="font-weight-bold mb-0">
              <v-icon color="orange darken-2" class="mb-1" :class="bodyIndex === 0 ? 'stock-step-6': ''">
                play_circle_filled
              </v-icon>
              {{ room.tlRmTypeName }}
              <v-btn icon dark @click="room.isView = !room.isView">
                <v-icon color="black">
                  {{ !room.isView ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
                </v-icon>
              </v-btn>
              AGENT 현황
              <v-btn icon dark @click="room.showAgt = !room.showAgt">
                <v-icon color="black">
                  {{ !room.showAgt ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
                </v-icon>
              </v-btn>
            </h5>
            <v-btn small outlined rounded color="info" @click="validation(bodyIndex)">
              <v-icon>done</v-icon>
              저장
            </v-btn>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 class="pt-0" v-if="room.isView">
              <v-form ref="form" lazy-validation>
                <v-data-table
                  :headers="headers"
                  :items="room.data"
                  class="condensed bordered"
                  disable-pagination
                  disable-sort
                  hide-default-header
                  hide-default-footer>
                  <template v-slot:header="props">
                    <thead>
                      <tr>
                        <th v-for="header in props.props.headers "
                            :colspan="header.key === 'title'? 2: 1"
                            :key="header.value"
                            :class="[header.day === 6 ? 'blue--text' : header.day === 7 ? 'red--text' : '', 'text-center']">
                          <span v-html="header.text"></span>
                        </th>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:item="props">
                    <template v-if="props.item.key === 'pmsStock'">
                      <tr v-for="(block, index) in props.item.blockList">
                        <th v-if="index === 0" colspan="2" :rowspan="props.item.blockList.length" class="text-center" v-html="props.item.label"></th>
                        <!--                                                <th class="text-center">{{block.blockCode}} 블록</th>-->
                        <td v-for="(col, colIndex) in block.cols" :key="colIndex" class="text-right" :class="[col.syncYn === 'N'? 'no_sync': '', bodyIndex === 0 ? 'stock-step-7': '']">
                          {{ col.value }} 건
                        </td>
                      </tr>
                    </template>
                    <template v-else-if="props.item.key !== 'rsvBlockCode' && props.item.key !== 'stockDetailList'">
                      <tr>
                        <th colspan="2" class="text-center" v-html="props.item.label"></th>
                        <td v-for="(col, colIndex) in props.item.cols" :key="colIndex" class="text-right" :class="col.syncYn === 'N'? 'no_sync': ''">
                          <template v-if="props.item.key === 'ratio'">
                            <v-text-field type="number" :rules="rateRules" v-model="col.value" suffix="%" :disabled="col.disabled"
                                          @change="rateChange(room.data, col)" hide-details :class="bodyIndex === 0 ? 'stock-step-9' : ''"></v-text-field>
                          </template>
                          <template v-else-if="props.item.key === 'expectStock'">
                            <v-text-field type="number" :rules="allotmentRules" v-model="col.value" reverse prefix="건" @change="allotmentChange(room.data, col)"
                                          :disabled="col.disabled" hide-details :class="bodyIndex === 0 ? 'stock-step-11' : ''"></v-text-field>
                          </template>
                          <template v-else-if="props.item.key === 'autoYn'">
                            <v-switch :label="col.value === 'Y'? '자동' : '수동'" v-model="col.value" :true-value="'Y'" :false-value="'N'"
                                      color="orange" hide-details @change="manualChange(room.data, col)" :class="bodyIndex === 0 ? 'stock-step-10' : ''"></v-switch>
                          </template>
                          <template v-else-if="props.item.key === 'sellYn'">
                            <v-switch :label="col.value === 'Y'? '판매' : '중지'" v-model="col.value" :true-value="'Y'" :false-value="'N'"
                                      color="blue" hide-details :class="bodyIndex === 0 ? 'stock-step-12' : ''"></v-switch>
                          </template>
                          <template v-else-if="props.item.key === 'rsvAutoYn'">
                            <v-switch :label="col.value === 'Y'? '자동' : '수동'" v-model="col.value" :true-value="'Y'" :false-value="'N'"
                                      color="green" hide-details :class="bodyIndex === 0 ? 'stock-step-13' : ''"></v-switch>
                          </template>
                          <template v-else-if="props.item.key === 'rsvBlockCode'">
                            <template v-show="false">
                              <v-autocomplete :class="bodyIndex === 0 ? 'stock-step-8' : ''"
                                              v-model="col.value" :items="room.blockList" single-line hide-details color="primary"
                                              :item-text="'blockCode'"
                                              :item-value="'blockCode'"
                                              @change="blockChange(room.data, col)" :rules="emptyRules"
                              ></v-autocomplete>
                            </template>
                          </template>
                          <template v-else-if="props.item.key === 'stock'">
                            <span :class="bodyIndex === 0 ? 'stock-step-14' : ''">{{ col.value + (col.syncYn === 'Y' ? ' 개' : '') }}</span>
                          </template>
                          <template v-else>
                            <span :class="bodyIndex === 0 ? 'stock-step-15' : ''">{{ col.value }} 건</span>
                          </template>
                        </td>
                      </tr>
                    </template>
                    <template v-else-if="room.showAgt && props.item.key === 'stockDetailList'">
                      <tr v-for="(agt, agtIndex) in props.item.netAgtRmTypeList" :key="agt.netAgtRmTypeCode + '' + agt.agtCode" class="blue lighten-5">
                        <th v-if="agtIndex === 0" :rowspan="props.item.netAgtRmTypeList.length" class="text-center">AGENT<br/>리스트
                        </th>
                        <th class="text-center">{{ agt.agtName || '-' }}<br/>({{ agt.agtCode }}) {{ props.item.block }}
                        </th>
                        <td v-for="(col, colIndex) in agt.cols" :key="agt.netAgtRmTypeCode + '' + agt.agtCode + '' + colIndex">
                          <v-autocomplete v-model="col.value" :items="agtSelect" hide-details></v-autocomplete>
                        </td>
                      </tr>
                    </template>
                  </template>
                </v-data-table>
              </v-form>
            </v-flex>
          </v-layout>
        </template>
      </app-card>
    </v-container>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
import 'moment/locale/ko'
import BranchList from '@/components/Branch/BranchList.vue'
import SelectList from '@/components/SelectAll/SelectList.vue'
import StockPreview from './stockPreview.vue'
import roomTypeService from '@/api/modules/tl/roomType.service'
import stockService from '@/api/modules/tl/stock.service'
import VueTour from '@/components/Common/VueTour.vue'

moment().locale('ko')
export default {
  name: 'stock',
  components: { BranchList, SelectList, StockPreview, DatePicker, VueTour },
  data () {
    return {
      steps: [],
      rateRules: [
        v => v && (v > -1 && v <= 100) || ''
      ],
      allotmentRules: [
        v => v > -1 || ''
      ],
      emptyRules: [
        v => !!v || '필수 입력항목입니다.'
      ],
      // 검색기간
      start: '',
      end: '',
      menuClose: true,
      // 기본값 셋팅 폼
      basic: {},
      // 검색조건
      param: {
        // 사업장
        branch: '',
        branchName: '',
        // 객실타입
        tlRmTypeCodeList: [],
        // 기간타입
        periodType: '2w',
        // 선택기간
        selectDate: '',
        pkgYn: 'N'
      },
      cloneParam: {},
      headers: [],
      dates: [],
      body: [],
      previewData: {},
      menuPeriod: false,
      menu: false,
      loading: false,
      previewDialog: false,
      // custom lang
      lang: {
        days: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        placeholder: {
          date: '날짜를 선택하세요.',
          dateRange: '기간을 선택하세요.'
        }
      },
      // 사업장 목록
      branchList: [],
      // TL-LINCOLN 객실 타입
      roomTypeList: [],
      agtSelect: [
        { value: '', text: '미적용' },
        { value: 'Y', text: '판매' },
        { value: 'N', text: '중지' }
      ],
      myCallbacks: {
        onNextStep: this.nextStepCallback
      }
    }
  },
  mounted () {
    this.param.selectDate = moment().toDate()
    this.setBasic()
  },
  computed: {
    roomTypeArray () {
      let text = ''
      let index = 1
      const length = this.param.tlRmTypeCodeList.length
      if (length === 0) {
        text = '객실 타입을 선택하세요.'
      } else {
        for (const type of this.param.tlRmTypeCodeList) {
          text += _.find(this.roomTypeList, { tlRmTypeCode: type }).tlRmTypeName
          if (index !== length) {
            text += ' , '
          }
          index++
        }
      }
      return text
    }
  },
  methods: {
    showManual () {
      if (this.loading) {
        this.steps = [
          {
            target: '.stock-step-0',
            content: '사업장을 선택 하세요.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-1',
            content: '룸타입을 선택 하세요.<br/>중복 선택이 가능합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-2',
            content: '기간을 선택하세요.<br/>기본 2주이며, 직접 지정도 가능합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-3',
            content: '검색버튼을 눌러 데이터를 조회 합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-4',
            content: '기본입력값을 셋팅합니다.<br/>요일별 % 셋팅만 가능합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-6',
            content: '룸타입별 데이터 정보입니다.열고 닫을 수 있습니다.<br/>AGENT 별 현황을 열고 닫을 수 있습니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-7',
            content: '룸타입에서 설정한 PMS의 현재 재고 상황 입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          /* {
              target: ".stock-step-8",
              content: "TL-Lincoln 에 재고를 전송할 PMS 블럭을 날짜별로 선택할 수 있습니다.",
              params: {
                  placement: "top",
                  enableScrolling: false
              }
          }, */
          {
            target: '.stock-step-9',
            content: '전송할 재고 수량의 비율을 설정할 수 있습니다.<br/>*재고 자동여부가 자동 일 경우만 해당됩니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-10',
            content: '전송할 재고를 자동으로 비율계산을 할 지 수동으로 지정한 값으로 보낼 지 지정합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-11',
            content: '전송할 재고의 예상수량을 표시합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-12',
            content: 'TL-Lincoln 에서 해당 룸타입객실을 판매 할지 여부를 지정합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-13',
            content: 'TL-Lincoln 에서 예약이 넘어올 경우 자동으로 PMS 에 예약을 넣어줄지 지정합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-14',
            content: '현재 TL-Lincoln 에 전송된 재고수량을 표시합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-15',
            content: 'TL-Lincoln 에서 넘어온 예약건수 정보를 표시합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-16',
            content: '셋팅한 재고를 전송합니다. 전체저장일 경우 선택 한 룸타입 전체를 보내며, 룸타입별로 저장할 수도 있습니다.',
            params: {
              placement: 'top',
              enableScrolling: true
            }
          }
        ]
      } else {
        this.steps = [
          {
            target: '.stock-step-0',
            content: '사업장을 선택 하세요.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-1',
            content: '룸타입을 선택 하세요.<br/>중복 선택이 가능합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-2',
            content: '기간을 선택하세요.<br/>기본 2주이며, 직접 지정도 가능합니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.stock-step-3',
            content: '검색버튼을 눌러 데이터를 조회 합니다.<br/>검색 후 메뉴얼을 다시 실행 해 주세요.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          }
        ]
      }
      this.$nextTick(() => { this.$tours.myTour.start() })
    },
    setBasic () {
      // 기본값 셋팅 폼
      this.basic = {
        all: false,
        rate: 0,
        use: true,
        rsvAuto: true,
        days: [
          { value: false, key: 0, text: '일요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 1, text: '월요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 2, text: '화요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 3, text: '수요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 4, text: '목요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 5, text: '금요일', rate: 0, rsvAuto: true, use: true, disabled: false },
          { value: false, key: 6, text: '토요일', rate: 0, rsvAuto: true, use: true, disabled: false }
        ]
      }
    },
    branchChange () {
      if (!this.param.brcNo) {
        this.$dialog.alert('사업장을 선택 후 진행하여 주세요.', '알림', {
          confirmButtonText: '확인',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
        return
      }
      // 초기화
      this.param.tlRmTypeCodeList = []
      this.roomTypeList = []
      this.body = []
      roomTypeService.selectRoomTypeSync(this.param.brcNo, this.param.pkgYn).then(res => {
        // 싱크가 맞으면 진행한다.
        if (!res.data) {
          this.$dialog.alert('해당 사업장(' + this.param.branchName + ')의<br/>객실타입마스터 싱크가 맞지 않습니다.')
        } else {
          roomTypeService.selectRoomTypeList({
            brcNo: this.param.brcNo,
            useYn: 'Y',
            pkgYn: this.param.pkgYn
          }).then(res => {
            this.roomTypeList = res.data
          })
        }
      })
    },
    closeAll () {
      this.menuClose = !this.menuClose
      for (const room of this.body) {
        room.isView = this.menuClose
      }
    },
    settingBasic () {
      // 값이 loading 되어 있는지 체크
      if (!this.loading) {
        this.$dialog.alert('데이터를 검색 후 진행 해 주세요.')
        return
      } else if (!this.basic.all && _.filter(this.basic.days, { value: true }).length === 0) {
        this.$dialog.alert('적용 할 데이터를 체크 후 진행해 주세요.')
        return
      }
      const dayArray = {}
      if (this.basic.all) {
        if (confirm('전체 요일: ' + this.basic.rate + ' %, 판매여부 : ' + (this.basic.use ? '판매' : '중지') + ', 예약자동여부: ' + (this.basic.rsvAuto ? '자동' : '수동') + '\n데이터로 적용 하시겠습니까?')) {
          for (let day = 0; day <= 6; day++) {
            dayArray[day] = { rate: this.basic.rate, use: this.basic.use, rsvAuto: this.basic.rsvAuto }
          }
        } else {
          return
        }
      } else {
        let text = ''
        for (const day of this.basic.days) {
          if (day.value) {
            text += day.text + ': ' + day.rate + ' %, 판매여부 : ' + (day.use ? '판매' : '중지') + ', 예약자동여부: ' + (day.rsvAuto ? '자동' : '수동') + '\n'
            dayArray[day.key] = { rate: day.rate, use: day.use, rsvAuto: day.rsvAuto }
          }
        }
        if (!confirm(text + '데이터로 적용 하시겠습니까?')) {
          return
        }
      }
      // 실제 데이터 적용
      for (let [key, value] of Object.entries(dayArray)) {
        key = parseInt(key)
        for (const room of this.body) {
          for (const data of room.data) {
            if (data.key && data.key === 'ratio' || data.key === 'sellYn' || data.key === 'autoYn' || data.key === 'expectStock' || data.key === 'rsvAutoYn' || data.key === 'rsvBlockCode') {
              // 요일 계산
              for (const col of data.cols) {
                const dateKey = moment(col.date, 'YYYYMMDD').day()
                if (dateKey === key && col.hasOwnProperty('value')) {
                  // rate , use 설정값으로 변경 && 자동입력 && 재고 다시 계산
                  if (data.key === 'ratio') {
                    col.value = value.rate
                    // 자동설정이므로 disabled false
                    col.disabled = false
                  } else if (data.key === 'sellYn') {
                    col.value = value.use ? 'Y' : 'N'
                  } else if (data.key === 'autoYn') {
                    col.value = 'Y'
                  } else if (data.key === 'expectStock') {
                    // 마스터 블럭을 구함
                    const masterBlock = _.find(_.find(this.roomTypeList, { tlRmTypeCode: room.tlRmTypeCode }).blockList, {
                      masterYn: 'Y',
                      useYn: 'Y'
                    }).blockCode
                    this.rateChange(room.data, col, masterBlock)
                    // 자동설정이므로 disabled true
                    col.disabled = true
                  } else if (data.key === 'rsvAutoYn') {
                    col.value = value.rsvAuto ? 'Y' : 'N'
                  } else if (data.key === 'rsvBlockCode') {
                    // 마스터 블럭을 구함
                    col.value = _.find(_.find(this.roomTypeList, { tlRmTypeCode: room.tlRmTypeCode }).blockList, {
                      masterYn: 'Y',
                      useYn: 'Y'
                    }).blockCode
                  }
                }
              }
            }
          }
        }
      }
      // 기본값으로 변경
      this.setBasic()
      this.menuPeriod = false
    },
    checkDate () {
      // 시작일 90일 초과 시 disable
      if (this.param.selectDate[0] && this.param.selectDate[1]) {
        if (moment(this.param.selectDate[1], 'YYYY-MM-DD').diff(this.param.selectDate[0], 'day') > 90) {
          this.$dialog.alert('선택기간은 90일을 초과할 수 없습니다.')
          this.param.selectDate = []
        }
      }
    },
    allotmentChange (item, col) {
      let block, pmsStock
      // 해당 row 의 재고 block 을 구한다.
      let row = _.find(item, { key: 'rsvBlockCode' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          block = data.value
        }
      }
      row = _.find(item, { key: 'pmsStock' })
      if (row && row.blockList) {
        row = _.find(row.blockList, { blockCode: block })
        if (row) {
          const data = _.find(row.cols, { date: col.date })
          if (data) {
            pmsStock = data.value
          }
        }
      }
      row = _.find(item, { key: 'expectStock' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          if (parseInt(pmsStock) < parseInt(data.value)) {
            this.$dialog.alert('PMS 재고보다 크게 설정할 수 없습니다.<br/>최대 재고량 (' + pmsStock + ') 으로 자동 설정됩니다.')
            data.value = pmsStock
          }
        }
      }
    },
    blockChange (item, col) {
      // 수동인지, 자동인지 판단한다.
      let autoYn
      const row = _.find(item, { key: 'autoYn' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          autoYn = data.value
        }
      }
      if (autoYn) {
        if (autoYn === 'Y') {
          this.rateChange(item, col)
        } else if (autoYn === 'N') {
          this.allotmentChange(item, col)
        }
      }
    },
    rateChange (item, col, blockInfo) {
      // % 를 계산한다.
      let block, pmsStock, ratio, row
      // 해당 row 의 재고 block 을 구한다.
      if (blockInfo === undefined) {
        row = _.find(item, { key: 'rsvBlockCode' })
        if (row) {
          const data = _.find(row.cols, { date: col.date })
          if (data) {
            block = data.value
          }
        }
      } else {
        block = blockInfo
      }
      row = _.find(item, { key: 'pmsStock' })
      if (row && row.blockList) {
        row = _.find(row.blockList, { blockCode: block })
        if (row) {
          const data = _.find(row.cols, { date: col.date })
          if (data) {
            pmsStock = data.value
          }
        }
      }
      row = _.find(item, { key: 'ratio' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          ratio = data.value
        }
      }
      row = _.find(item, { key: 'expectStock' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data && pmsStock && ratio) {
          let calcValue = Math.floor(pmsStock * (ratio / 100))
          if (calcValue < 0) {
            calcValue = 0
          }
          data.value = calcValue
        } else {
          data.value = 0
        }
      }
    },
    manualChange (item, col) {
      const auto = col.value === 'Y'
      // 재고입력 컨트롤
      let row = _.find(item, { key: 'expectStock' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          // 자동일시 직접입력 disable
          data.disabled = auto
        }
      }
      // 비율입력 컨트롤
      row = _.find(item, { key: 'ratio' })
      if (row) {
        const data = _.find(row.cols, { date: col.date })
        if (data) {
          // 자동일시 비율입력 해제
          data.disabled = !auto
        }
      }
    },
    periodChange () {
      if (this.param.periodType === 'p') {
        this.param.selectDate = []
      } else {
        this.param.selectDate = moment().toDate()
      }
    },
    weekChange (isPrev) {
      const addWeeks = this.param.periodType === '2w' ? 2 : 1
      if (isPrev === undefined) {
        this.param.selectDate = moment(this.param.selectDate)
      } else if (isPrev) {
        // 오늘 날짜 이전인지 확인한다.
        if (moment().format('YYYYMMDD') > moment(this.param.selectDate).add(-addWeeks, 'weeks').format('YYYYMMDD')) {
          this.$dialog.alert('과거의 데이터는 조회할 수 없습니다.')
        } else {
          this.param.selectDate = moment(this.param.selectDate).add(-addWeeks, 'weeks')
        }
      } else {
        this.param.selectDate = moment(this.param.selectDate).add(+addWeeks, 'weeks')
      }
    },
    async search () {
      if (!this.param.brcNo) {
        this.$dialog.alert('사업장을 선택해 주세요.')
        return
      } else if (!this.param.tlRmTypeCodeList || this.param.tlRmTypeCodeList.length === 0) {
        this.$dialog.alert('객실타입을 선택해 주세요.')
        return
      } else if (this.param.periodType === 'p' && !(this.param.selectDate[0] && this.param.selectDate[1])) {
        this.$dialog.alert('기간을 선택해 주세요.')
        return
      }
      this.loading = false
      let startDate, endDate
      if (this.param.periodType === '2w') {
        startDate = moment(this.param.selectDate)
        endDate = moment(this.param.selectDate).add(2, 'weeks')
      } else if (this.param.periodType === 'p') {
        startDate = moment(this.param.selectDate[0])
        endDate = moment(this.param.selectDate[1])
      }
      this.param.startDate = startDate
      this.param.endDate = endDate
      // 파라미터를 만든다.
      const nights = moment(endDate).diff(startDate, 'day')
      const params = {
        brcNo: this.param.brcNo,
        nights: nights,
        stndYmd: moment(startDate).format('YYYYMMDD'),
        tlRmTypeCodes: this.param.tlRmTypeCodeList,
        pkgYn: this.param.pkgYn
      }
      const storeInfo = []
      for (const roomTypeCd of this.param.tlRmTypeCodeList) {
        const roomType = _.find(this.roomTypeList, { tlRmTypeCode: roomTypeCd })
        if (roomType) {
          const storeCheck = _.find(storeInfo, { hotelCode: roomType.hotelCode })
          if (storeCheck) {
            storeCheck.rmTypeCds.push(roomType.rmTypeCd)
          } else {
            storeInfo.push({ hotelCode: roomType.hotelCode, rmTypeCds: [roomType.rmTypeCd] })
          }
        }
      }
      params.blockList = storeInfo
      // 조회한다.
      this.headers = []
      this.body = []
      this.dates = []
      await stockService.selectStockList(params).then(res => {
        // 테이블을 만든다.
        const headers = [{ text: '항목', sortable: false, key: 'title' }]
        for (let i = 0; startDate <= endDate; startDate = moment(startDate).add(1, 'days')) {
          const date = {
            text: startDate.format('MM/DD') + '<br/>(' + startDate.format('ddd') + ')',
            value: startDate.format('YYYYMMDD'),
            day: startDate.isoWeekday(),
            sortable: false
          }
          headers.push(date)
          this.dates.push(date)
        }
        this.cloneParam = _.cloneDeep(this.param)
        this.headers = headers
        for (const room of res.data) {
          room.isView = true
          room.showAgt = false
          room.blockList = _.find(this.roomTypeList, { tlRmTypeCode: room.tlRmTypeCode }).blockList
          // manual 체크
          const autoYn = _.find(room.data, { key: 'autoYn' })
          if (autoYn && autoYn.cols) {
            for (const col of autoYn.cols) {
              this.manualChange(room.data, col)
            }
          }
        }
        this.body = res.data
        this.loading = true
      })
    },
    preview () {
      let startDate, endDate
      if (this.cloneParam.periodType === '2w') {
        startDate = moment(this.cloneParam.selectDate)
        endDate = moment(this.cloneParam.selectDate).add(2, 'weeks')
      } else if (this.cloneParam.periodType === 'p') {
        startDate = moment(this.cloneParam.selectDate[0])
        endDate = moment(this.cloneParam.selectDate[1])
      }
      this.start = startDate.format('YYYY-MM-DD')
      this.end = endDate.format('YYYY-MM-DD')

      // 미리보기 데이터를 만든다,
      const previewData = {}
      for (let i = 0; startDate <= endDate; startDate = moment(startDate).add(1, 'days')) {
        const key = startDate.format('YYYYMMDD')
        const preViewKey = startDate.format('YYYY-MM-DD')
        // 객실타입별 데이터를 만든다.
        const list = []
        for (const tlRmTypeCode of this.cloneParam.tlRmTypeCodeList) {
          const data = _.find(this.roomTypeList, { tlRmTypeCode: tlRmTypeCode })
          if (data) {
            // 입력값을 찾는다.
            const body = _.find(this.body, { tlRmTypeCode: data.tlRmTypeCode })
            if (body && body.data) {
              const row = {
                text: data.tlRmTypeName,
                brcNo: this.param.brcNo,
                tlRmTypeCode: body.tlRmTypeCode,
                tlNetRmTypeGroupCode: body.tlNetRmTypeGroupCode,
                rmTypeCd: body.rmTypeCd,
                stndYmd: key
              }
              // 블럭
              row.rsvBlockCode = _.find(_.find(body.data, { key: 'rsvBlockCode' }).cols, { date: key }).value + ''
              // 수동여부
              row.autoYn = _.find(_.find(body.data, { key: 'autoYn' }).cols, { date: key }).value + ''
              // 갯수
              row.expectStock = _.find(_.find(body.data, { key: 'expectStock' }).cols, { date: key }).value + ''
              // 사용여부
              row.sellYn = _.find(_.find(body.data, { key: 'sellYn' }).cols, { date: key }).value + ''
              // 입력비율
              row.ratio = _.find(_.find(body.data, { key: 'ratio' }).cols, { date: key }).value + ''
              // 예약 자동여부
              row.rsvAutoYn = _.find(_.find(body.data, { key: 'rsvAutoYn' }).cols, { date: key }).value + ''
              // 수동입력 컨트롤
              row.focus = false
              // 객실타입 블럭리스트
              row.blockList = body.blockList

              // PMS 잔여객실 수 - block 만큼 돌면서 리스트를 만든다.
              const pmsStock = []
              const blockList = _.find(body.data, { key: 'pmsStock' })
              if (blockList && blockList.blockList) {
                for (const block of blockList.blockList) {
                  pmsStock.push({ rsvBlockCode: block.blockCode, cnt: _.find(block.cols, { date: key }).value + '' })
                }
              }
              row.pmsStock = pmsStock
              list.push(row)
            }
          }
        }
        if (list.length > 0) {
          previewData[preViewKey] = list
        }
      }
      this.previewData = previewData
      this.previewDialog = true
    },
    async validation (index) {
      await this.validForm(this.$refs.form[index])

      await this.$dialog.confirm(this.body[index].tlRmTypeName + ' 객실의 재고를 수정하시겠습니까?').then(() => {
        this.makeInsertList(this.body[index].tlRmTypeCode)
      }, () => {
      })
    },
    async insertAll () {
      let pass = true
      _.range(0, this.body.length).forEach((index) => {
        this.validForm(this.$refs.form[index])
        pass = false
      })
      if (pass) {
        await this.$dialog.confirm('재고를 수정하시겠습니까?').then(() => {
          this.makeInsertList()
        }, () => {
        })
      }
    },
    makeInsertList (tlRmTypeCode) {
      // 데이터를 만든다.
      // Master : brcNo, tlRmTypeCode, tlNetRmTypeGroupCode, rsvBlockCode, rmTypeCd, stndYmd, stock, ratio, autoYn, sellYn, rsvAutoYn
      // Detail : brcNo, tlRmTypeCode, tlNetRmTypeGroupCode, rsvBlockCode, stndYmd, agtCode, agtRmTypeCd, agtSellYn
      const stockData = []
      for (const room of this.body) {
        // 룸타입을 지정했을 경우
        if (tlRmTypeCode === undefined || tlRmTypeCode === room.tlRmTypeCode) {
          // 날짜별 로 데이터를 만든다.
          for (const date of this.dates) {
            const master = {
              brcNo: this.param.brcNo,
              tlRmTypeCode: room.tlRmTypeCode,
              tlNetRmTypeGroupCode: room.tlNetRmTypeGroupCode,
              rmTypeCd: room.rmTypeCd,
              stndYmd: date.value
            }
            // rsvBlockCode
            master.rsvBlockCode = this.selectValue(room.data, 'rsvBlockCode', date.value, '')
            // stock
            master.stock = this.selectValue(room.data, 'expectStock', date.value, '0')
            // ratio
            master.ratio = this.selectValue(room.data, 'ratio', date.value, '0')
            // autoYn
            master.autoYn = this.selectValue(room.data, 'autoYn', date.value, 'N')
            // sellYn
            master.sellYn = this.selectValue(room.data, 'sellYn', date.value, 'N')
            // rsvAutoYn
            master.rsvAutoYn = this.selectValue(room.data, 'rsvAutoYn', date.value, 'N')
            // pmsStock
            master.pmsStock = _.find(_.find(_.find(room.data, { key: 'pmsStock' }).blockList, { blockCode: master.rsvBlockCode }).cols, { date: date.value }).value
            // agt List 가 있는지 확인한다.
            const stockDetailList = _.find(room.data, { key: 'stockDetailList' })
            if (stockDetailList && stockDetailList.netAgtRmTypeList) {
              const dtlArray = []
              for (const agt of stockDetailList.netAgtRmTypeList) {
                const agtInfo = _.find(agt.cols, (data) => {
                  return data.date === date.value
                })
                if (agtInfo) {
                  dtlArray.push({
                    agtCode: agt.agtCode,
                    netAgtRmTypeCode: agt.netAgtRmTypeCode,
                    agtSellYn: agtInfo.value
                  })
                }
              }
              if (dtlArray.length > 0) {
                master.stockDetailList = dtlArray
              }
            }
            stockData.push(master)
          }
        }
      }
      stockService.insertStock(stockData).then(res => {
        this.$dialog.alert('재고를 입력하였습니다.')
        this.search()
      })
    },
    selectValue (list, key, date, defaultValue) {
      let rtn = defaultValue
      // stock
      const row = _.find(list, { key: key })
      let value
      if (row && row.cols) {
        value = _.find(row.cols, { date: date })
      }
      if (value) {
        rtn = value.value
      }
      return rtn
    }
  }
}
</script>

<style scoped>
thead th {
  backgrounded-color: #F5F5F5;
}

tbody th {
  backgrounded-color: #EFEBE9;
}

td.no_sync {
  backgrounded-color: #FFCCBC;
}
</style>
