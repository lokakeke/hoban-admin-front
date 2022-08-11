<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      패키지 등록<br>
    </template>
    <v-form ref="form" lazy-validation >
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">패키지</div>
          <v-text-field v-model="form.packageName" dense
                        :rules="emptyRules"
                        @click="openPackagePopup(form)"
                        placeholder="패키지를 선택 해주세요."
                        readonly
                        >
            <template v-slot:append-outer >
              <v-btn icon small color="primary" @click="openPackagePopup(form)">
                  <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">객실수</div>
          <v-text-field v-model="form.roomCount" dense
                        placeholder="패키지를 선택 해주세요."
                        :rules="emptyRules.concat(numberRules)"
                        readonly
                        disabled />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">박수</div>
          <v-text-field v-model="form.nights" dense
                        placeholder="패키지를 선택 해주세요."
                        :rules="emptyRules.concat(numberRules)"
                        readonly
                        disabled />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">예약블럭</div>
          <v-text-field v-model="form.blockCode" dense
                        placeholder="패키지를 선택 해주세요."
                        :rules="emptyRules"
                        readonly
                        disabled />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">영업장</div>
          <v-autocomplete v-model="form.storeCode" dense
                          autocomplete="off"
                          :items="storeList"
                          :item-value="'storeCode'"
                          :item-text="'storeName'"
                          placeholder="영업장을 선택 해주세요."
                          :rules="emptyRules"
                          @change="changeRmtypeCode(form.storeCode)"
          />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">객실유형</div>
          <v-autocomplete v-model="form.roomTypeCode" dense
                          :items="roomTypes"
                          :item-value="'roomTypeCode'"
                          :item-text="'roomTypeName'"
                          placeholder="객실유형을 선택 해주세요."
                          :rules="emptyRules" />
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions v-if="this.approveCode === '' || this.approveCode === 'A'">
      <v-btn v-if="writeAuth" color="info" rounded @click="submit"><v-icon left>check</v-icon>등록 (F4)</v-btn>
      <v-btn color="primary" rounded @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import packageService from '@/api/modules/ota/package.service'

export default {
  extends: DialogBase,
  name: 'PartnerPkgPutInDialog',
  data () {
    return {
      // 파라미터
      form: {
        packageNo: '',
        packageName: '',
        storeCode: '',
        storeName: '',
        roomTypeCode: '',
        roomTypeName: '',
        nights: '',
        roomCount: '',
        approveCode: '',
        saleStartDate: '',
        saleEndDate: '',
        todayRsvYn: '',
        todayRsvTime: ''
      },
      // 예약가능 영업장 리스트
      storeList: [],
      // 예약가능 객실 리스트
      roomTypes: [],
      // 신청 상태
      approveCode: '',
      // 패키지예약 신청 목록
      pkgPutInList: []
    }
  },
  mounted () {
    try {
      // 파라미터 셋팅
      this.approveCode = this.instance.params.approveCode
      // 패키지예약 신청 목록 셋팅
      this.pkgPutInList = this.instance.params.pkgPutInList
      // 수정 상태 이며, 상태값이 신청인 경우
    } catch (e) {}
  },
  computed: {
  },
  methods: {
    /**
     * 패키지 조회 팝업 오픈
     */
    openPackagePopup (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/PackSearchPopup',
        params: {
          item: {
            packageNo: item.packageNo,
            rsvYn: 'Y',
            groupFlag: 'ota',
            isPartnerPackage: 'Y'
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'packageNo', params.data.packageNo)
              this.$set(this.form, 'packageName', params.data.packageName)
              this.$set(this.form, 'roomCount', params.data.roomCount)
              this.$set(this.form, 'nights', params.data.nights)
              this.$set(this.form, 'blockCode', params.data.blockCode)
              this.$set(this.form, 'saleStartDate', params.data.saleStartDate)
              this.$set(this.form, 'saleEndDate', params.data.saleEndDate)
              this.$set(this.form, 'todayRsvYn', params.data.todayRsvYn)
              this.$set(this.form, 'todayRsvTime', params.data.todayRsvTime)
              this.selectPkg = params.data
              this.storeList = []
              this.roomTypes = []
              this.selectPackageStoreList(params.data.packageNo)
            }
          }
        }
      })
    },
    /**
     * 객실패키지 영업장 정보 조회(객실유형 포함)
     * @param packageNo 선택 패키지번호
     */
    async selectPackageStoreList (packageNo) {
      const res = await packageService.selectPackageStoreList(packageNo)
      this.storeList = res.data
    },
    /**
     * 영업장 선택 이벤트
     * @param storeCode 선택 영업장코드
     */
    changeRmtypeCode (storeCode) {
      const index = this.storeList.findIndex(data => data.storeCode === storeCode)
      if (index > -1 && this.storeList[index].roomTypes) {
        this.roomTypes = []
        this.roomTypes = this.storeList[index].roomTypes
      }
    },
    /**
     * 등록 / 수정
     */
    async submit () {
      try {
        await this.validForm(this.$refs.form)
        // 영업장명 가져오기
        this.form.storeName = this.storeList.find(item => item.storeCode === this.form.storeCode).storeName
        // 객실유형명 가져오기
        this.form.roomTypeName = this.roomTypes.find(item => item.roomTypeCode === this.form.roomTypeCode).roomTypeName
        // 중복체크
        if (this.duplicateCheck(this.form)) {
          this.form.approveCode = this.approveCode
          this.close({
            data: this.form
          })
        }
      } catch (e) {}
    },
    /**
     * 중복체크
     */
    duplicateCheck (item) {
      for (const row of this.pkgPutInList) {
        if (row.packageNo === item.packageNo &&
              row.storeCode === item.storeCode &&
              row.roomTypeCode === item.roomTypeCode) {
          this.$dialog.alert('이미 등록된 패키지 정보입니다. 다른 패키지 정보로 시도해주세요.')
          return false
        }
      }
      return true
    }
  }
}
</script>
