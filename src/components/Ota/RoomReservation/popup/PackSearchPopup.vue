<template>
  <dialog-base :instance="instance" :title="'패키지 조회'">
    <v-form v-if="!isPartner" ref="form" lazy-validation autocomplate="off">
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination/>
      <v-row>
        <v-col>
          <v-simple-table v-if="groupFlag === 'ota'" class="click-row">
            <thead>
            <tr>
              <th class="text-center">지역멱(코드)</th>
              <th class="text-center">영업장명</th>
              <th class="text-center">패키지번호</th>
              <th class="text-center">패키지명</th>
              <th class="text-center">판매시작일</th>
              <th class="text-center">판매종료일</th>
              <th class="text-center">사용여부</th>
            </tr>
            </thead>
            <tbody v-if="!packageList || packageList.length === 0">
              <tr>
                <td colspan="7" class="text-center py-2">데이터가 없습니다.</td>
              </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in packageList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" v-if="pack.topLine" :rowspan="pack.rnum" :class="pack.topLine ? 'top-border' : ''">{{ pack.localName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''" v-html="pack.storeNames"/>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleStartDate }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleEndDate }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''"><v-simple-checkbox v-model="pack.flag" disabled/></td>
            </tr>
            </tbody>
          </v-simple-table>
          <v-simple-table v-if="groupFlag === 'naver'" class="click-row">
            <thead>
            <tr>
              <th class="text-center">패키지번호</th>
              <th class="text-center">패키지명</th>
              <th class="text-center">영업장명(코드)</th>
              <th class="text-center">객실유형명(코드)</th>
              <th class="text-center">판매시작일</th>
              <th class="text-center">판매종료일</th>
              <th class="text-center">블럭코드</th>
            </tr>
            </thead>
            <tbody v-if="!packageList || packageList.length === 0">
            <tr>
              <td colspan="7" class="text-center py-2">데이터가 없습니다.</td>
            </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in packageList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.processedStoreName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.roomTypeName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleStartDate }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleEndDate }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.blockCode }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <search-form v-if="isPartner" :search-param.sync="searchParam" :search-list="ptnrSearchList" @search="search" disable-pagination/>
    <v-form v-if="isPartner" ref="form" lazy-validation autocomplate="off">
      <v-row>
        <v-col>
          <v-simple-table class="click-row">
            <thead>
            <tr>
              <th class="text-center">지역멱(코드)</th>
              <th class="text-center">영업장명</th>
              <th class="text-center">패키지번호</th>
              <th class="text-center">패키지명</th>
              <th class="text-center">패키지설명</th>
            </tr>
            </thead>
            <tbody v-if="!packageList || packageList.length === 0">
            <tr>
              <td colspan="5" class="text-center py-2">데이터가 없습니다.</td>
            </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in packageList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" v-if="pack.topLine" :rowspan="pack.rnum" :class="pack.topLine ? 'top-border' : ''">{{ pack.localName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''" v-html="pack.storeNames"/>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.packageName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">
                <v-tooltip v-if="pack.packageDesc" top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ pack.packageDesc }}</span>
                  </template>
                  <span>{{ pack.pkgFullDesc }}</span>
                </v-tooltip>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import roomService from '@/api/modules/ota/roomReservation.service'

import {mapGetters} from 'vuex'

