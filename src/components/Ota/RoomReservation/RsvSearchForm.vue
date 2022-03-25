<template>
  <div>
    <v-form @submit.prevent="{emit, exportExcel}" lazy-validation ref="form" autocomplete="off">
      <v-row>
        <v-col lg="1" md="2" sm="2" cols="3">
          <v-select
            :value="roomType"
            :items="roomTypeList"
            label="객실/패키지선택"
            hide-details
            hide-selected
            autocomplete="off"
            :rules="emptyRules"
            @change="changeType"
          />
        </v-col>
        <v-col lg="1" md="2" sm="2" cols="3">
          <v-checkbox
            v-model="isRsvBlckCd"
            label="예약블럭"
            false-value="N"
            true-value="Y"
            hide-details
          />
        </v-col>
        <v-col v-if="roomType.value === 'OTA_ROOM_API'" lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.memNo"
            label="회원번호/명"
            clearable
            hide-details
            @keypress.enter="searchPartnerInfo"
          >
            <template v-slot:append v-if="roomType.value === 'OTA_ROOM_API'">
              <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col v-if="roomType.value === 'OTA_ROOM_API'" lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.memNm"
            label="회원명"
            disabled
            clearable
            hide-details
          />
        </v-col>
        <v-col v-if="roomType.value === 'OTA_PKG_API'" lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.pkgNo"
            label="패키지번호/명"
            clearable
            hide-details
            @keypress.enter="openPackagePopup(form)"
          >
            <template v-slot:append v-if="roomType.value === 'OTA_PKG_API'">
              <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup(form)">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col v-if="roomType.value === 'OTA_PKG_API'" lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.pkgNm"
            label="패키지명"
            disabled
            clearable
            hide-details
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <date-range-picker
            v-model="form.ciDate"
            label="입실일자"
            hide-details
            hide-placeholder
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.rsvNo"
            label="예약번호"
            id="rsvNo"
            clearable
            hide-details
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.chainRsvNo"
            label="업체예약번호"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.agentCd"
            label="Agent코드"
            clearable
            hide-details
            dense
            @keypress.enter="openAgentPopup"
          >
            <template v-slot:append>
              <v-btn icon small color="primary" tabindex="-1" @click="openAgentPopup">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.storeCd"
            label="영업장코드/명"
            clearable
            hide-details
            dense
            @keypress.enter="searchStoreInfo(form)"
          >
            <template v-slot:append>
              <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup(form)">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.storeNm"
            label="영업장명"
            disabled
            clearable
            hide-details
            dense
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.guestNm"
            label="이용자명"
            clearable
            hide-details
            dense
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.smsPhone"
            label="이용자연락처"
            clearable
            hide-details
            dense
            v-mask="['###-####-####', '###-###-####']"
          >
            <template v-slot:append>
              <v-btn icon small disabled color="primary" tabindex="-1">
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.keyRsvNo"
            label="key예약번호"
            dense
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-form>
    <v-row no-gutters justify="space-between">
      <div class="v-input v-input--hide-details theme--light v-input--selection-controls v-input--checkbox pointer" @click="checkToggle(statusList)">
        <div class="v-input__slot">
          <div class="v-input--selection-controls__input">
            <v-icon>{{checkAllList(statusList)}}</v-icon>
          </div>
          <div class="v-label theme--light mr-2">전체 선택</div>
        </div>
      </div>
      <v-checkbox
        class="mr-2"
        v-for="(item, index) of statusList"
        :key="index"
        v-model="form.statusCd"
        :label="item.commCdNm"
        :value="item.commCd"
        dense
        multiple
        hide-details
      />
      <v-col align-self="center" class="text-right pl-0">
        <v-btn v-if="!isMultiCancel" outlined rounded color="blue" @click="makeNew">
          <v-icon left>edit</v-icon>신규(Ctrl+F5)
        </v-btn>
        <v-btn outlined rounded color="green" @click="exportExcel">
          <v-icon left>dashboard</v-icon>엑셀(F2)
        </v-btn>
        <v-btn outlined rounded color="green" @click="emit(true)">
          <v-icon left>refresh</v-icon>초기화(F4)
        </v-btn>
        <v-btn outlined rounded color="primary" @click="emit">
          <v-icon left>search</v-icon>검색(F3)
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import commonService from 'Api/modules/system/commonCode.service'
import roomService from 'Api/modules/ota/roomReservation.service'
import partnerTermService from 'Api/modules/partner/partnerTerm.service'

