<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="4" class="pb-0">
        <v-text-field
          label="패키지번호"
          :rules="pkgNoRules"
          v-model="pkgNo"
          @keypress.enter="getPackageInfo"
        >
        </v-text-field>
      </v-col>
      <v-col align-self="center">
        <v-btn outlined rounded color="primary" @click="getPackageInfo">
          <v-icon>search</v-icon>검색
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="isPackageSearch">
      <v-row v-if="type === 'new'" no-gutters justify="space-between">
        <v-col cols="12">
          <v-alert dense outlined type="error">
            객실 선택 후 상품정보등록을 해주세요.
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-else no-gutters justify="space-between">
        <v-col cols="12">
          <v-alert dense outlined type="error">
            아래 정보 수정시 상품의 재고/가격이 DGNS 재고/가격 기준으로 일괄 변경됩니다.
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-card>
            <v-card-title class="font-weight-bold">패키지 마스터 정보</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-row class="subtitle-1">
                    <v-col cols="4">패키지명 : {{ packageMasterInfo.pkgNm }} ({{ packageMasterInfo.pkgNo }})</v-col>
                    <v-col cols="3">지역구분 : {{ packageMasterInfo.lcalNm }} ({{ packageMasterInfo.lcalCd }})</v-col>
                    <v-col cols="3">판매유형 : {{ packageMasterInfo.pkgSaleTypeNm }} ({{ packageMasterInfo.pkgSaleType }})</v-col>
                    <v-col cols="2">지불구분 : {{ packageMasterInfo.pkgPymtNm }} ({{ packageMasterInfo.pkgPymtInd }})</v-col>
                  </v-row>
                  <v-row class="subtitle-1">
                    <v-col cols="4">시작/종료일 : {{ pkgTerm }}</v-col>
                    <v-col cols="8">참고사항 : {{ packageMasterInfo.pkgReferMatter ? packageMasterInfo.pkgReferMatter : '-' }}</v-col>
                  </v-row>
                  <v-row class="subtitle-1">
                    <v-col cols="4">회원구분 : {{ packageMasterInfo.memIndCd ? packageMasterInfo.memIndCd : '-' }}</v-col>
                    <v-col cols="3">조식유무 : {{ packageMasterInfo.brkfstInYn === '1' ? '포함' : '미포함' }}</v-col>
                    <v-col cols="3">게시구분 : {{ packageMasterInfo.postInd ? packageMasterInfo.postInd : '-' }}</v-col>
                    <v-col cols="2">관리사번 : {{ packageMasterInfo.mngmEmplNo }}</v-col>
                  </v-row>
                </v-col>
                <v-card outlined>
                  <app-card col-classes="col-12" heading="패키지 메뉴">
                    <v-data-table
                      :no-data-text="'검색 결과가 없습니다.'"
                      :headers="headers"
                      :items="packageMasterInfoList"
                      hide-default-footer
                      disable-pagination
                      dense
                      class="bordered">
                      <template v-slot:item.pkgValidInd="{item}">
                        {{ item.pkgValidIndNm }} ({{ item.pkgValidIndCd }})
                      </template>
                      <template v-slot:item.dstbAmt="{item}">
                        {{ item.dstbAmt ? item.dstbAmt : '-' }}
                      </template>
                      <template v-slot:item.tableInd="{item}">
                        {{ item.tableIndNm }} ({{ item.tableIndCd }})
                      </template>
                      <template v-slot:item.grupIssue="{item}">
                        {{ item.grupIssue ? item.grupIssue : '-' }}
                      </template>
                      <template v-slot:item.etc01="{item}">
                        {{ item.etc01 ? item.etc01 : '-' }}
                      </template>
                      <template v-slot:item.etc02="{item}">
                        {{ item.etc02 ? item.etc02 : '-' }}
                      </template>
                      <template v-slot:item.useLcalCd="{item}">
                        {{ item.useLcalCd ? item.useLcalCd : '-' }}
                      </template>
                    </v-data-table>
                  </app-card>
                </v-card>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <package-room-info-component v-if="isPackageSearch"
                                 :dmStoreId="dmStoreId"
                                 :isPackageSearch="isPackageSearch"
                                 :pkgNo="pkgNo"
                                 :originRoomInfo="originRoomInfo"
                                 :pkgNm="packageMasterInfo.pkgNm"
                                 :type="type"
    ></package-room-info-component>
  </v-container>
</template>

<script>

