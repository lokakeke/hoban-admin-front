<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4" md="6" sm="12">
        <v-text-field
            :label="pkgTextFieldLabel"
            :rules="packageNoRules"
            v-model="packageNo"
            :clearable="!isEdit"
            :readonly="isEdit"
        >
        </v-text-field>
      </v-col>
      <v-col align-self="center" v-if="!isEdit">
        <v-btn outlined color="primary" @click="getPackageInformation">
          <v-icon>search</v-icon>등록
        </v-btn>
        <v-btn @click="openSearchPmsDialog" color="info" outlined>
          <v-icon>search</v-icon>PMS 검색
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="isPackageSearch">
      <v-row v-if="writeAuth">
        <v-col class="text-end">
          <v-btn @click="openReportDialog" color="info">
            품의서
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>패키지 마스터 정보</v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="subtitle-1" cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" lg="3" md="6" sm="12">패키지명 : {{ masterInformation.packageName }} ({{ masterInformation.packageNo }})</v-col>
                    <v-col cols="12" lg="2" md="6" sm="12">조식유무 : {{ masterInformation.breakfastInYn === '1' ? '포함' : '미포함' }}</v-col>
                    <v-col cols="12" lg="2" md="6" sm="12">지역구분 : {{ masterInformation.localName }} ({{ masterInformation.localCode }})</v-col>
                    <v-col cols="12" lg="3" md="6" sm="12">시작/종료일 : {{ pkgMstTermFormat }}</v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-data-table :headers="headers"
                                :items="masterInformationList"
                                :no-data-text="emptyText"
                                :no-results-text="emptyText"
                                class="bordered"
                                disable-pagination
                                hide-default-footer>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12" lg="3" md="3" sm="12">
            <v-text-field
                label="판매 패키지번호"
                readonly
                v-model="form.packageNo"
            />
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="12">
            <v-text-field
                label="판매 패키지명"
                clearable
                :rules="emptyRules"
                v-model="form.packageName"
                :readonly="!writeAuth"
            />
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="12">
            <date-picker
              :readonly="!writeAuth"
              clearable
              label="판매 시작일자"
              v-model="form.saleStartDate"
              required
            />
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="12">
            <date-picker
              :readonly="!writeAuth"
              :min="endDateMin"
              clearable
              hide-details
              label="판매 종료일자"
              required
              v-model="form.saleEndDate"
            />
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12" lg="3" md="6" sm="12">
            <v-row no-gutters>
              <v-col cols="12" lg="4" md="4" sm="12">
                <v-switch
                    @change="changeSwitch"
                    false-value="N"
                    label="당일 예약 여부"
                    true-value="Y"
                    v-model="form.todayRsvYn"
                    :readonly="!writeAuth"
                />
              </v-col>
              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-select
                    :disabled="form.todayRsvYn === 'N'"
                    :items="reservationHour"
                    :rules="form.todayRsvYn === 'Y' ? emptyRules : undefined"
                    label="당일 예약 마감 시간"
                    v-model="todayRsvHour"
                    :readonly="!writeAuth"
                />
              </v-col>
              <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-select
                    :disabled="form.todayRsvYn === 'N'"
                    :items="reservationMinute"
                    :rules="form.todayRsvYn === 'Y' ? emptyRules : undefined"
                    label="분"
                    v-model="todayRsvMinute"
                    :readonly="!writeAuth"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="3" md="6" sm="12">
            <v-row no-gutters>
              <v-col class="pr-sm-3 pr-md-3 pr-lg-3" cols="12" lg="6" md="6" sm="6">
                <v-text-field
                    :rules="emptyRules.concat(oneOrMoreRegex)"
                    clearable
                    label="박 수"
                    type="number"
                    :readonly="!writeAuth"
                    v-model="form.nights"
                />
              </v-col>
              <v-col class="pl-sm-3 pl-md-3 pl-lg-3" cols="12" lg="6" md="6" sm="6">
                <v-text-field
                    :rules="emptyRules.concat(oneOrMoreRegex)"
                    clearable
                    label="객실 수"
                    type="number"
                    :readonly="!writeAuth"
                    v-model="form.roomCount"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="3" md="6" sm="12">
            <v-text-field
                :rules="emptyRules.concat(oneOrMoreRegex)"
                clearable
                label="요청당 객실 수량 제한"
                type="number"
                :readonly="!writeAuth"
                v-model="form.roomDayLimit"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" sm="12" v-if="writeAuth">
            <v-select
                :rules="emptyRules"
                :items="blockItems"
                label="블럭코드"
                :readonly="!writeAuth"
                v-model="form.blockCode"
            />
          </v-col>
          <v-col cols="12" lg="9" md="9" sm="12">
            <v-text-field
                :readonly="!writeAuth"
                clearable
                label="패키지 설명"
                v-model="form.packageDesc"
            />
          </v-col>
          <v-col class="d-flex" cols="12" lg="3" md="3" sm="12">
            <v-checkbox
                :readonly="!writeAuth"
                class="ml-auto"
                @change="setTodayRsvYn"
                false-value="N"
                label="패키지를 당일 상품으로 변경"
                v-model="form.todaySaleYn"
                true-value="Y"
            />
          </v-col>
          <v-col class="d-flex" cols="12" lg="12" md="12" sm="12">
            <v-switch
                label="패키지 사용 여부"
                false-value="N"
                true-value="Y"
                class="ml-auto"
                v-model="form.useYn"
                :readonly="!writeAuth"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-container>
