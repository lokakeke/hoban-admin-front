<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      패키지 조회 (DGNS)
    </template>
    <v-card>
      <v-card-title>DGNS 패키지 마스터 정보</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="subtitle-1" cols="12">
            <v-row no-gutters>
              <v-col cols="12" lg="3" md="6" sm="12">패키지명 : {{ pkgMstInfo.pkgNm }} ({{ pkgMstInfo.pkgNo }})</v-col>
              <v-col cols="12" lg="3" md="6" sm="12">판매유형 : {{ pkgMstInfo.pkgSaleTypeNm }} ({{ pkgMstInfo.pkgSaleType }})</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">지불구분 : {{ pkgMstInfo.pkgPymtNm }} ({{ pkgMstInfo.pkgPymtInd }})</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">조식유무 : {{ pkgMstInfo.brkfstInYn === '1' ? '포함' : '미포함' }}</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">지역구분 : {{ pkgMstInfo.lcalNm }} ({{ pkgMstInfo.lcalCd }})</v-col>
              <v-col cols="12" lg="3" md="6" sm="12">시작/종료일 : {{ pkgTerm }}</v-col>
              <v-col cols="12" lg="3" md="6" sm="12">참고사항 : {{ pkgMstInfo.pkgReferMatter ? pkgMstInfo.pkgReferMatter : '-' }}</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">관리사번 : {{ pkgMstInfo.mngmEmplNo }}</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">회원구분 : {{ pkgMstInfo.memIndCd ? pkgMstInfo.memIndCd : '-' }}</v-col>
              <v-col cols="12" lg="2" md="6" sm="12">게시구분 : {{ pkgMstInfo.postInd ? pkgMstInfo.postInd : '-' }}</v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="pkgMstInfoTableHeaders"
                          :items="pkgMstMenuInfoList"
                          :no-data-text="'검색 결과가 없습니다.'"
                          class="bordered"
                          disable-pagination
                          hide-default-footer>
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
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'SearchDgnsDialog',
  data () {
    return {
      pkgNo: '',
      pkgMstInfoTableHeaders: [
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
      ],
      pkgMstMenuInfoList: [],
      pkgMstInfo: {}
    }
  },
  mounted () {
    this.pkgMstInfo = this.instance.params.pkgMstInfo
    this.pkgMstMenuInfoList = this.pkgMstInfo.packDgnsDetailList
  },
  computed: {
    pkgTerm () {
      return `${moment(this.pkgMstInfo.pkgBgnYmd).format('YYYY.MM.DD')} ~ ${moment(this.pkgMstInfo.pkgEndYmd).format('YYYY.MM.DD')}`
    }
  },
  methods: {
  }
}
</script>
