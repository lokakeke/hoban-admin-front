<template>
    <v-container fluid>
      <v-form ref="form" lazy-validation>
        <app-card :heading="'기준정보 입력'">
          <v-row class="mt-2" no-gutters>
            <v-col cols="12">
              <p class="subtitle-1 font-weight-bold" style="word-break: keep-all">
                ※ 증권 기준이란 : 증권(입금구분) 을 제외하고 예치금 초기화를 진행한다. (단, 기간이 유효한 증권을 대상으로 하며, 나머지는 기간만료로 처리한다.) <br>
                ※ 업무 유형 선택 시 파트너 목록이 조회 됩니다.
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6" md="3">
              <v-label>
                <v-tooltip top z-index="1000">
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                  </template>
                  <span> 1) 업무 유형 : OTA (객실/패키지) / 소셜(입장권) 등 유형별 파트너사 목록을 조회한다.
                  </span>
                </v-tooltip>
                업무 유형</v-label>
              <v-autocomplete
                v-model="form.taskType"
                :items="taskTypeList"
                item-value="commCd"
                item-text="commCdNm"
                :rules="emptyRules"
                autocomplete="off"
                clearable
                @change="searchPartnerList"
              ></v-autocomplete>
            </v-col>
            <v-col sm="6" md="3" v-if="form.taskType === 'OTA'">
              <v-label>
                <v-tooltip top z-index="1000">
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                  </template>
                  <span> 1) 객실 기준일자 : 예약된 객실의 투숙 일자부터 예치금 계산을 한다.<br>
                         2) 예치금 계산 기준 : 취소를 제외한 나머지 예약건의 객실료 합계로 한다.
                  </span>
                </v-tooltip>
                객실 기준일자</v-label>
              <date-picker v-model="form.roomDt" clearable required></date-picker>
            </v-col>
            <v-col sm="6" md="3" v-if="form.taskType === 'OTA'">
              <v-label>
                <v-tooltip top z-index="1000">
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                  </template>
                  <span> 1) 패키지 기준일자 : 예약된 패키지의 투숙 일자부터 예치금 계산을 한다.<br>
                         2) 예치금 계산 기준 : 취소를 제외한 나머지 패키지건의 객실료+부대시설 총 합계로 한다.
                  </span>
                </v-tooltip>
                패키지 기준일자</v-label>
              <date-picker v-model="form.pkgDt" clearable required></date-picker>
            </v-col>
          </v-row>
        </app-card>
        <app-card >
          <v-row>
            <v-col cols="12" lg="6" md="12" sm="12">
              <v-row no-gutters>
                <v-col cols="6">
                  <span class="title font-weight-bold" style="word-break: keep-all"> 파트너 목록 </span>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :label="searchLabel"
                    append-icon="mdi-magnify"
                    hide-details
                    single-line
                    v-model="searchPartner"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-2" no-gutters>
                <v-col cols="12">
                  <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 적용 대상 파트너로 이동 할 수 있습니다.</p>
                </v-col>
              </v-row>
              <v-sheet elevation="1">
                <v-data-table
                  class="pointer"
                  :headers="headerPartner"
                  :items="listPartner"
                  :search="searchPartner"
                  @click:row="moveRow($event)"
                  :no-data-text="'검색 결과가 없습니다.'"
                  height="500"
                  disable-pagination
                  hide-default-footer
                >
                  <!-- 증권-입금현황 -->
                  <template v-slot:[`item.insuranceAmt`]="{item}">
                    <span class="red--text">{{item.insuranceAmt | price}}원</span>
                  </template>
                  <!-- 기타-입금현황 -->
                  <template v-slot:[`item.uninsuranceAmt`]="{item}">
                    <span class="red--text">{{item.uninsuranceAmt | price}}원</span>
                  </template>
                  <!-- 출금현황 -->
                  <template v-slot:[`item.accmltWithdrawAmt`]="{item}">
                    <span class="blue--text">{{item.accmltWithdrawAmt | price}}원</span>
                  </template>
                  <!-- 금액 -->
                  <template v-slot:[`item.amt`]="{item}">
                    <strong>{{item.amt | price}}원</strong>
                  </template>
                </v-data-table>
              </v-sheet>
              <v-row class="mt-3" no-gutters>
                <v-col class="text-end">
                  <v-btn @click="moveAll('Y')" color="red" outlined rounded>
                    모두 적용 대상 파트너 목록으로
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" lg="6" md="12" sm="12">
              <v-row no-gutters>
                <v-col cols="6">
                  <span class="title font-weight-bold" style="word-break: keep-all"> 적용 대상 파트너 </span>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :label="searchLabel"
                    append-icon="mdi-magnify"
                    hide-details
                    single-line
                    v-model="searchTargetPartner"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-2" no-gutters>
                <v-col cols="12">
                  <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 파트너 목록으로 이동 할 수 있습니다.</p>
                </v-col>
              </v-row>
              <v-sheet elevation="1">
                <v-data-table
                  class="pointer"
                  :headers="headerPartner"
                  :items="listTargetPartner"
                  :search="searchTargetPartner"
                  @click:row="moveRow($event)"
                  :no-data-text="'검색 결과가 없습니다.'"
                  height="500"
                  disable-pagination
                  hide-default-footer
                >
                  <!-- 증권-입금현황 -->
                  <template v-slot:[`item.insuranceAmt`]="{item}">
                    <span class="red--text">{{item.insuranceAmt | price}}원</span>
                  </template>
                  <!-- 기타-입금현황 -->
                  <template v-slot:[`item.uninsuranceAmt`]="{item}">
                    <span class="red--text">{{item.uninsuranceAmt | price}}원</span>
                  </template>
                  <!-- 출금현황 -->
                  <template v-slot:[`item.accmltWithdrawAmt`]="{item}">
                    <span class="blue--text">{{item.accmltWithdrawAmt | price}}원</span>
                  </template>
                  <!-- 금액 -->
                  <template v-slot:[`item.amt`]="{item}">
                    <strong>{{item.amt | price}}원</strong>
                  </template>
                  <!-- 사용여부 -->
                  <template v-slot:[`item.useYn`]="{item}">
                    <strong class="info--text" v-if="item.useYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>사용</strong>
                    <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>사용안함</strong>
                  </template>
                </v-data-table>
              </v-sheet>
              <v-row class="mt-3" no-gutters>
                <v-col class="text-end">
                  <v-btn @click="moveAll('N')" color="red" outlined rounded>
                    모두 파트너 목록으로
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </app-card>
        <app-card>
          <v-row justify="end" class="mt-5">
            <v-col align-self="center" class="text-right pa-1">
              <v-btn outlined rounded color="info" @click="validCheck">
                <v-icon>check</v-icon>적용
              </v-btn>
            </v-col>
          </v-row>
        </app-card>
      </v-form>
    </v-container>
