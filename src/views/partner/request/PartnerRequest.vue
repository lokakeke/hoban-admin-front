<template>
  <v-row wrap>
    <app-card :heading="'파트너 위약취소환불 신청 리스트'" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="selectPartnerRequestList"
      ></search-form>
      <v-data-table
        :no-data-text="emptyText"
        :headers="headers"
        :items="list"
        item-key="rowSeq"
        hide-default-footer
        disable-pagination
        disable-sort
        v-dragscroll="{target: '.v-data-table__wrapper'}"
        @click:row="open"
        class="click-row bordered"
      >
        <template v-slot:item.keyRsvNo="{item}">
          <v-row v-if="!!item.keyRsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
            <v-btn small color="info" text block><v-icon small>search</v-icon>{{item.keyRsvNo}}</v-btn>
          </v-row>
          <span v-else>없음</span>
        </template>
        <template v-slot:[`item.crtDt`]="{item}">
          {{ item.crtDt | dateSet }}
        </template>
      </v-data-table>
      <v-row>
        <v-col cols="12" class="text-right pb-0" v-if="isPartner && writeAuth">
          <v-btn rounded color="info" @click="openCreatePartnerRequestDialog">
            <v-icon left>add</v-icon>신규 신청 (F2)
          </v-btn>
        </v-col>
      </v-row>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="selectPartnerRequestList"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import partnerRequestService from 'Api/modules/partner/partnerRequest.service'

export default {
  name: 'PartnerRequest',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      list: [],
      state: [],
      headers: [
        {
          text: '요청번호',
          value: 'requestSeq',
          align: 'center'
        },
        {
          text: '요청유형',
          value: 'requestTypeNm',
          align: 'center'
        },
        {
          text: '상태',
          value: 'aprlNm',
          align: 'center'
        },
        {
          text: '요청제목',
          value: 'title',
          align: 'center'
        },
        {
          text: 'KEY예약번호',
          value: 'keyRsvNo',
          align: 'center'
        },
        {
          text: '등록자명',
          value: 'ptnrNm',
          align: 'center'
        },
        {
          text: '등록일자',
          value: 'crtDt',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    /**
     * 검색 조건
     */
    searchList () {
      // 파트너 여부에 따라 다르다.
      if (this.isPartner) {
        return [
          { key: 'aprlCd', label: '상태', type: 'code', commCd: 'OTA0003', cols: 2 },
          { key: 'title', label: '제목', type: 'text', cols: 2 },
          { key: 'contents', label: '요청사유', type: 'text', cols: 2 },
          { key: 'keyRsvNo', label: 'KEY예약번호', type: 'text', cols: 2 },
          { key: 'crtDate', label: '등록일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 2 }
        ]
      } else {
        return [
          { key: 'aprlCd', label: '상태', type: 'code', commCd: 'OTA0003', cols: 2 },
          { key: 'title', label: '제목', type: 'text', cols: 2 },
          { key: 'contents', label: '요청사유', type: 'text', cols: 2 },
          { key: 'keyRsvNo', label: 'KEY예약번호', type: 'text', cols: 2 },
          { key: 'crtDate', label: '등록일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 2 },
          { key: 'ptnrNo', label: '파트너', type: 'partner', cols: 2 }
        ]
      }
    }
  },
  methods: {
    /**
     * 상세보기
     * @param row 게시물 정보
     */
    open (row) {
      // 파트너 / 관리자 분기
      let componentPath = ''
      if (this.isPartner) {
        componentPath = '/Partner/Request/PartnerRequestViewDialog'
      } else {
        // 관리자는 신규가 없다
        if (!row) {
          return
        }
        componentPath = '/Partner/Request/PartnerRequestConfirmDialog'
      }
      this.$store.dispatch('dialog/open', {
        componentPath,
        params: {
          isModify: !!row,
          requestSeq: row.requestSeq,
          param: row || {}
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectPartnerRequestList()
          }
        }
      })
    },
    /**
     * 예약내역 팝업창 호출
     * @param keyRsvNo 예약 번호
     */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo,
            isPkg: true
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    },
    /**
     * 신청관리 > 위약취소환불 > 등록 팝업 열기
     */
    openCreatePartnerRequestDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Request/PartnerRequestManagementDialog',
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectPartnerRequestList()
          }
        }
      })
    },
    /**
     * 신청관리 > 위약취소환불 > 목록 조회
     */
    async selectPartnerRequestList () {
      const res = await partnerRequestService.selectPartnerRequestList(
        this.searchParam
      )
      res.data.forEach(item => {
        item.rowSeq = item.requestSeq
      })
      this.list = res.data
      this.searchParam.total = res.pagination.total
    }
  }
}
</script>
