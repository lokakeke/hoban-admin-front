<template>
    <v-container fluid>
      <v-form ref="form" lazy-validation>
        <app-card :heading="'기준정보 입력'">
          <v-row class="mt-2" no-gutters>
            <v-col cols="12">
              <p class="subtitle-1 font-weight-bold" style="word-break: keep-all">
                ※ 사용자 정의란 : 담당자가 선택한 목록을 제외하고 예치금 초기화를 진행한다. <br>
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
                item-value="commCode"
                item-text="commCodeName"
                :rules="emptyRules"
                autocomplete="off"
                clearable
                @change="searchPartnerList"
              ></v-autocomplete>
            </v-col>
            <v-col sm="6" md="3">
              <v-label>
                <v-tooltip top z-index="1000">
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                  </template>
                  <span> 1) 대상 파트너사 : 초기화 할 파트너사를 선택한다.
                  </span>
                </v-tooltip>
                대상 파트너사</v-label>
              <v-autocomplete
                v-model="form.depoKey"
                :items="origin"
                item-value="depoKey"
                item-text="partnerName"
                :rules="emptyRules"
                autocomplete="off"
                clearable
                @change="searchDepositRequestList"
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
                  <span class="title font-weight-bold" style="word-break: keep-all"> 예치금 신청 리스트 </span>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :label="searchLabel"
                    append-icon="mdi-magnify"
                    hide-details
                    single-line
                    v-model="searchText"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-2" no-gutters>
                <v-col cols="12">
                  <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 적용/유지 대상 예치금으로 이동 할 수 있습니다.</p>
                </v-col>
              </v-row>
              <v-sheet elevation="1">
                <v-data-table
                  class="pointer"
                  :headers="headerDepositRequest"
                  :items="list"
                  :search="searchText"
                  @click:row="moveRow($event)"
                  :no-data-text="'검색 결과가 없습니다.'"
                  height="500"
                  disable-pagination
                  hide-default-footer
                >
                  <!-- 금액 -->
                  <template v-slot:[`item.amt`]="{item}">
                    <strong>{{item.amt | price}}원</strong>
                  </template>
                </v-data-table>
              </v-sheet>
              <v-row class="mt-3" no-gutters>
                <v-col class="text-end">
                  <v-btn @click="moveAll('Y')" color="red" outlined rounded>
                    모두 적용/유지 대상 예치금으로
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" lg="6" md="12" sm="12">
              <v-row no-gutters>
                <v-col cols="6">
                  <span class="title font-weight-bold" style="word-break: keep-all"> 적용/유지 대상 예치금 </span>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :label="searchLabel"
                    append-icon="mdi-magnify"
                    hide-details
                    single-line
                    v-model="searchTargetText"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-2" no-gutters>
                <v-col cols="12">
                  <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 예치금 신청 리스트로 이동 할 수 있습니다.</p>
                </v-col>
              </v-row>
              <v-sheet elevation="1">
                <v-data-table
                  class="pointer"
                  :headers="headerDepositRequest"
                  :items="targetList"
                  :search="searchTargetText"
                  @click:row="moveRow($event)"
                  :no-data-text="'검색 결과가 없습니다.'"
                  height="500"
                  disable-pagination
                  hide-default-footer
                >
                  <!-- 금액 -->
                  <template v-slot:[`item.amt`]="{item}">
                    <strong>{{item.amt | price}}원</strong>
                  </template>
                </v-data-table>
              </v-sheet>
              <v-row class="mt-3" no-gutters>
                <v-col class="text-end">
                  <v-btn @click="moveAll('N')" color="red" outlined rounded>
                    모두 예치금 신청 리스트로
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
import AppCard from '@/components/App/AppCard.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'
import depositAccountService from '@/api/modules/api/depositAccount.service'
import depositRequestService from '@/api/modules/api/depositRequest.service'

