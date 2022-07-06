<template>
  <v-row wrap>
    <app-card :heading="'서비스 목록'" col-classes="col-12">
      <v-row>
        <v-col class="text-right pt-0 pb-0">
          <v-btn outlined rounded color="info" @click="open()">
            <v-icon left>add</v-icon>
            서비스등록
          </v-btn>
        </v-col>
      </v-row>
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search"></search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="businessId"
            hide-default-footer
            disable-pagination
            disable-sort
            class="bordered">
            <template v-slot:item.serviceName="{item}">
              <div @click="open(item)" class="pointer pa-3">
                <v-icon>search</v-icon>
                {{ item.serviceName | textTruncate }}
              </div>
            </template>
            <template v-slot:item.sendYn="{item}">
              <v-chip v-if="item.sendYn === 'Y'" small color="success">성공</v-chip>
              <template v-else>
                <v-chip small color="red" text-color="white" class="mr-2">실패</v-chip>
                <v-btn outlined rounded small color="red" @click="resendNaverApi(item.storeId)" :disabled="isDisabledResend">
                  재전송
                </v-btn>
              </template>
            </template>
            <template v-slot:item.reserve="{item}">
              <v-btn text block rounded color="green" @click="reserve(item.businessId)" :disabled="isNotEditor(item)">
                예약관리
              </v-btn>
            </template>
            <template v-slot:item.reserveService="{item}">
              <v-btn text block rounded color="green" @click="reserveService(item.businessId)" :disabled="isNotEditor(item)">
                예약서비스
              </v-btn>
            </template>
            <template v-slot:item.copy="{item}">
              <v-btn text block rounded color="green" @click="copyBusiness(item.storeId)" :disabled="isNotEditor(item)">
                <v-icon left>file_copy</v-icon>복사
              </v-btn>
            </template>
            <template v-slot:item.delete="{item}">
              <v-btn text block rounded color="green" @click="deleteBusiness(item)" :disabled="isNotEditor(item)">
                <v-icon left>delete</v-icon>삭제
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
      <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </app-card>
  </v-row>
</template>

<script>
import service from '@/api/modules/naver/business.service'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'

export default {
  name: 'Business',
  components: {
    CommonSnackbars
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      list: [],
      storeId: '',
      headers: [
        { text: '서비스명', value: 'serviceName', align: 'center', sortable: false },
        { text: '네이버API 전송여부', value: 'sendYn', align: 'center', sortable: false, width: 200 },
        { text: '예약관리', value: 'reserve', align: 'center', sortable: false, width: 200 },
        { text: '예약서비스', value: 'reserveService', align: 'center', sortable: false, width: 200 },
        { text: '복사', value: 'copy', align: 'center', sortable: false, width: 200 },
        { text: '삭제', value: 'delete', align: 'center', sortable: false, width: 200 }
      ],
      openCopyModal: false,
      originItem: {},
      isDisabledResend: false,
      /**
       * snackbar
       */
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: '',
      /**
       * 검색기능
       */
      sortable: [
        { text: '최신등록순', value: 'recent' },
        { text: '가나다순', value: 'alphabet' }
      ],
      sendYnList: [
        { code: '성공', value: 'Y' },
        { code: '실패', value: 'N' }
      ]
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'serviceName', label: '서비스명', type: 'text' },
        { key: 'sorts', label: '정렬', type: 'select', list: this.sortable, listValue: 'value', listText: 'text' },
        { key: 'sendYnList', label: '네이버API 전송여부', type: 'select', list: this.sendYnList, listValue: 'value', listText: 'code' }
      ]
    }
  },
  methods: {
    isNotEditor (item) {
      return (!item.businessId || item.sendYn === 'N')
    },
    search () {
      /**
       * 조회
       */
      service.selectBusinessList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    /**
     * 팝업 열기
     */
    open (event) {
      if (event && event.storeId && this.isNotEditor(event)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        return
      }
      this.storeId = event ? event.storeId : ''
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Business/BusinessForm',
          params: {
            storeId: this.storeId,
            search: this.search
          },
          options: {
            fullscreen: true,
            persistent: true,
            scrollable: true,
            transition: 'dialog-bottom-transition'
          }
        })
      })
    },
    /**
     * 예약서비스 링크
     */
    reserveService (businessId) {
      const currentUrl = window.location.origin
      let url = `http://test.booking.naver.com/booking/3/bizes/${businessId}`
      if (currentUrl.indexOf('//sonoadmin.') > -1) {
        url = `https://booking.naver.com/booking/3/bizes/${businessId}`
      }
      window.open(url, '_blank')
    },
    /**
     * 예약관리 링크
     */
    reserve (businessId) {
      const currentUrl = window.location.origin
      let url = `http://test.booking.naver.com/booking/3/bizes/${businessId}/booking-calendar-view`
      if (currentUrl.indexOf('//sonoadmin.') > -1) {
        url = `https://booking.naver.com/booking/3/bizes/${businessId}/booking-calendar-view`
      }
      window.open(url, '_blank')
    },
    /**
     * 복사
     */
    copyBusiness (storeId) {
      service.selectBusiness(storeId).then(res => {
        this.originItem = res.data

        this.$nextTick(() => {
          this.$store.dispatch('dialog/open', {
            componentPath: '/Naver/Business/BusinessCopyModal',
            params: {
              copyBusiness: this.originItem,
              search: this.search
            },
            options: {
              fullscreen: false,
              persistent: true,
              width: 500,
              scrollable: true
            }
          })
        })
      })
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    },
    /**
     * 재전송
     */
    resendNaverApi (storeId) {
      this.$dialog.confirm('재전송하시겠습니까?').then(() => {
        this.isDisabledResend = true
        service.resendApiBusiness(storeId).then(() => {
          this.isDisabledResend = false
          this.showSnackbar('success', '재전송되었습니다.')
          this.search()
        }).catch(() => {
          this.isDisabledResend = false
        })
      })
    },
    /**
     * 삭제
     */
    deleteBusiness (item) {
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        this.search()
      }
      this.$dialog.confirm(`[${item.serviceName}] 삭제 하시겠습니까? 삭제시 복구할 수 없습니다.`).then(() => {
        service.deleteBusiness(item.storeId).then(() => {
          this.showSnackbar('success', `[${item.serviceName}] 삭제 되었습니다.`)
          this.search()
        }).catch(() => {
          this.search()
        })
      })
    }
  }
}
</script>