</template>

<script>
import packageService from '@/api/modules/ota/package.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'BasicInformation',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      packageNo: '',
      packageNoRules: [
        value => !!value || '패키지번호를 입력해주세요.',
        value => {
          const pattern = /^[0-9]+$/g
          return pattern.test(value) || '숫자만 입력할 수 있습니다.'
        }
      ],
      // 패키지 마스터 정보
      masterInformation: {},
      // 패키지 마스터 메뉴 테이블 헤더
      headers: [
        { text: '패키지 메뉴순번', value: 'packageMenuSeq', align: 'center', sortable: false },
        { text: '패키지 메뉴명', value: 'packageMenuName', align: 'center', sortable: false }
      ],
      // 패키지 마스터 메뉴 테이블 데이터
      masterInformationList: [],
      // 패키지 마스터 정보 조회 여부
      isPackageSearch: false,

      reservationHour: [],
      reservationMinute: [],
      todayRsvHour: '',
      todayRsvMinute: '',
      form: {
        packageNo: '',
        packageName: '',
        saleStartDate: '',
        saleEndDate: '',
        todayRsvYn: 'N',
        nights: 1,
        useYn: 'Y',
        allSaleYn: 'N',
        roomCount: 1,
        roomDayLimit: 1,
        blockCode: null,
        report: '',
        packageDesc: '',
        todaySaleYn: 'N'
      },
      blockItems: [],
      pkgSaleType: []
    }
  },
  mounted () {
    if (this.isEdit) {
      this.packageNo = this.packageNoProp
      this.getPackageInformation()
    }
    this.getReservationTime()
    this.getPkgSaleType()
    this.getBlockCode()
  },
  computed: {
    pkgTextFieldLabel () {
      const saleType = this.pkgSaleType.join(', ')
      return `패키지 번호 입력 [해당 판매유형(${saleType})만 등록가능]`
    },

    // 패키지 마스터정보 판매 시작일 종료일 출력형식 변경
    pkgMstTermFormat () {
      return `${moment(this.masterInformation.startDate).format('YYYY.MM.DD')} ~ ${moment(this.masterInformation.endDate).format('YYYY.MM.DD')}`
    },
    endDateMin () {
      // 20220627
      return `${this.form.saleStartDate.substring(0, 4)}-${this.form.saleStartDate.substring(4, 6)}-${this.form.saleStartDate.substring(6)}`
    }
  },
  methods: {
    // 패키지 번호 유효성 검증
    validatePackageNumber () {
      const pattern = /^[0-9]+$/g
      if (this.packageNo === '' || this.packageNo.length === 0) {
        this.$dialog.alert('패키지번호를 입력해주세요.')
      } else if (!pattern.test(this.packageNo)) {
        this.$dialog.alert('유효하지 않은 패키지번호입니다.')
      } else {
        return true
      }

      return false
    },

    // 패키지 정보 조회
    // 수정모드일 경우 OTA 패키지 정보 + 마스터 정보
    // 등록모드일 경우 마스터 정보
    getPackageInformation () {
      if (!this.validatePackageNumber()) return

      packageService.selectRoomPackageInformation(this.packageNo).then((response) => {
        if (response.data === '' || this.isEdit) {
          if (this.isEdit) {
            const data = response.data
            this.form.packageName = data.packageName
            this.form.saleStartDate = moment(data.saleStartDate).format('YYYYMMDD')
            this.form.saleEndDate = moment(data.saleEndDate).format('YYYYMMDD')
            this.form.todayRsvYn = data.todayRsvYn
            this.todayRsvHour = data.todayRsvTime !== null ? data.todayRsvTime.substr(0, 2) : ''
            this.todayRsvMinute = data.todayRsvTime !== null ? data.todayRsvTime.substr(2, 2) : ''
            this.form.nights = data.nights
            this.form.roomCount = data.roomCount
            this.form.roomDayLimit = data.roomDayLimit
            this.form.useYn = data.useYn
            this.form.allSaleYn = data.allSaleYn
            this.form.blockCode = data.blockCode
            this.form.report = data.report
            this.form.packageDesc = data.packageDesc
            this.form.todaySaleYn = data.todaySaleYn
          }
          packageService.selectPackageMasterInformation(this.packageNo, 1).then((response) => {
            if (response.data.length === 0) {
              this.isPackageSearch = true
              this.$dialog.alert('PMS 검색 결과가 존재하지 않습니다.')
            } else {
              this.masterInformation = response.data
              this.masterInformation.startDate = moment(this.masterInformation.startDate).format('YYYYMMDD')
              this.masterInformation.endDate = moment(this.masterInformation.endDate).format('YYYYMMDD')
              this.masterInformationList = this.masterInformation.packPmsDetailList
              this.form.packageNo = this.packageNo
              this.isPackageSearch = true
            }
          }).catch((error) => {
            this.isPackageSearch = true
            console.log(error)
          })
        } else {
          this.$dialog.alert('이미 등록된 패키지입니다.')
        }
      })
    },

    // 공통코드 조회 - 패키지 판매 유형
    getPkgSaleType () {
      commonCodeService.selectCommonCode('OTA0004').then((response) => {
        for (const data of response.data) {
          this.pkgSaleType.push(data.commonCode)
        }
      })
    },

    // 공통코드 조회 - 예약블록 코드
    getBlockCode () {
      commonCodeService.selectCommonCode('PACKAGE_BLOCK_CODE').then((response) => {
        for (const data of response.data) {
          this.blockItems.push(data.commonCode)
        }
      })
    },

    // 당일예약 가능 여부 변경 스위치
    // 당일예약 가능 여부가 N 일경우, 시/분 초기화
    changeSwitch () {
      this.todayRsvHour = this.form.todayRsvYn === 'Y' ? this.todayRsvHour : ''
      this.todayRsvMinute = this.form.todayRsvYn === 'Y' ? this.todayRsvMinute : ''
    },

    // 당일예약 상품 체크 시, 당일 예약 가능 여부가 활성화
    setTodayRsvYn () {
      if (this.form.todaySaleYn === 'Y') {
        this.form.todayRsvYn = 'Y'
      } else {
        this.form.todayRsvYn = 'N'
      }
      this.changeSwitch()
    },

    // 시, 분 SELECT BOX 출력 데이터
    getReservationTime () {
      for (let i = 0; i < 24; i++) {
        this.reservationHour.push((i < 10) ? '0' + i : '' + i)
      }

      for (let i = 0; i < 60; i++) {
        this.reservationMinute.push((i < 10) ? '0' + i : '' + i)
      }
    },

    // 품의서 출력 메소드
    openReportDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/ReportDialog',
        params: {
          report: this.form.report
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.report = params.data
            }
          }
        }
      })
    },

    // PMS 에서 패키지 정보를 조회하는 Dialog 창 출력 (패키지 구분 상관없이 모두)
    async openSearchPmsDialog () {
      if (!this.validatePackageNumber()) return

      const response = await packageService.selectPackageMasterInformation(this.packageNo, 2)
      if (response.data === '') {
        this.$dialog.alert('검색 결과가 존재하지 않습니다.')
        return
      }

      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Package/SearchPmsDialog',
        params: {
          pkgMstInfo: response.data
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1800
        }
      })
    },

    // 기본정보 등록
    save () {
      this.validForm(this.$refs.form).then(() => {
        const submitForm = Object.assign({}, this.form)
        submitForm.saleStartDate = moment(this.form.saleStartDate).format('YYYYMMDD')
        submitForm.saleEndDate = moment(this.form.saleEndDate).format('YYYYMMDD')
        if ((this.todayRsvHour !== undefined && this.todayRsvHour !== null) && (this.todayRsvMinute !== undefined && this.todayRsvMinute !== null)) {
          submitForm.todayRsvTime = this.todayRsvHour + this.todayRsvMinute
        } else {
          submitForm.todayRsvTime = null
        }
        packageService.insertRoomPackageInformation(submitForm)
        this.$emit('setPackageNo', submitForm.packageNo)
        this.$emit('nextStep', 'RoomTypeInformation')
      })
    },

    // 기본정보 수정
    update () {
      this.validForm(this.$refs.form).then(() => {
        const submitForm = Object.assign({}, this.form)
        submitForm.saleStartDate = moment(this.form.saleStartDate).format('YYYYMMDD')
        submitForm.saleEndDate = moment(this.form.saleEndDate).format('YYYYMMDD')
        if ((this.todayRsvHour !== undefined && this.todayRsvHour !== null) && (this.todayRsvMinute !== undefined && this.todayRsvMinute !== null)) {
          submitForm.todayRsvTime = this.todayRsvHour + this.todayRsvMinute
        } else {
          submitForm.todayRsvTime = null
        }
        packageService.updateRoomPackageInformation(submitForm)
      })
      this.$dialog.alert('수정이 완료되었습니다.')
    }
  }
}
</script>

<style scoped>

</style>
