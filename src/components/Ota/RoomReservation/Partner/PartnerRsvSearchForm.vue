<template>
  <div :key="key">
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
            v-model="isBlockCode"
            label="예약블럭"
            false-value="N"
            true-value="Y"
            hide-details
          />
        </v-col>
        <v-col v-if="roomType.value === 'OTA_ROOM_API'" lg="2" md="3" cols="6">
          <v-text-field
            v-model="form.memberNo"
            label="회원번호"
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
            v-model="form.memberName"
            label="회원명"
            disabled
            clearable
            hide-details
          />
        </v-col>
        <v-col v-if="roomType.value === 'OTA_PKG_API'" lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.packageNo"
            label="패키지번호"
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
            v-model="form.packageName"
            label="패키지명"
            disabled
            clearable
            hide-details
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <date-range-picker
            v-model="form.checkInDate"
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
            v-model="form.partnerRsvNo"
            label="업체예약번호"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
     <v-row>
       <!--         <v-col lg="2" md="3" sm="4" cols="6">
                 <v-text-field
                   v-model="form.agentCode"
                   label="Agent코드"
                   clearable
                   hide-details
                   dense
                   :disabled="roomType.value != 'OTA_ROOM_API'"
                   @keypress.enter="openAgentPopup(form)"
                 >
                   <template v-slot:append>
                     <v-btn icon small color="primary" tabindex="-1" @click="openAgentPopup(form)">
                       <v-icon>search</v-icon>
                     </v-btn>
                   </template>
                 </v-text-field>
               </v-col>-->
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.storeCode"
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
            v-model="form.storeName"
            label="영업장명"
            disabled
            clearable
            hide-details
            dense
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.guestName"
            label="이용자명"
            clearable
            hide-details
            dense
          />
        </v-col>
        <v-col lg="2" md="3" sm="4" cols="6">
          <v-text-field
            v-model="form.guestTelNo"
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
<!--      <div class="v-input v-input&#45;&#45;hide-details theme&#45;&#45;light v-input&#45;&#45;selection-controls v-input&#45;&#45;checkbox pointer" @click="checkToggle(statusList)">
        <div class="v-input__slot">
          <div class="v-input&#45;&#45;selection-controls__input">
            <v-icon>{{checkAllList(statusList)}}</v-icon>
          </div>
          <div class="v-label theme&#45;&#45;light mr-2">전체 선택</div>
        </div>
      </div>
      <v-checkbox
        class="mr-2"
        v-for="(item, index) of statusList"
        :key="index"
        v-model="form.statusCode"
        :label="item.commonCodeName"
        :value="item.commonCode"
        dense
        multiple
        hide-details
      />-->
      <v-col align-self="center" class="text-right pa-0">
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
import commonService from '@/api/modules/system/commonCode.service'
import roomService from '@/api/modules/ota/roomReservation.service'
import partnerTermService from '@/api/modules/partner/partnerTerm.service'

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
    },
    /**
     * 파트너 정보
     */
    partnerInfo: {
      type: Object
    }
  },
  name: 'memberSearchForm',
  data () {
    return {
      form: {
        memberNo: '',
        memberName: '',
        packageNo: '',
        packageName: '',
        checkInDate: [moment().format('YYYYMMDD'), moment().add(30, 'day').format('YYYYMMDD')], // 오늘부터 30일
        rsvNo: '',
        keyRsvNo: '',
        agentCode: '',
        storeCode: '',
        storeName: '',
        guestName: '',
        guestTelNo: '',
        statusCode: []
      },
      checkAll: false, // 전체선택 default = false
      statusList: [], // 예약상태 목록
      isSearch: true,
      isBlockCode: 'N', // 예약블럭 검색 여부
      key: 0
    }
  },
  mounted () {
    this.setPartnerInfo()
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
          action: this.makeNew,
          param: 'ROOM'
        },
        {
          target: 'F6',
          multi: true,
          action: this.makeNew,
          param: 'PKG'
        }
      ]
    })
  },
  methods: {
    /**
     * 파트너 정보 세팅
     */
    setPartnerInfo () {
      this.$set(this.form, 'memberNo', this.partnerInfo.memberNo)
      this.$set(this.form, 'memberName', this.partnerInfo.memberName)
      this.$set(this.form, 'agentCode', this.partnerInfo.agentCode)
      this.$set(this.form, 'agentName', this.partnerInfo.agentName)
    },
    /**
     * 파트너 정보 세팅
     */
    setPartnerInfoPkg () {
      this.$set(this.form, 'agentCode', this.partnerInfo.agentCode)
      this.$set(this.form, 'agentName', this.partnerInfo.agentName)
    },
    /**
     * 객실 혹은 패키지 선택
     */
    changeType (type) {
      if (type === 'OTA_PKG_API') {
        this.form.memberNo = ''
        this.form.memberName = ''
        this.setPartnerInfoPkg() // agent코드 설정
      } else {
        this.form.packageNo = ''
        this.form.packageName = ''
        this.setPartnerInfo() // 회원번호 및 회원명 설정
      }
      this.$emit('change-type', type)
    },
    /**
     * 예약상태 리스트 체크박스 생성
     */
    checkAllList (param) {
      if (!param || !this.form.statusCode || this.form.statusCode.length === 0) {
        return 'check_box_outline_blank'
      } else if (param.length === this.form.statusCode.length) {
        return 'check_box'
      } else if (this.form.statusCode.length > 0) {
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
      } else if (!this.form.statusCode) {
        this.form.statusCode = []
        this.form.statusCode.push('RS')
        this.form.statusCode.push('CI')
      }
      if (param.length === this.form.statusCode.length) {
        this.form.statusCode = []
        this.form.statusCode.push('RS')
        this.form.statusCode.push('CI')
      } else {
        this.form.statusCode = param.map(data => {
          return data.commonCode
        })
      }
    },
    /**
     * 예약상태 리스트 조회
     */
    async selectCommTypeList () {
      const res = await commonService.selectPmsCommonCodeList('RSV0093')
      this.statusList = res.data
      for (const code of this.statusList) {
        if (code.item01 === 'Y') {
          this.form.statusCode.push(code.commonCode)
        }
      }
    },
    /**
     * 파트너 정보 검색
     */
    async searchPartnerInfo () {
      const q = {}
      q.taskType = this.roomType.value
      let memberNo = this.form.memberNo
      if (memberNo && memberNo.length === 6) {
        memberNo = memberNo + '00'
      }
      q.memberNo = memberNo
      const param = {}
      param.q = q
      const res = await partnerTermService.selectPartnerTermList(param)
      if (res.data && res.data.length === 1) {
        this.$set(this.form, 'memberNo', res.data[0].memberNo)
        this.$set(this.form, 'memberName', res.data[0].memberName)
        this.$set(this.form, 'partnerSeq', res.data[0].partnerSeq)
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
          memberNo: this.form.memberNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1500,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'memberNo', params.data.memberNo)
              this.$set(this.form, 'memberName', params.data.memberName)
              this.$set(this.form, 'partnerSeq', params.data.partnerSeq)
              this.form.storeCode = ''
              this.form.storeName = ''
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
      param.storeCode = item.storeCode
      param.useYn = 'Y'
      param.isNowSale = false
      const res = await roomService.selectStoreInfo(param)
      if (res.data && res.data.length === 1) {
        this.$set(item, 'storeCode', res.data[0].storeCode)
        this.$set(item, 'storeName', res.data[0].storeName)
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
              this.$set(item, 'storeCode', params.data.storeCode)
              this.$set(item, 'storeName', params.data.storeName)
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
              this.$set(this.form, 'agentCode', params.data.agentCode)
              this.$set(this.form, 'partnerSeq', params.data.partnerSeq)
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
            packageNo: item.packageNo,
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
              this.$set(this.form, 'packageNo', params.data.packageNo)
              this.$set(this.form, 'packageName', params.data.packageName)
              this.form.storeCode = ''
              this.form.storeName = ''
              this.key += 1
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
          this.form.memberNo = ''
          this.form.memberName = ''
          this.form.packageNo = ''
          this.form.packageName = ''
          this.form.checkInDate = [moment().format('YYYYMMDD'), moment().add(30, 'day').format('YYYYMMDD')]
          this.form.rsvNo = ''
          this.form.keyRsvNo = ''
          if (this.roomType.value === 'OTA_ROOM_API') { // 객실인 경우에만 agentCode 초기화
            this.form.agentCode = ''
          }
          this.form.storeCode = ''
          this.form.storeName = ''
          this.form.guestName = ''
          this.form.guestTelNo = ''
          this.form.statusCode = []
          this.form.statusCode.push('RS')
          this.form.statusCode.push('CI')
          this.form.statusCode.push('NS')
        } else { // 검색
          const searchForm = _.cloneDeep(this.searchParam)
          searchForm.page = 1
          if (this.isBlockCode === 'Y') {
            this.$set(this.form, 'blockCode', '104')
          } else {
            this.$set(this.form, 'blockCode', '')
          }
          this.form.roomType = this.roomType.value
          searchForm.q = this.form
          this.$emit('update:searchParam', searchForm)
          this.$emit('search')
        }
      })
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
