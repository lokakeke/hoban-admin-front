<template>
  <dialog-base :instance="instance" :title="'패키지 조회'">
    <v-form v-if="!isPartner" ref="form" lazy-validation autocomplate="off">
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination/>
      <v-row>
        <v-col>
          <v-data-table title="코드 목록" :headers="headers" :items="pkgList" @click:row="choosePkg($event)" disable-sort :no-data-text="'검색 결과가 없습니다.'">
            <template v-slot:item.useYn="{ item }">
              <v-simple-checkbox v-model="item.flag" disabled/>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-form v-if="isPartner" ref="form" lazy-validation autocomplate="off">
      <v-row>
        <v-col class="pt-0"></v-col>
        <v-col class="pt-0">
          <v-text-field v-model="filterText" class="mb-1" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table title="코드 목록" :headers="ptnrHeaders" :items="filterList" @click:row="choosePkg($event)" disable-sort :no-data-text="'검색 결과가 없습니다.'"/>
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
  name: 'RsvTypePackSearchPopup',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        {
          text: 'No',
          value: 'number',
          align: 'center',
          width: '10%'
        },
        {
          text: '패키지번호',
          value: 'packageNo',
          align: 'center',
          width: '10%'
        },
        {
          text: '패키지명',
          value: 'packageName',
          align: 'center',
          width: '50%'
        },
        {
          text: '판매시작일',
          value: 'saleStartDate',
          align: 'center',
          width: '10%'
        },
        {
          text: '판매종료일',
          value: 'saleEndDate',
          align: 'center',
          width: '10%'
        },
        {
          text: '사용여부',
          value: 'useYn',
          align: 'center',
          width: '10%'
        }
      ],
      ptnrHeaders: [
        {
          text: 'No',
          value: 'number',
          align: 'center',
          width: '10%'
        },
        {
          text: '패키지번호',
          value: 'packageNo',
          align: 'center',
          width: '10%'
        },
        {
          text: '패키지명',
          value: 'packageName',
          align: 'center',
          width: '40%'
        },
        {
          text: '패키지설명',
          value: 'pkgDesc',
          align: 'center',
          width: '40%'
        }
      ],
      useList: [
        { code: '전체', value: null },
        { code: '사용', value: 'Y' },
        { code: '미사용', value: 'N' }
      ],
      rsvInfo: {},
      pkgList: [],
      filterText: ''
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    searchList () {
      return [
        {
          key: 'packageNo',
          label: '패키지명/No',
          type: 'text',
          cols: 4
        },
        {
          key: 'useYn',
          label: '사용여부',
          type: 'select',
          list: this.useList,
          listText: 'code',
          listValue: 'value',
          defaultValue: this.useList[0].value,
          cols: 4
        }
      ]
    },
    filterList () {
      if (this.pkgList && this.pkgList.length > 0) {
        if (this.filterText) {
          return this.pkgList.filter(data => data.packageNo.indexOf(this.filterText) !== -1 || data.packageName.indexOf(this.filterText) !== -1 || data.pkgDesc.indexOf(this.filterText) !== -1)
        } else {
          return this.pkgList
        }
      } else {
        return []
      }
    }
  },
  mounted () {
    this.rsvInfo = _.cloneDeep(this.instance.params.item)
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      // 전체 패키지 조회
      const param = {}
      if (this.rsvInfo.packageNo) { // 기존 패키지 번호
        param.originPackageNo = this.rsvInfo.packageNo
      }
      if (this.searchParam.q.packageNo) { // 신규 패키지 번호
        param.packageNo = this.searchParam.q.packageNo
      }
      if (this.isPartner) { // 파트너인 경우
        param.partnerSeq = this.user.number
      }
      param.storeCode = this.rsvInfo.storeCode
      param.roomTypeCode = this.rsvInfo.roomTypeCode
      param.nights = this.rsvInfo.nights
      param.roomCount = this.rsvInfo.roomCount
      param.checkInDate = this.rsvInfo.checkInDate
      // 사용여부(기본값은 사용(Y))
      this.searchParam.q.useYn ? param.useYn = this.searchParam.q.useYn : param.useYn = 'Y'
      const res = await roomService.selectPkgInfoForRsvTypeChange(param)
      this.noPkgList(res.data)
    },
    /**
     * 1개의 패키지 선택
     */
    choosePkg (row) {
      this.close({ data: row })
    },
    /**
     * 화면에 보여줄 형태로 가공
     */
    noPkgList (param) {
      this.pkgList = param
      if (param && param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
      } else {
        this.addCheckBox(this.pkgList)
        for (let i = 1; i < this.pkgList.length + 1; i++) {
          this.pkgList[i - 1].number = i
          this.pkgList[i - 1].saleStartDate = moment(this.pkgList[i - 1].saleStartDate).format('YYYY-MM-DD')
          this.pkgList[i - 1].saleEndDate = moment(this.pkgList[i - 1].saleEndDate).format('YYYY-MM-DD')
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
