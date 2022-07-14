<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col cols="12">
        <v-form lazy-validation ref="form">
          <v-card outlined>
            <v-card-title>
              <span class="heading">기본 정보 입력</span>
              <v-spacer />
              <v-btn @click="loadData" color="info" v-if="!isEdit">
                불러오기
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules"
                      @click="openStoreListDialog"
                      append-icon="search"
                      label="영업장 명(코드)"
                      readonly
                      v-model="store"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules"
                      label="지역 명(코드)"
                      readonly
                      v-model="local"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <date-picker
                      clearable
                      hide-details
                      label="판매 시작일자"
                      required
                      :readonly="!writeAuth"
                      v-model="form.saleStartDate"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <date-picker
                      clearable
                      hide-details
                      :readonly="!writeAuth"
                      required
                      label="판매 종료일자"
                      v-model="form.saleEndDate"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules.concat(oneOrMoreRegex)"
                      label="객실수량 제한 (요청당)"
                      v-model="form.dailyRsvLimit"
                      :readonly="!writeAuth"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules.concat(oneOrMoreRegex)"
                      label="조회 범위"
                      v-model="form.roomSearchCount"
                      :readonly="!writeAuth"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="4" sm="12">
                  <v-switch
                      :readonly="!writeAuth"
                      @change="changeSwitch"
                      false-value="N"
                      label="당일 예약 여부"
                      true-value="Y"
                      v-model="form.todayRsvYn"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="4" sm="12">
                  <v-select
                      :disabled="form.todayRsvYn === 'N'"
                      :items="reservationHour"
                      :readonly="!writeAuth"
                      :rules="form.todayRsvYn === 'Y' ? emptyRules : undefined"
                      label="당일 예약 마감 시간"
                      v-model="todayRsvHour"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="4" sm="12">
                  <v-select
                      :disabled="form.todayRsvYn === 'N'"
                      :items="reservationMinute"
                      :readonly="!writeAuth"
                      :rules="form.todayRsvYn === 'Y' ? emptyRules : undefined"
                      label="분"
                      v-model="todayRsvMinute"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules.concat(oneOrMoreRegex)"
                      label="최대 예약가능 박 수"
                      v-model="form.nights"
                      :readonly="!writeAuth"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12">
                  <v-text-field
                      :rules="emptyRules.concat(oneOrMoreRegex)"
                      label="최대 예약가능 객실 수"
                      v-model="form.roomCount"
                      :readonly="!writeAuth"
                  />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="12" v-if="writeAuth">
                  <v-select
                      :items="blckItems"
                      :readonly="!writeAuth"
                      :rules="emptyRules"
                      label="블럭코드"
                      v-model="form.blockCode"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" lg="12" md="12" sm="12">
                  <v-switch
                      class="ml-auto"
                      false-value="N"
                      label="판매 여부"
                      true-value="Y"
                      v-model="form.useYn"
                      :readonly="!writeAuth"
                  />
                </v-col>
              </v-row>
              <v-row>

              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import roomTypeService from '@/api/modules/ota/roomType.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import { mapGetters } from 'vuex'