export default {
  components: { AppCard },
  name: 'depositInitInsuranceTab',
  data () {
    return {
      form: {},
      searchText: '',
      searchTargetText: '',
      headerDepositRequest: [
        { text: '신청순번', value: 'appSeq', align: 'center' },
        { text: '입금구분', value: 'rcpmnyAcctName', align: 'center' },
        { text: '금액', value: 'amt', align: 'center' },
        { text: '입금내용', value: 'rcpmnyName', align: 'center' },
        { text: '등록일시', value: 'crtDt', align: 'center' },
        { text: '처리일시', value: 'procDt', align: 'center' }
      ],
      // 파트너 목록
      origin: [],
      // 예치금 신청 목록
      depositRequestList: [],
      // 업무유형 목록
      taskTypeList: [],
      // 예치금 계좌 리스트 조회 변수
      searchParamOfDepositAccount: {
        q: { taskType: '' },
        page: 1,
        size: 100000,
        total: 0
      },
      // 예치금 신청 리스트 조회 변수
      searchParamOfDepositRequest: {
        q: { depoKey: '', aprlCode: '' },
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
    list () {
      return this.depositRequestList.filter(data => data.rnum === 'Y')
    },
    targetList () {
      return this.depositRequestList.filter(data => data.rnum === 'N')
    }
  },
  methods: {
    /**
     * 예치금 초기화 > 단건 데이터 이동
     */
    moveRow (event) {
      event.rnum = event.rnum === 'Y' ? 'N' : 'Y'
    },
    /**
     * 예치금 초기화 > 다건 데이터 이동
     */
    moveAll (flag) {
      return this.depositRequestList.map(data => {
        data.rnum = flag === 'Y' ? 'N' : 'Y'
      })
    },
    /**
     * 예치금 초기화 > valid check
     */
    async validCheck () {
      // OTA 외 미구현
      if (this.form.taskType !== 'OTA') {
        this.$dialog.alert('준비중')
        return
      }
      await this.validForm(this.$refs.form)

      const list = this.depositRequestList.filter(data => data.rnum === 'N')
      const targetPartner = this.origin.filter(item => item.depoKey === this.form.depoKey)

      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/Deposit/DepositInitApprovalCustomDialog',
        params: {
          propForm: this.form,
          propList: list,
          propGubun: '사용자 정의 기준',
          propTargetPartner: targetPartner[0]
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            console.log(params)
            if (params && params.data) {
              // 수정 사항이 있을 시만 reload
              this.init()
            }
          }
        }
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
        this.depositRequestList = []
        this.form.depoKey = ''
        return
      }
      const searchParamOfDepositAccount = _.cloneDeep(this.searchParamOfDepositAccount)
      searchParamOfDepositAccount.q.taskType = this.form.taskType
      depositAccountService.selectDepositAccountList(searchParamOfDepositAccount).then(res => {
        const result = res.data.filter(item => {
          return item.useYn === 'Y'
        })
        this.origin = result
      })
    },
    /**
     * 예치금 초기화 > 예치금 신청 리스트 조회
     */
    async searchDepositRequestList () {
      if (this.form.depoKey === null || this.form.depoKey === '' || this.form.depoKey === undefined) {
        this.$dialog.alert('대상 파트너사를 선택해주세요.')
        this.depositRequestList = []
        return
      }
      const searchParamOfDepositRequest = _.cloneDeep(this.searchParamOfDepositRequest)
      searchParamOfDepositRequest.q.depoKey = this.form.depoKey
      searchParamOfDepositRequest.q.aprlCode = 'B' // 승인완료 건
      depositRequestService.selectDepositRequestList(searchParamOfDepositRequest).then(res => {
        res.data.forEach(item => {
          item.rnum = 'Y'
        })
        this.depositRequestList = res.data
      })
    },
    /**
     * 예치금 초기화 > 초기화
     */
    async init () {
      this.form = {}
      this.searchText = ''
      this.searchTargetText = ''
      this.origin = []
      this.depositRequestList = []
      this.taskTypeList = []
      this.selectTaskTypeList()
    }
  }
}
</script>
