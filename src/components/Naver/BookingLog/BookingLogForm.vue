<template>
  <dialog-base :instance="instance" :title="`예약로그 상세보기`">
    <template v-slot:buttons>
      <v-btn dark text @click="close()">
        <v-icon left>check</v-icon>
        확인
      </v-btn>
    </template>
    <v-card-text class="pa-0">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search"></search-form>
      <v-row wrap v-if="form">
        <v-col cols="12" class="pb-3">
          <v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="form" item-key="logNo"
             hide-default-footer
             disable-pagination
             disable-sort
            class="bordered"
            >
            <template v-slot:item.failStatus="{item}">
              {{ getStatus(item.failStatus, 'text') }}
            </template>
            <template v-slot:item.pkgYn="{item}">
              {{ item.pkgYn === 'Y' ? '패키지' : '객실' }}
            </template>
            <template v-slot:item.status="{item}">
              {{ getStatus(item.status, 'text') }}
            </template>
            <template v-slot:item.phone="{item}">
              <template v-if="item.phone">
                <mask-phone-number
                  :text="item.phone.length === 11 ?
                item.phone.substr(0, 3) + '-' + item.phone.substr(3, 4) + '-' + item.phone.substr(7, 4)
                : item.phone.substr(0, 3) + '-' + item.phone.substr(3, 3) + '-' + item.phone.substr(7, 4)"
                @selectPhone="selectPhone(item)"></mask-phone-number>
              </template>
            </template>
            <template v-slot:item.email="{item}">
              <mask-email :text="item.email"></mask-email>
            </template>
            <template v-slot:item.isNPayUsed="{item}">
              {{ item.isNPayUsed === 'Y' ? '사용' : '미사용' }}
            </template>
            <template v-slot:item.price="{item}">
              {{ item.price | price }}
            </template>
            <template v-slot:item.bizItemPrice="{item}">
              {{ item.bizItemPrice | price }}
            </template>
            <template v-slot:item.dateTime="{item}">
              {{ item.dateTime | dateSet }}
            </template>
            <template v-slot:item.cancelledDateTime="{item}">
              {{ item.cancelledDateTime | dateSet }}
            </template>
            <template v-slot:item.refundPrice="{item}">
              <template v-if="item.refundPrice">
                {{ item.refundPrice | price }}
              </template>
            </template>
            <template v-slot:item.refundRate="{item}">
              <template v-if="item.refundRate">
                {{ Number(item.refundRate) + '%' }}
              </template>
            </template>
            <template v-slot:item.refundType="{item}">
              {{ getRefundType(item.refundType) }}
            </template>
            <template v-slot:item.completedDateTime="{item}">
              {{ item.completedDateTime | dateSet }}
            </template>
            <template v-slot:item.overBookingYn="{item}">
              {{ item.overBookingYn === 'Y' ? '오버부킹' : '부킹' }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/naver/bookingLog.service'
import { mapGetters } from 'vuex'
import MaskPhoneNumber from '@/components/Mask/MaskPhoneNumber.vue'
import MaskEmail from '@/components/Mask/MaskEmail.vue'

export default {
  extends: DialogBase,
  name: 'BookingLogForm',
  components: {
    MaskPhoneNumber,
    MaskEmail
  },
  data: () => ({
    /**
     * header
     */
    searchParam: {
      q: {},
      page: 1,
      size: 10,
      total: 0
    },
    headers: [
      {
        text: '로그번호',
        value: 'logNo',
        align: 'center',
        sortable: false
      },
      {
        text: '실패날짜',
        value: 'failDate',
        align: 'center',
        sortable: false
      },
      {
        text: '예약실패시 예약상태',
        value: 'failStatus',
        align: 'center',
        sortable: false
      },
      {
        text: '실패사유',
        value: 'failResn',
        align: 'center',
        sortable: false
      },
      {
        text: '예약ID',
        value: 'bookingId',
        align: 'center',
        sortable: false
      },
      {
        text: '서비스명',
        value: 'dmStoreId',
        align: 'center',
        sortable: false
      },
      {
        text: '상품명',
        value: 'dmItemId',
        align: 'center',
        sortable: false
      },
      {
        text: 'DGNS예약번호',
        value: 'rsvNo',
        align: 'center',
        sortable: false
      },
      {
        text: 'DGNS KEY 예약번호',
        value: 'keyRsvNo',
        align: 'center',
        sortable: false
      },
      {
        text: '영업장코드',
        value: 'storeCode',
        align: 'center',
        sortable: false
      },
      {
        text: '객실타입코드',
        value: 'rmTypeCode',
        align: 'center',
        sortable: false
      },
      {
        text: '패키지여부',
        value: 'pkgYn',
        align: 'center',
        sortable: false
      },
      {
        text: '회원번호/패키지번호',
        value: 'mid',
        align: 'center',
        sortable: false
      },
      {
        text: '블럭코드',
        value: 'rsvBlckCode',
        align: 'center',
        sortable: false
      },
      {
        text: '예약상태',
        value: 'status',
        align: 'center',
        sortable: false
      },
      {
        text: '예약자ID',
        value: 'userId',
        align: 'center',
        sortable: false
      },
      {
        text: '예약자성명',
        value: 'name',
        align: 'center',
        sortable: false
      },
      {
        text: '예약자전화번호',
        value: 'phone',
        align: 'center',
        sortable: false
      },
      {
        text: '예약자이메일',
        value: 'email',
        align: 'center',
        sortable: false
      },
      {
        text: '예약날짜',
        value: 'bookingDate',
        align: 'center',
        sortable: false
      },
      {
        text: '예약시작날짜',
        value: 'startDate',
        align: 'center',
        sortable: false
      },
      {
        text: '예약종료날짜',
        value: 'endDate',
        align: 'center',
        sortable: false
      },
      {
        text: '네이버페이사용유무',
        value: 'isNPayUsed',
        align: 'center',
        sortable: false
      },
      {
        text: '예약수',
        value: 'count',
        align: 'center',
        sortable: false
      },
      {
        text: '총가격',
        value: 'price',
        align: 'center',
        sortable: false
      },
      {
        text: '옵션제외한가격',
        value: 'bizItemPrice',
        align: 'center',
        sortable: false
      },
      {
        text: '예약자요청사항',
        value: 'requestMessage',
        align: 'center',
        sortable: false
      },
      {
        text: '메모',
        value: 'memo',
        align: 'center',
        sortable: false
      },
      {
        text: '환불시간 오프셋',
        value: 'refundTimeOffset',
        align: 'center',
        sortable: false
      },
      {
        text: '상태변경시간',
        value: 'dateTime',
        align: 'center',
        sortable: false
      },
      {
        text: '취소사유',
        value: 'cancelledDesc',
        align: 'center',
        sortable: false
      },
      {
        text: '취소주체',
        value: 'cancelledBy',
        align: 'center',
        sortable: false
      },
      {
        text: '취소요청시간',
        value: 'cancelledDateTime',
        align: 'center',
        sortable: false
      },
      {
        text: '환불금액',
        value: 'refundPrice',
        align: 'center',
        sortable: false
      },
      {
        text: '환불요율',
        value: 'refundRate',
        align: 'center',
        sortable: false
      },
      {
        text: '환불타입',
        value: 'refundType',
        align: 'center',
        sortable: false
      },
      {
        text: '예약완료시간',
        value: 'completedDateTime',
        align: 'center',
        sortable: false
      },
      {
        text: '예약완료ID',
        value: 'completedId',
        align: 'center',
        sortable: false
      },
      {
        text: '오버부킹여부',
        value: 'overBookingYn',
        align: 'center',
        sortable: false
      },
      {
        text: '네이버페이주문번호',
        value: 'npayOrderNumber',
        align: 'center',
        sortable: false
      },
      {
        text: '네이버페이상품주문번호',
        value: 'npayProductOrderNumber',
        align: 'center',
        sortable: false
      }
    ],
    /**
     * 변경할 요소
     */
    form: null
  }),
  computed: {
    ...mapGetters({
      setStatus: 'naver/setStatus'
    }),
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'services', label: '예약ID, 서비스명, 상품명', type: 'text', cols: 3 },
        { key: 'users', label: '예약자성명, 예약자ID', type: 'text', cols: 3 },
        { key: 'phone', label: '예약자전화번호', type: 'text', cols: 3 },
        { key: 'email', label: '예약자이메일', type: 'text', cols: 3 }
      ]
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
  },
  methods: {
    getStatus (status, idx) {
      return !status ? '(없음)' : this.setStatus[status][idx]
    },
    getRefundType (refundType) {
      if (!refundType) {
        return ''
      }
      if (refundType === 'ALL') {
        return '전액환불'
      } else if (refundType === 'PRICE') {
        return '정액환불'
      } else if (refundType === 'RATE') {
        return '정률환불'
      } else {
        return '환불기준'
      }
    },
    /**
     * 조회
     */
    search () {
      this.searchParam.q.start = this.instance.params.form.start
      this.searchParam.q.failStatus = !this.instance.params.form.failStatus ? null : this.instance.params.form.failStatus
      service.selectBookingLogList(this.searchParam).then(res => {
        this.form = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    selectPhone (log) {
      service.selectBookingLogForPhone(log.logNo).then(res => {
        log.phone = res.data
      })
    }
  }
}
</script>