export default {
  extends: DialogBase,
  name: 'PackSearchPopup',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      useList: [
        { code: '전체', value: null },
        { code: '사용', value: 'Y' },
        { code: '미사용', value: 'N' }
      ],
      packageList: [],
      filterText: '',
      rsvYn: '',
      todayYn: '',
      packageNo: '',
      groupList: [
        { code: 'OTA', value: 'ota' },
        { code: '네이버', value: 'naver' }
      ],
      groupFlag: '',
      isPartnerPackage: '',
      searchForm: {},
      color: ['amber lighten-5', 'blue lighten-5', 'pink lighten-5', 'green lighten-5']
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    searchList () {
      return [
        {
          key: 'group',
          label: 'OTA/네이버',
          type: 'select',
          list: this.groupList,
          listText: 'code',
          listValue: 'value',
          defaultValue: this.groupFlag === 'ota' ? this.groupList[0].value : this.groupList[1].value,
          disabled: this.isPartnerPackage === 'Y' || this.todayYn === 'Y',
          cols: 3
        },
        {
          key: 'storeName',
          label: '영업장명',
          type: 'text',
          cols: 3
        },
        {
          key: 'packageNo',
          label: '패키지명/No',
          type: 'text',
          defaultValue: _.cloneDeep(this.instance.params.item.packageNo),
          cols: 3
        },
        {
          key: 'useYn',
          label: '사용여부',
          type: 'select',
          list: this.useList,
          listText: 'code',
          listValue: 'value',
          defaultValue: this.useList[0].value,
          disabled: this.rsvYn === 'Y',
          cols: 3
        }
      ]
    },
    ptnrSearchList () {
      return [
        {
          key: 'localName',
          label: '지역명',
          type: 'text',
          cols: 3
        },
        {
          key: 'storeName',
          label: '영업장명',
          type: 'text',
          cols: 3
        },
        {
          key: 'packageNo',
          label: '패키지명/No',
          type: 'text',
          defaultValue: _.cloneDeep(this.instance.params.item.packageNo),
          cols: 3
        }
      ]
    }
  },
  mounted () {
    this.groupFlag = _.cloneDeep(this.instance.params.item.groupFlag) // ota OR naver
    this.packageNo = _.cloneDeep(this.instance.params.item.packageNo)
    this.rsvYn = _.cloneDeep(this.instance.params.item.rsvYn) // 예약인 경우 Y, 검색인 경우 N
    this.todayYn = _.cloneDeep(this.instance.params.item.todayYn) // 당일예약패키지인 경우 Y
    this.isPartnerPackage = _.cloneDeep(this.instance.params.item.isPartnerPackage) // 파트너 패키지 팝업에서 패키지 조회 하는 경우 Y
    this.search()
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F3',
          action: this.search
        }
      ]
    })
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const param = {}
      if (this.isPartner) { // 파트너
        // 지역명
        if (this.searchForm.localName) {
          param.localName = this.searchForm.localName
        }
        if (this.searchParam.q.localName) {
          param.localName = this.searchParam.q.localName
        }
        // 영업장명
        if (this.searchForm.storeName) {
          param.storeName = this.searchForm.storeName
        }
        if (this.searchParam.q.storeName) {
          param.storeName = this.searchParam.q.storeName
        }
        // 패키지 번호/명 세팅
        if (this.searchParam.q.packageNo) {
          param.packageNo = this.searchParam.q.packageNo
        }
        param.isPartner = this.isPartner
        param.rsvYn = this.rsvYn
        param.partnerSeq = Number(this.user.number)

        const res = await roomService.selectPkgInfo(param)
        this.noPackageList(res.data)
      } else { // 관리자
        this.packageList = [] // 기존 목록 초기화
        if (this.searchParam.q.group && this.searchParam.q.group === this.groupList[1].value) {
          this.groupFlag = this.groupList[1].value
        } else if (this.searchParam.q.group && this.searchParam.q.group === this.groupList[0].value) {
          this.groupFlag = this.groupList[0].value
        }
        // 패키지 번호/명 세팅
        if (this.searchParam.q.packageNo) {
          param.packageNo = this.searchParam.q.packageNo
        }
        // 영업장명 세팅
        if (this.searchParam.q.storeName) {
          param.storeName = this.searchParam.q.storeName
        }
        // 사용여부 세팅
        if (this.searchParam.q.useYn) {
          param.useYn = this.searchParam.q.useYn
        }
        if (this.groupFlag === 'ota') {
          param.isPartner = this.isPartner
          param.rsvYn = this.rsvYn
          // 예약화면에서 팝업창을 여는 경우 무조건 사용가능한 패키지만 노출
          if (param.rsvYn === 'Y') {
            param.useYn = 'Y'
          }
          if (this.isPartner) {
            param.partnerSeq = this.user.number
          }
          // 당일예약가능 패키지
          if (this.todayYn) {
            param.todayYn = this.todayYn
          }
          // 패키지 조회
          const res = await roomService.selectPkgInfo(param)
          this.noPackageList(res.data)
        } else { // 네이버 패키지 조회
          const res = await roomService.selectNaverPkgInfo(param)
          this.noPackageList(res.data)
        }
      }
    },
    /**
     * 1개의 패키지 선택
     */
    choosePkg (row) {
      let group = ''
      this.searchParam.q.group ? group = this.searchParam.q.group : group = this.groupFlag
      this.close({
        data: row,
        group: group
      })
    },
    /**
     * 화면에 보여줄 형태로 가공
     */
    noPackageList (param) {
      this.packageList = param
      if (param && param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
      } else if (param && param.length === 10) { // TODO KKKK
        this.choosePkg(param[0])
      } else {
        if (this.groupFlag === 'ota') {
          this.addCheckBox(this.packageList)
          let colorNum = 0
          let topLine = false
          let localCode = ''
          for (let i = 0; i < this.packageList.length; i++) {
            topLine = false // 구분선 초기화
            // storeName이 있는 경우 ,를 넣어 가공
            if (this.packageList[i].storeNames) {
              let storeName = ''
              const arr = this.packageList[i].storeNames.split(',')
              for (let i = 0; i < arr.length; i++) {
                storeName = storeName + arr[i] + '<br/>'
              }
              this.packageList[i].storeNames = storeName
            }
            if (this.packageList[i].localCode !== localCode) {
              colorNum++
              if (colorNum === this.color.length) colorNum = 0
              localCode = this.packageList[i].localCode
              topLine = true
            }
            this.packageList[i].topLine = topLine // 지역코드가 달라질 경우 구분선 추가
            this.packageList[i].color = this.color[colorNum] // 배경색 추가
            this.packageList[i].localName = this.packageList[i].localName + '(' + this.packageList[i].localCode + ')'
            this.packageList[i].saleStartDate = moment(this.packageList[i].saleStartDate).format('YYYY-MM-DD')
            this.packageList[i].saleEndDate = moment(this.packageList[i].saleEndDate).format('YYYY-MM-DD')
            if (this.isPartner) {
              this.packageList[i].pkgFullDesc = this.packageList[i].packageDesc
              this.packageList[i].packageDesc = this.packageList[i].packageDesc.substring(0, 30)
            }
          }
        } else { // 네이버
          let colorNum = 0
          let topLine = false
          let storeCode = ''
          for (let i = 0; i < this.packageList.length; i++) {
            topLine = false // 구분선 초기화
            if (this.packageList[i].storeCode !== storeCode) {
              colorNum++
              if (colorNum === this.color.length) colorNum = 0
              storeCode = this.packageList[i].storeCode
              topLine = true
            }
            this.packageList[i].topLine = topLine // 영업장코드가 달라질 경우 구분선 추가
            this.packageList[i].color = this.color[colorNum] // 배경색 추가
            this.packageList[i].processedStoreName = this.packageList[i].storeName + '(' + this.packageList[i].storeCode + ')'
            this.packageList[i].roomTypeName = this.packageList[i].roomTypeName + '(' + this.packageList[i].roomTypeCode + ')'
            this.packageList[i].saleStartDate = moment(this.packageList[i].saleStartDate).format('YYYY-MM-DD')
            this.packageList[i].saleEndDate = moment(this.packageList[i].saleEndDate).format('YYYY-MM-DD')
          }
        }
      }
    },
    /**
     * 사용여부 체크박스 생성
     */
    addCheckBox (items) {
      for (const item of items) {
        item.useYn === 'Y' ? item.flag = true : item.flag = false
      }
    }
  }
}
</script>

<style scoped>
  td.top-border {
    border-top: #323440 solid 2px!important;
  }
</style>