import itemService from "Api/modules/naver/item.service"
import PackageRoomInfoComponent from "./PackageRoomInfoComponent"

export default {
  name: 'PackageInfoComponent',
  components: {
    PackageRoomInfoComponent
  },
  props: {
    dmStoreId: {
      type: String,
      required: true
    },
    originRoomInfo: {},
    viewPkgNo: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'new'
    },
    isValidPkg: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      pkgNo: '',
      packageMasterInfo: {},
      packageMasterInfoList: [],
      isPackageSearch: false,
      pkgNoRules: [
        value => !!value || '패키지번호를 입력해주세요.',
        value => {
          const pattern = /^[0-9]+$/g
          return pattern.test(value) || '숫자만 입력할 수 있습니다.'
        }
      ],
      headers: [
        { text: '패키지 메뉴순번', value: 'pkgMenuSeq', align: 'center', sortable: false },
        { text: '인원수량', value: 'persQty', align: 'center', sortable: false },
        { text: '패키지 메뉴명', value: 'pkgMenuNm', align: 'center', sortable: false },
        { text: '패키지 유효구분', value: 'pkgValidInd', align: 'center', sortable: false },
        { text: '패키지 유효기간', value: 'pkgVaildThru', align: 'center', sortable: false },
        { text: '배분금액', value: 'dstbAmt', align: 'center', sortable: false },
        { text: '테이블 구분', value: 'tableInd', align: 'center', sortable: false },
        { text: '적용사용일', value: 'applyUseDd', align: 'center', sortable: false },
        { text: '추가적용인원', value: 'addApplyPers', align: 'center', sortable: false },
        { text: '그룹발권', value: 'grupIssue', align: 'center', sortable: false },
        { text: '비고01', value: 'etc01', align: 'center', sortable: false },
        { text: '비고02', value: 'etc02', align: 'center', sortable: false },
        { text: '패키지메뉴오픈여부', value: 'pkgMenuOpen', align: 'center', sortable: false },
        { text: '사용가능지역', value: 'useLcalCd', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    pkgTerm () {
      return `${moment(this.packageMasterInfo.pkgBgnYmd).format('YYYY.MM.DD')} ~ ${moment(this.packageMasterInfo.pkgEndYmd).format('YYYY.MM.DD')}`
    }
  },
  watch: {
    viewPkgNo (value) {
      this.pkgNo = _.cloneDeep(value)
      this.$nextTick(() => {
        this.getPackageInfo()
      })
    }
  },
  methods: {
    validatePackageNumber () {
      const pattern = /^[0-9]+$/g
      if (!this.pkgNo) {
        this.$dialog.alert('패키지번호를 입력해주세요.')
        return false
      } else if (!pattern.test(this.pkgNo)) {
        this.$dialog.alert('유효하지 않은 패키지번호입니다.')
        return false
      }
      return true
    },
    getPackageInfo () {
      this.isPackageSearch = false
      if (!this.validatePackageNumber()) {
        this.$store.dispatch('naver/setRoomInfo', {
          mid: this.pkgNo,
          storeCd: '',
          rmTypeCd: '',
          rsvBlckCd: ''
        })
        return
      }
      // 수정일 경우
      if (this.viewPkgNo !== this.pkgNo) {
        this.$store.dispatch('naver/setRoomInfo', {
          mid: this.pkgNo,
          storeCd: '',
          rmTypeCd: '',
          rsvBlckCd: ''
        })
      } else {
        // pkgNo 가 같을 경우 기존 데이터로 원복
        this.$store.dispatch('naver/setRoomInfo', {
          mid: this.pkgNo,
          storeCd: this.originRoomInfo.storeCd,
          rmTypeCd: this.originRoomInfo.rmTypeCd,
          rsvBlckCd: this.originRoomInfo.rsvBlckCd
        })
      }
      itemService.selectPackageMasterInfo(this.pkgNo).then((response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          this.packageMasterInfo = response.data
          this.packageMasterInfoList = this.packageMasterInfo.packDgnsDetailList
          this.isPackageSearch = true
          this.$emit('update:isValidPkg', true)
        } else {
          this.$dialog.alert('검색 결과가 존재하지 않습니다.')
          this.$emit('update:isValidPkg', false)
        }
      }).catch(() => {
      })
    }
  },
  mounted () {
    if (this.viewPkgNo) {
      this.pkgNo = _.cloneDeep(this.viewPkgNo)
      this.$nextTick(() => {
        this.getPackageInfo()
      })
    }
  }
}
</script>