export default {
  props: {
    /**
     * 검색조건
     */
    searchParam: {
      type: Object
    },
    /**
     * 객실/패키지
     */
    roomType: {
      type: Object
    },
    /**
     * 객실/패키지 목록
     */
    roomTypeList: {
      type: Array
    },
    /**
     * 다건취소 여부
     */
    isMultiCancel: {
      type: Boolean
    }
  },
  name: 'memberSearchForm',
  data () {
    return {
      form: {
        memNo: '',
        memNm: '',
        pkgNo: '',
        pkgNm: '',
        ciDate: [moment().format('YYYYMMDD'), moment().add(30, 'day').format('YYYYMMDD')], // 오늘부터 30일
        rsvNo: '',
        keyRsvNo: '',
        agentCd: '',
        storeCd: '',
        storeNm: '',
        guestNm: '',
        smsPhone: '',
        statusCd: [],
        chainRsvNo: '' // 업체 예약번호
      },
      checkAll: false, // 전체선택 default = false
      statusList: [], // 예약상태 목록
      isSearch: true,
      isRsvBlckCd: 'N' // 예약블럭 검색 여부
    }
  },
  mounted () {
    this.selectCommTypeList()
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F2',
          action: this.exportExcel
        },
        {
          target: 'F3',
          action: this.emit
        },
        {
          target: 'F4',
          action: this.emit,
          param: true
        },
        {
          target: 'F5',
          multi: true,
          action: this.makeNew
        }
      ]
    })
  },
  methods: {
    /**
     * 객실 혹은 패키지 선택
     */
    changeType (type) {
      this.form.memNo = ''
      this.form.memNm = ''
      this.form.pkgNo = ''
      this.form.pkgNm = ''
      this.$emit('change-type', type)
    },
    /**
     * 예약상태 리스트 체크박스 생성
     */
    checkAllList (param) {
      if (!param || !this.form.statusCd || this.form.statusCd.length === 0) {
        return 'check_box_outline_blank'
      } else if (param.length === this.form.statusCd.length) {
        return 'check_box'
      } else if (this.form.statusCd.length > 0) {
        return 'indeterminate_check_box'
      }
    },
    /**
     * 예약상태의 '전체선택' 체크박스에 따른 처리
     */
    checkToggle (param) {
      // 초기화
      if (!param || param.length === 0) {
        return
      } else if (!this.form.statusCd) {
        this.form.statusCd = []
        this.form.statusCd.push('RS')
        this.form.statusCd.push('CI')
      }
      if (param.length === this.form.statusCd.length) {
        this.form.statusCd = []
        this.form.statusCd.push('RS')
        this.form.statusCd.push('CI')
      } else {
        this.form.statusCd = param.map(data => {
          return data.commCd
        })
      }
    },
    /**
     * 예약상태 리스트 조회
     */
    async selectCommTypeList () {
      const res = await commonService.selectDGNSCommonCodeList('RSV0093')
      this.statusList = res.data
      for (const code of this.statusList) {
        if (code.item01 === 'Y') {
          this.form.statusCd.push(code.commCd)
        }
      }
    },
    /**
     * 파트너 정보 검색
     */
    async searchPartnerInfo () {
      const q = {}
      q.taskType = this.roomType.value
      let memNo = this.form.memNo
      if (memNo && memNo.length === 6) {
        memNo = memNo + '00'
      }
      q.memNo = memNo
      const param = {}
      param.q = q
      const res = await partnerTermService.selectPartnerTermList(param)
      if (res.data && res.data.length === 1) {
        this.$set(this.form, 'memNo', res.data[0].memNo)
        this.$set(this.form, 'memNm', res.data[0].memNm)
        this.$set(this.form, 'ptnrNo', res.data[0].ptnrNo)
      } else {
        this.openPartnerInfo()
      }
    },
    /**
     * 회원번호/명 조회
     */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.roomType.value,
          memNo: this.form.memNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1500,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'memNo', params.data.memNo)
              this.$set(this.form, 'memNm', params.data.memNm)
              this.$set(this.form, 'ptnrNo', params.data.ptnrNo)
              this.form.storeCd = ''
              this.form.storeNm = ''
            }
          }
        }
      })
    },
    /**
     * 영업장번호/명 검색
     */
    async searchStoreInfo (item) {
      const param = {}
      param.storeCd = item.storeCd
      param.useYn = '1'
      const res = await roomService.selectStoreInfoForSearch(param)
      if (res.data && res.data.length === 1) {
        this.$set(item, 'storeCd', res.data[0].storeCd)
        this.$set(item, 'storeNm', res.data[0].storeNm)
      } else {
        this.openStorePopup(item)
      }
    },
    /**
     * 영업장번호/명 검색창 오픈
     */
    openStorePopup (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/StoreSearchPopup',
        params: {
          item: {
            itemInfo: item,
            isSearch: this.isSearch,
            roomType: this.roomType
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 900,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(item, 'storeCd', params.data.storeCd)
              this.$set(item, 'storeNm', params.data.storeNm)
            }
          }
        }
      })
    },
    /**
     * Agent코드 검색창 오픈
     */
    openAgentPopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.roomType.value
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'agentCd', params.data.agentCd)
              this.$set(this.form, 'ptnrNo', params.data.ptnrNo)
            }
          }
        }
      })
    },
    /**
     * 패키지코드/명 검색창 오픈
     */
    openPackagePopup (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/PackSearchPopup',
        params: {
          item: {
            pkgNo: item.pkgNo,
            groupFlag: 'ota',
            rsvYn: 'N'
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
              this.form.storeCd = ''
              this.form.storeNm = ''
            }
          }
        }
      })
    },
    /**
     * 초기화 및 검색
     */
    emit (isRefresh) {
      this.validForm(this.$refs.form).then(() => {
        if (isRefresh === true) { // 초기화
          this.form.memNo = ''
          this.form.memNm = ''
          this.form.pkgNo = ''
          this.form.pkgNm = ''
          this.form.ciDate = [moment().format('YYYYMMDD'), moment().add(30, 'day').format('YYYYMMDD')]
          this.form.rsvNo = ''
          this.form.keyRsvNo = ''
          this.form.agentCd = ''
          this.form.storeCd = ''
          this.form.storeNm = ''
          this.form.guestNm = ''
          this.form.smsPhone = ''
          this.form.chainRsvNo = ''
          this.form.statusCd = []
          this.form.statusCd.push('RS')
          this.form.statusCd.push('CI')
          this.form.statusCd.push('NS')
        } else { // 검색
          const searchForm = _.cloneDeep(this.searchParam)
          searchForm.page = 1
          if (this.isRsvBlckCd === 'Y') {
            this.$set(this.form, 'rsvBlckCd', '104')
          } else {
            this.$set(this.form, 'rsvBlckCd', '')
          }
          searchForm.q = this.form
          this.$emit('update:searchParam', searchForm)
          this.$emit('search')
        }
      })
    },
    /**
     * 신규
     */
    makeNew () {
      this.$emit('partner-new-rsv')
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      this.$emit('export')
    }
  }
}
</script>
