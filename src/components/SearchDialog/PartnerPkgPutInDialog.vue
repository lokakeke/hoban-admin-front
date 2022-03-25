<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      패키지 등록
    </template>
    <v-form ref="form" lazy-validation >
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">패키지</div>
          <v-text-field v-model="form.pkgNm" dense
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
          <v-text-field v-model="form.rmCnt" dense
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
          <v-text-field v-model="form.rsvBlckCd" dense
                        placeholder="패키지를 선택 해주세요."
                        :rules="emptyRules"
                        readonly
                        disabled />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">영업장</div>
          <v-autocomplete v-model="form.storeCd" dense
                          autocomplete="off"
                          :items="storeList"
                          :item-value="'storeCd'"
                          :item-text="'storeNm'"
                          placeholder="영업장을 선택 해주세요."
                          :rules="emptyRules"
                          @change="changeRmtypeCd(form.storeCd)"
          />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">객실유형</div>
          <v-autocomplete v-model="form.rmTypeCd" dense
                          :items="rmTypeList"
                          :item-value="'rmTypeCd'"
                          :item-text="'rmTypeNm'"
                          placeholder="객실유형을 선택 해주세요."
                          :rules="emptyRules" />
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions v-if="this.aprlCd === '' || this.aprlCd === 'A'">
      <v-btn v-if="writeAuth" color="info" rounded @click="submit"><v-icon left>check</v-icon>등록 (F4)</v-btn>
      <v-btn color="primary" rounded @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import packageService from 'Api/modules/ota/package.service'

export default {
  extends: DialogBase,
  name: 'PartnerPkgPutInDialog',
  data () {
    return {
      // 파라미터
      form: {
        pkgNo: '',
        pkgNm: '',
        storeCd: '',
        storeNm: '',
        rmTypeCd: '',
        rmTypeNm: '',
        nights: '',
        rmCnt: '',
        aprlCd: '',
        saleBgnYmd: '',
        saleEndYmd: '',
        todayRsvYn: '',
        todayRsvTime: ''
      },
      // 예약가능 영업장 리스트
      storeList: [],
      // 예약가능 객실 리스트
      rmTypeList: [],
      // 신청 상태
      aprlCd: '',
      // 패키지예약 신청 목록
      pkgPutInList: []
    }
  },
  mounted () {
    try {
      // 파라미터 셋팅
      this.aprlCd = this.instance.params.aprlCd
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
            pkgNo: item.pkgNo,
            rsvYn: 'Y',
            groupFlag: 'ota',
            isPtnrPkg: 'Y'
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'pkgNo', params.data.pkgNo)
              this.$set(this.form, 'pkgNm', params.data.pkgNm)
              this.$set(this.form, 'rmCnt', params.data.rmCnt)
              this.$set(this.form, 'nights', params.data.stayNights)
              this.$set(this.form, 'rsvBlckCd', params.data.rsvBlckCd)
              this.$set(this.form, 'saleBgnYmd', params.data.saleBgnYmd)
              this.$set(this.form, 'saleEndYmd', params.data.saleEndYmd)
              this.$set(this.form, 'todayRsvYn', params.data.todayRsvYn)
              this.$set(this.form, 'todayRsvTime', params.data.todayRsvTime)
              this.selectPkg = params.data
              this.storeList = []
              this.rmTypeList = []
              this.selectPackageStoreList(params.data.pkgNo)
            }
          }
        }
      })
    },
    /**
     * 객실패키지 영업장 정보 조회(객실유형 포함)
     * @param pkgNo 선택 패키지번호
     */
    async selectPackageStoreList (pkgNo) {
      const res = await packageService.selectPackageStoreList(pkgNo)
      this.storeList = res.data
    },
    /**
     * 영업장 선택 이벤트
     * @param storeCd 선택 영업장코드
     */
    changeRmtypeCd (storeCd) {
      const index = this.storeList.findIndex(data => data.storeCd === storeCd)
      if (index > -1 && this.storeList[index].rmTypeList) {
        this.rmTypeList = []
        this.rmTypeList = this.storeList[index].rmTypeList
      }
    },
    /**
     * 등록 / 수정
     */
    async submit () {
      try {
        await this.validForm(this.$refs.form)
        // 영업장명 가져오기
        this.form.storeNm = this.storeList.find(item => item.storeCd === this.form.storeCd).storeNm
        // 객실유형명 가져오기
        this.form.rmTypeNm = this.rmTypeList.find(item => item.rmTypeCd === this.form.rmTypeCd).rmTypeNm
        // 중복체크
        if (this.duplicateCheck(this.form)) {
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
        if (row.pkgNo === item.pkgNo &&
              row.storeCd === item.storeCd &&
              row.rmTypeCd === item.rmTypeCd) {
          this.$dialog.alert('이미 등록된 패키지 정보입니다. 다른 패키지 정보로 시도해주세요.')
          return false
        }
      }
      return true
    }
  }
}
</script>
