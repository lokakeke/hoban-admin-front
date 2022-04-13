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
            <tbody v-if="!pkgList || pkgList.length === 0">
              <tr>
                <td colspan="7" class="text-center py-2">데이터가 없습니다.</td>
              </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in pkgList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" v-if="pack.topLine" :rowspan="pack.rnum" :class="pack.topLine ? 'top-border' : ''">{{ pack.lcalName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''" v-html="pack.storeNames"/>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleBgnYmd }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleEndYmd }}</td>
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
            <tbody v-if="!pkgList || pkgList.length === 0">
            <tr>
              <td colspan="7" class="text-center py-2">데이터가 없습니다.</td>
            </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in pkgList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.processedStoreName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.rmTypeName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleBgnYmd }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.saleEndYmd }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.rsvBlckCd }}</td>
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
            <tbody v-if="!pkgList || pkgList.length === 0">
            <tr>
              <td colspan="5" class="text-center py-2">데이터가 없습니다.</td>
            </tr>
            </tbody>
            <tbody else>
            <tr v-for="(pack, index) in pkgList" :key="index" @click="choosePkg(pack)" :class="pack.color">
              <td class="text-center" v-if="pack.topLine" :rowspan="pack.rnum" :class="pack.topLine ? 'top-border' : ''">{{ pack.lcalName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''" v-html="pack.storeNames"/>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgNo }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">{{ pack.pkgName }}</td>
              <td class="text-center" :class="pack.topLine ? 'top-border' : ''">
                <v-tooltip v-if="pack.pkgDesc" top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ pack.pkgDesc }}</span>
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