export default {
  name: 'BasicInformation',
  props: {
    isEdit: Boolean,
    storeCodeProp: String
  },
  data: function () {
    return {
      reservationHour: [],
      reservationMinute: [],
      todayRsvHour: '',
      todayRsvMinute: '',

      form: {
        localCode: '',
        localName: '',
        storeCode: '',
        storeName: '',
        saleStartDate: '',
        saleEndDate: '',
        dailyRsvLimit: 10,
        roomSearchCount: 60,
        nights: 1,
        roomCount: 1,
        todayRsvYn: 'N',
        blockCode: '',
        useYn: 'Y'
      },
      blckItems: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),

    local () {
      return this.form.localCode ? `${this.form.localName} (${this.form.localCode})` : ''
    },

    store () {
      return this.form.storeCode ? `${this.form.storeName} (${this.form.storeCode})` : ''
    }
  },
  mounted () {
    if (this.isEdit) {
      this.getStoreInformation()
    }
    this.getReservationTime()
    this.getBlockCode()
  },
  methods: {
    changeSwitch () {
      this.todayRsvHour = this.form.todayRsvYn === 'Y' ? this.todayRsvHour : null
      this.todayRsvMinute = this.form.todayRsvYn === 'Y' ? this.todayRsvMinute : null
    },

    async openStoreListDialog () {
      if (!this.isEdit) {
        await this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/Room/StoreChipGroup',
          params: {},
          options: {
            fullscreen: false,
            scrollable: true,
            dense: true,
            width: 700,
            closeCallback: (params) => {
              if (params && params.storeCode) {
                this.form.localCode = params.localCode
                this.form.localName = params.localName
                this.form.storeCode = params.storeCode
                this.form.storeName = params.storeName
              }
            }
          }
        })
      }
    },

    async loadData () {
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/SelectionItemDialog',
        params: {
          getRoomTypeList: this.getRoomTypeList
        },
        options: {
          fullscreen: false,
          scrollable: true,
          dense: true,
          closeCallback: (params) => {
            if (params && params.storeCode) {
              this.form.saleStartDate = params.saleStartDate
              this.form.saleEndDate = params.saleEndDate
              this.form.dailyRsvLimit = params.dailyRsvLimit
              this.form.roomSearchCount = params.roomSearchCount
              this.form.todayRsvYn = params.todayRsvYn
              // this.form.todayRsvTime = params.todayRsvTime
              this.form.nights = params.nights
              this.form.roomCount = params.roomCount
              this.form.rsvBlckCd = params.rsvBlckCd
              this.form.useYn = params.useYn
              this.todayRsvHour = params.todayRsvTime !== null ? params.todayRsvTime.substr(0, 2) : ''
              this.todayRsvMinute = params.todayRsvTime !== null ? params.todayRsvTime.substr(2, 2) : ''
            }
          }
        }
      })
    },

    async getBlockCode () {
      const response = await commonCodeService.selectCommonCode('PACKAGE_BLOCK_CODE')
      for (const item of response.data) {
        this.blckItems.push(item.commonCode)
      }
    },

    async getStoreInformation () {
      let response
      if (this.isPartner) {
        response = await roomTypeService.selectRoomTypeInformationPartner(this.storeCodeProp, this.user.number)
      } else {
        response = await roomTypeService.selectRoomTypeInformation(this.storeCodeProp)
      }
      const data = response.data

      this.form = data
      this.todayRsvHour = data.todayRsvTime !== null ? data.todayRsvTime.substr(0, 2) : ''
      this.todayRsvMinute = data.todayRsvTime !== null ? data.todayRsvTime.substr(2, 2) : ''
    },

    getReservationTime () {
      for (let i = 0; i < 24; i++) {
        this.reservationHour.push((i < 10) ? '0' + i : '' + i)
      }

      for (let i = 0; i < 60; i++) {
        this.reservationMinute.push((i < 10) ? '0' + i : '' + i)
      }
    },

    async save () {
      await this.validForm(this.$refs.form)

      if (this.form.roomSearchCount > 365) {
        this.$dialog.alert('조회 범위는 365일 이하로 설정해주시기 바랍니다.')
        return
      }

      try {
        const submitForm = Object.assign({}, this.form)
        submitForm.saleStartDate = moment(this.form.saleStartDate).format('YYYYMMDD')
        submitForm.saleEndDate = moment(this.form.saleEndDate).format('YYYYMMDD')
        if ((this.todayRsvHour !== undefined && this.todayRsvHour !== null) && (this.todayRsvMinute !== undefined && this.todayRsvMinute !== null)) {
          submitForm.todayRsvTime = this.todayRsvHour + this.todayRsvMinute
        } else {
          submitForm.todayRsvTime = null
        }

        const response = await roomTypeService.insertRoomTypeInfo(submitForm)
        if (response.data === 1) {
          this.$emit('nextStep', 'PartnerExceptionSetting')
          this.$emit('setStoreCode', submitForm.storeCode)
        } else {
          this.$dialog.alert('등록 중 오류가 발생했습니다.')
        }
      } catch {}
    },

    async update () {
      if (this.form.roomSearchCount > 365) {
        this.$dialog.alert('조회 범위는 365일 이하로 설정해주시기 바랍니다.')
        return
      }

      await this.validForm(this.$refs.form)
      const submitForm = Object.assign({}, this.form)
      submitForm.saleStartDate = moment(this.form.saleStartDate).format('YYYYMMDD')
      submitForm.saleEndDate = moment(this.form.saleEndDate).format('YYYYMMDD')
      if ((this.todayRsvHour !== undefined && this.todayRsvHour !== null) && (this.todayRsvMinute !== undefined && this.todayRsvMinute !== null)) {
        submitForm.todayRsvTime = this.todayRsvHour + this.todayRsvMinute
      } else {
        submitForm.todayRsvTime = null
      }

      // 수정로직 추가
      const response = await roomTypeService.updateRoomTypeInfo(submitForm)
      if (response.data === 1) {
        this.$dialog.alert('수정이 완료되었습니다.')
      } else {
        this.$dialog.alert('등록 중 오류가 발생했습니다.')
      }
    }
  }
}
</script>

<style scoped>

</style>
