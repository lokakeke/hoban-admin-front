<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4" md="6" sm="12">
        <v-text-field
            label="패키지 번호 입력"
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
        <v-btn @click="openSearchPackageDialog" color="info" outlined>
          <v-icon>search</v-icon>PMS 검색
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="isPackageSearch">
      <v-row>
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
                    <v-col cols="12" lg="3" md="6" sm="12">패키지명 : ~</v-col>
                    <v-col cols="12" lg="2" md="6" sm="12">조식유무 : ~</v-col>
                    <v-col cols="12" lg="2" md="6" sm="12">지역구분 : ~</v-col>
                    <v-col cols="12" lg="3" md="6" sm="12">시작/종료일 : ~</v-col>
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
            />
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="12">
            <date-picker
              clearable
              label="판매 시작일자"
              v-model="form.saleStartDate"
              required
            />
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="12">
            <date-picker
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
                  false-value="N"
                  label="당일 예약 여부"
                  true-value="Y"
                  v-model="form.todayRsvYn"
                />
              </v-col>
              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-select label="당일 예약 마감 시간"/>
              </v-col>
              <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-select label="분"/>
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
                  v-model="form.nights"
                />
              </v-col>
              <v-col class="pl-sm-3 pl-md-3 pl-lg-3" cols="12" lg="6" md="6" sm="6">
                <v-text-field
                  :rules="emptyRules.concat(oneOrMoreRegex)"
                  clearable
                  label="객실 수"
                  type="number"
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
              v-model="form.roomDayLimit"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" sm="12">
            <v-select
              :rules="emptyRules"
              :items="blockItems"
              label="블럭코드"
              v-model="form.blockCode"
            />
          </v-col>
          <v-col cols="12" lg="9" md="9" sm="12">
            <v-text-field
              clearable
              label="패키지 설명"
              v-model="form.packageDesc"
            />
          </v-col>
          <v-col class="d-flex" cols="12" lg="3" md="3" sm="12">
            <v-checkbox
              class="ml-auto"
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
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right">
            <v-btn @click="save" color="primary" rounded v-if="!isEdit">
              <v-icon>keyboard_arrow_right</v-icon>저장 후 다음단계로 이동</v-btn>
            <v-btn @click="update" color="primary" rounded v-else>
              <v-icon class="pr-2">edit</v-icon>수정
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-container>
</template>

<script>
import packageService from '@/api/modules/userSystem/package.service'

export default {
  name: 'BasicInformation',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      packageNo: null,
      packageNoRules: [
        value => !!value || '패키지번호를 입력해주세요.',
        value => {
          const pattern = /^[0-9]+$/g
          return pattern.test(value) || '숫자만 입력할 수 있습니다.'
        }
      ],
      headers: [
        { text: '패키지 메뉴순번', value: 'packageMenuSeq', align: 'center', sortable: false },
        { text: '패키지 메뉴명', value: 'packageMenuName', align: 'center', sortable: false }
      ],
      blockItems: [],
      masterInformationList: [],
      isPackageSearch: false, // 패키지 등록
      form: {
        report: null
      }
    }
  },
  mounted () {
    if (this.isEdit) {
      this.packageNo = this.packageNoProp
    }
  },
  computed: {
  },
  methods: {
    // 등록
    getPackageInformation () {
      this.isPackageSearch = true
    },
    // 검색
    openSearchPackageDialog () {
      packageService.selectPackageNo(this.packageNo).then(res => {
        console.log(res)
      })
    },
    // 품의서
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
    // 저장
    save () {
      // TODO save api
      this.$emit('nextStep', 2)
    },
    // 수정
    update () {
    }
  }
}
</script>

<style scoped>

</style>