</template>

<script>
import AppCard from "../../App/AppCard.vue"
import commonCodeService from "Api/modules/system/commonCode.service"
import depositAccountService from "Api/modules/api/depositAccount.service"

export default {
  components: { AppCard },
  name: 'depositInitInsuranceTab',
  data () {
    return {
      form: {},
      searchPartner: '',
      searchTargetPartner: '',
      headerPartner: [
        { text: '파트너명', value: 'ptnrNm', align: 'center' },
        { text: '증권-입금현황', value: 'insuranceAmt', align: 'center' },
        { text: '기타-입금현황', value: 'uninsuranceAmt', align: 'center' },
        { text: '출금현황', value: 'accmltWithdrawAmt', align: 'center' },
        { text: '예치금', value: 'amt', align: 'center' }
      ],
      // 파트너 목록
      origin: [],
      // 업무유형 목록
      taskTypeList: [],
      // 조회 변수
      searchParam: {
        q: { taskType: '' },
        page: 1,
        size: 100000,
        total: 0
      }
    }
  },
  async mounted () {
    this.selectTaskTypeList()
  },
  computed: {
    listPartner () {
      return this.origin.filter(data => data.useYn === 'Y')
    },
    listTargetPartner () {
      return this.origin.filter(data => data.useYn === 'N')
    }
  },
  methods: {
    /**
     * 예치금 초기화 > 단건 데이터 이동
     */
    moveRow (event) {
      event.useYn = event.useYn === 'Y' ? 'N' : 'Y'
    },
    /**
     * 예치금 초기화 > 다건 데이터 이동
     */
    moveAll (flag) {
      return this.origin.map(data => {
        data.useYn = flag === 'Y' ? 'N' : 'Y'
      })
    },
    /**
     * 예치금 초기화 > valid check
     */
    async validCheck () {
      this.validForm(this.$refs.form).then(() => {
        const list = this.origin.filter(data => data.useYn === 'N')
        if (list.length < 1) {
          this.$dialog.alert('적용 대상 파트너 목록이 없습니다.')
          return
        }

        // OTA 외 미구현
        if (this.form.taskType !== 'OTA') {
          this.$dialog.alert('준비중')
          return
        }

        this.$store.dispatch('dialog/open', {
          componentPath: '/Api/Deposit/DepositInitApprovalDialog',
          params: {
            propForm: this.form,
            propList: list,
            propGubun: '증권 기준'
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 1200,
            closeCallback: (params) => {
              if (params && params.data) {
                // 수정 사항이 있을 시만 reload
                this.searchPartnerList()
              }
            }
          }
        })
      })
    },
    /**
     * 예치금 초기화 > 업무유형 목록 조회
     */
    async selectTaskTypeList () {
      this.taskTypeList = []
      try {
        const response = await commonCodeService.selectCommonCode('COMM0009')
        this.taskTypeList = response.data
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * 예치금 초기화 > 파트너 목록 조회
     */
    async searchPartnerList () {
      if (this.form.taskType === null || this.form.taskType === '' || this.form.taskType === undefined) {
        this.$dialog.alert('업무 유형을 선택해주세요.')
        this.origin = []
        return
      }
      const searchParam = _.cloneDeep(this.searchParam)
      searchParam.q.taskType = this.form.taskType
      depositAccountService.selectDepositAccountList(searchParam).then(res => {
        const result = res.data.filter(item => {
          return item.useYn === 'Y'
        })
        this.origin = result
      })
    }
  }
}
</script>