import { mapGetters } from 'vuex'

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
      pkgList: [],
      filterText: '',
      rsvYn: '',
      todayYn: '',
      pkgNo: '',
      groupList: [
        { code: 'OTA', value: 'ota' },
        { code: '네이버', value: 'naver' }
      ],
      groupFlag: '',
      workStatus: '',
      isPtnrPkg: '',
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
          disabled: this.workStatus === 'update' || this.isPtnrPkg === 'Y' || this.todayYn === 'Y',
          cols: 3
        },
        {
          key: 'storeName',
          label: '영업장명',
          type: 'text',
          cols: 3
        },
        {
          key: 'pkgNo',
          label: '패키지명/No',
          type: 'text',
          defaultValue: _.cloneDeep(this.instance.params.item.pkgNo),
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
          key: 'lcalName',
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
          key: 'pkgNo',
          label: '패키지명/No',
          type: 'text',
          defaultValue: _.cloneDeep(this.instance.params.item.pkgNo),
          cols: 3
        }
      ]
    }
  },
  mounted () {
    this.groupFlag = _.cloneDeep(this.instance.params.item.groupFlag) // ota OR naver
    this.pkgNo = _.cloneDeep(this.instance.params.item.pkgNo)
    this.rsvYn = _.cloneDeep(this.instance.params.item.rsvYn) // 예약인 경우 Y, 검색인 경우 N
    this.todayYn = _.cloneDeep(this.instance.params.item.todayYn) // 당일예약패키지인 경우 Y
    this.workStatus = _.cloneDeep(this.instance.params.item.workStatus)
    this.isPtnrPkg = _.cloneDeep(this.instance.params.item.isPtnrPkg) // 파트너 패키지 팝업에서 패키지 조회 하는 경우 Y
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
        if (this.searchForm.lcalName) {
          param.lcalName = this.searchForm.lcalName
        }
        if (this.searchParam.q.lcalName) {
          param.lcalName = this.searchParam.q.lcalName
        }
        // 영업장명
        if (this.searchForm.storeName) {
          param.storeName = this.searchForm.storeName
        }
        if (this.searchParam.q.storeName) {
          param.storeName = this.searchParam.q.storeName
        }
        // 패키지 번호/명 세팅
        if (this.searchParam.q.pkgNo) {
          param.pkgNo = this.searchParam.q.pkgNo
        }
        param.isPartner = this.isPartner
        param.rsvYn = this.rsvYn
        param.partnerSeq = this.user.number

        const res = await roomService.selectPkgInfo(param)
        this.noPkgList(res.data)
      } else { // 관리자
        this.pkgList = [] // 기존 목록 초기화
        if (this.searchParam.q.group && this.searchParam.q.group === this.groupList[1].value) {
          this.groupFlag = this.groupList[1].value
        } else if (this.searchParam.q.group && this.searchParam.q.group === this.groupList[0].value) {
          this.groupFlag = this.groupList[0].value
        }
        // 패키지 번호/명 세팅
        if (this.searchParam.q.pkgNo) {
          param.pkgNo = this.searchParam.q.pkgNo
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
          this.noPkgList(res.data)
        } else { // 네이버 패키지 조회
          const res = await roomService.selectNaverPkgInfo(param)
          this.noPkgList(res.data)
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
    noPkgList (param) {
      this.pkgList = param
      if (param && param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
      } else if (param && param.length === 1) {
        this.choosePkg(param[0])
      } else {
        if (this.groupFlag === 'ota') {
          this.addCheckBox(this.pkgList)
          let colorNum = 0
          let topLine = false
          let localCd = ''
          for (let i = 0; i < this.pkgList.length; i++) {
            topLine = false // 구분선 초기화
            // storeName이 있는 경우 ,를 넣어 가공
            if (this.pkgList[i].storeNames) {
              let storeName = ''
              const arr = this.pkgList[i].storeNames.split(',')
              for (let i = 0; i < arr.length; i++) {
                storeName = storeName + arr[i] + '<br/>'
              }
              this.pkgList[i].storeNames = storeName
            }
            if (this.pkgList[i].lcalCd !== localCd) {
              colorNum++
              if (colorNum === this.color.length) colorNum = 0
              localCd = this.pkgList[i].lcalCd
              topLine = true
            }
            this.pkgList[i].topLine = topLine // 지역코드가 달라질 경우 구분선 추가
            this.pkgList[i].color = this.color[colorNum] // 배경색 추가
            this.pkgList[i].lcalName = this.pkgList[i].lcalName + '(' + this.pkgList[i].lcalCd + ')'
            this.pkgList[i].saleBgnYmd = moment(this.pkgList[i].saleBgnYmd).format('YYYY-MM-DD')
            this.pkgList[i].saleEndYmd = moment(this.pkgList[i].saleEndYmd).format('YYYY-MM-DD')
            if (this.isPartner) {
              this.pkgList[i].pkgFullDesc = this.pkgList[i].pkgDesc
              this.pkgList[i].pkgDesc = this.pkgList[i].pkgDesc.substring(0, 30)
            }
          }
        } else { // 네이버
          let colorNum = 0
          let topLine = false
          let storeCd = ''
          for (let i = 0; i < this.pkgList.length; i++) {
            topLine = false // 구분선 초기화
            if (this.pkgList[i].storeCd !== storeCd) {
              colorNum++
              if (colorNum === this.color.length) colorNum = 0
              storeCd = this.pkgList[i].storeCd
              topLine = true
            }
            this.pkgList[i].topLine = topLine // 영업장코드가 달라질 경우 구분선 추가
            this.pkgList[i].color = this.color[colorNum] // 배경색 추가
            this.pkgList[i].processedStoreName = this.pkgList[i].storeName + '(' + this.pkgList[i].storeCd + ')'
            this.pkgList[i].rmTypeName = this.pkgList[i].rmTypeName + '(' + this.pkgList[i].rmTypeCd + ')'
            this.pkgList[i].saleBgnYmd = moment(this.pkgList[i].saleBgnYmd).format('YYYY-MM-DD')
            this.pkgList[i].saleEndYmd = moment(this.pkgList[i].saleEndYmd).format('YYYY-MM-DD')
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
