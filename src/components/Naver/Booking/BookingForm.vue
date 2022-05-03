<template>
    <dialog-base :instance="instance" v-if="form && item && dgnsInfo && attachBag"
                 :title="`예약 상세정보`">
        <template v-slot:buttons
                  v-if="form.naver.status !== 'confirmed' && form.naver.status !== 'paid' && form.naver.status !== 'payFailed'">
            <v-btn dark text @click="policy (`noshow`)">
                <v-icon left>check</v-icon>
                노쇼
            </v-btn>
            <v-btn dark text @click="policy (`cancelled`)">
                <v-icon left>check</v-icon>
                예약취소
            </v-btn>
            <v-btn dark text @click="policy (`completed`)">
                <v-icon left>check</v-icon>
                이용완료
            </v-btn>
        </template>
        <v-card-text class="pa-0">
            <v-row class="pb-4">
                <!-- 상세정보 요약 -->
                <v-col cols="6" class="mx-auto pb-0 text-center">
                    <v-avatar :color="getStatus(form.naver.status, 'bgcolor')" size="80">
                        <span class="white--text headline ma-3">{{ getStatus(form.naver.status, "text") }}</span>
                    </v-avatar>
                    <span class="title font-weight-bold ml-3 pt-2">{{ form.naver.name }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="mx-auto">
                    <booking-management-table
                        :form="form"
                        :item="item"
                        :dgnsInfo="dgnsInfo"
                    ></booking-management-table>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 상세정보 상세-->
            <v-row>
                <v-col :cols="form.dgns ? 6 : 12">
                    <booking-info-component
                        :form="form.naver"
                        :search="instance.params.search"
                        :isDgns="false"
                        @reload="inits"
                        ref="form"></booking-info-component>
                </v-col>
                <v-col cols="6" :style="{'border-left':'1px solid #ddd'}">
                    <booking-info-component
                        v-if="form.dgns"
                        :form="form.dgns"
                        :search="instance.params.search"
                        :isDgns="true"
                        @reload="inits"
                        ref="form"></booking-info-component>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
                <v-col cols="12" class="pl-7 pr-7">
                    <div class="text-left title font-weight-bold ml-1">
                        <common-tooltip :type="'info'" :position="'top'"
                                        :text="'gif, jpg, jpeg, png, pdf, xls, xlsx 확장자를 가진 파일만 첨부 가능합니다.'" />
                        첨부파일
                        <span class="font-sm">(오른쪽에 위치한 아이콘을 클릭해야 수정사항이 적용됩니다.)</span>
                        <v-icon slot="append" class="float-right" color="info" @click="saveFiles">edit</v-icon>
                    </div>
                    <attach
                        v-model="attachBag"
                        ref-fld-cd="naverBooking"
                        atfl-fld-val="nFile"
                        extensions="gif,jpg,jpeg,png,pdf,xls,xlsx"
                        accept="image/png, image/gif, image/jpeg, application/pdf, application/vnd.ms-excel, application/msexcel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :limit="3"
                        required
                    ></attach>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 옵션, 부가정보 -->
            <v-row class="pa-3" v-if="form.add.length > 0 || form.option.length > 0">
                <v-col v-if="form.add.length > 0" :cols="form.option.length > 0 ? 6 : 12" class="pa-4 pb-0">
                    <div class="text-left title font-weight-bold ml-3">
                        부가정보
                    </div>
                    <v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                                  :no-data-text="emptyText" :headers="addHeaders"
                                  :items="form.add" item-key="type"
                                  hide-default-footer :fixed-header="true"
                                  disable-pagination :dense="true"
                                  disable-sort height="80"
                                  class="bordered pa-3">
                    </v-data-table>
                </v-col>
                <v-col v-if="form.option.length > 0" :cols="form.add.length > 0 ? 6 : 12" class="pa-4 pb-0">
                    <div class="text-left title font-weight-bold ml-3">
                        옵션
                        <v-chip v-if="form.option.length > 0" x-small class="ma-0" color="green" text-color="white"
                                @click="openOptionInfo()">
                            더보기
                            <v-icon small>add</v-icon>
                        </v-chip>
                    </div>
                    <v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                                  :no-data-text="emptyText" :headers="optionHeaders"
                                  :items="form.option" item-key="dmOptionId"
                                  hide-default-footer :fixed-header="true"
                                  disable-pagination :dense="true"
                                  disable-sort height="80"
                                  class="bordered pa-3">
                        <template v-slot:item.price="{item}">
                            {{ item.price | price }}
                        </template>
                        <template v-slot:item.normalPrice="{item}">
                            {{ item.normalPrice | price }}
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
            <v-divider v-if="form.add.length > 0 || form.option.length > 0"></v-divider>
            <!-- 진행이력-->
            <v-row>
                <v-col cols="12" class="pl-10 pb-0">
                    <div class="text-left title font-weight-bold">
                        진행이력
                    </div>
                </v-col>
            </v-row>
            <v-row class="pb-5">
                <v-col cols="12" class="pa-1" v-if="form.naver.cancelledDateTime">
                    <div class="text-right title text-center">
                        <v-chip label outlined color="red darken-3" class="mr-3">
                            <v-icon>fiber_manual_record</v-icon>
                            취소
                        </v-chip>
                        <v-chip label outlined>
                            {{ form.naver.cancelledDateTime | dateSetForMonth }}
                        </v-chip>
                        <br>
                        <v-chip small>
                            {{ form.naver.cancelledBy === "user" ? "예약자" : form.naver.cancelledBy === "owner" ? "관리자" : "시스템자동"
                            }}
                        </v-chip>
                    </div>
                </v-col>
                <v-col cols="12" class="pa-1" v-if="form.naver.completedDateTime">
                    <div class="text-right title text-center">
                        <v-chip label outlined color="purple darken-4" class="mr-3">
                            <v-icon>fiber_manual_record</v-icon>
                            완료
                        </v-chip>
                        <v-chip label outlined>{{ form.naver.completedDateTime | dateSetForMonth }}</v-chip>
                    </div>
                </v-col>
                <v-col cols="12" class="pa-1" v-if="form.naver.confirmedDateTime">
                    <div class="text-right title text-center">
                        <v-chip label outlined color="blue darken-4" class="mr-3">
                            <v-icon>fiber_manual_record</v-icon>
                            확정
                        </v-chip>
                        <v-chip label outlined>{{ form.naver.confirmedDateTime | dateSetForMonth }}</v-chip>
                    </div>
                </v-col>
                <v-col cols="12" class="pa-1" v-if="form.naver.regDateTime">
                    <div class="text-right title text-center">
                        <v-chip label outlined color="grey darken-3" class="mr-3">
                            <v-icon>fiber_manual_record</v-icon>
                            신청
                        </v-chip>
                        <v-chip label outlined>{{ form.naver.regDateTime | dateSetForMonth }}</v-chip>
                    </div>
                </v-col>
            </v-row>
            <v-divider class="mb-50"></v-divider>
            <v-footer absolute outlined>
                <v-row
                    v-if="form.naver.status !== 'confirmed' && form.naver.status !== 'paid' && form.naver.status !== 'payFailed'">
                    <v-col class="text-right">
                        <v-btn outlined rounded color="accent" @click="policy (`noshow`)">
                            <v-icon left>leave_bags_at_home</v-icon>
                            노쇼
                        </v-btn>
                        <v-btn outlined rounded color="info" @click="policy (`cancelled`)">
                            <v-icon left>subtitles_off</v-icon>
                            예약취소
                        </v-btn>
                        <v-btn outlined rounded color="success" @click="policy (`completed`)">
                            <v-icon left>emoji_people</v-icon>
                            이용완료
                        </v-btn>
                        <v-btn outlined rounded color="primary" @click="close()">
                            <v-icon>close</v-icon>
                            닫기
                        </v-btn>
                    </v-col>
                </v-row>
            </v-footer>
        </v-card-text>
    </dialog-base>
</template>

<script>
import service from '@/api/modules/naver/booking.service'
import itemService from '@/api/modules/naver/item.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import BookingInfoComponent from '@/components/Naver/Booking/BookingInfoComponent.vue'
import BookingTable from '@/components/Naver/Booking/BookingTable.vue'
import { mapGetters } from 'vuex'
import roomService from '@/api/modules/ota/roomReservation.service'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  extends: DialogBase,
  name: 'BookingForm',
  components: {
    BookingInfoComponent,
    BookingTable,
    CommonTooltip
  },
  data: () => ({
    /**
         * 예약자 정보
         */
    form: null,
    /**
         * 상품 정보
         */
    item: null,
    /**
         * dgns 정보
         */
    dgnsInfo: null,
    /**
         * header
         */
    addHeaders: [
      { text: '제목', value: 'title', align: 'center', sortable: false },
      { text: '내용', value: 'value', align: 'center', sortable: false }
    ],
    optionHeaders: [
      { text: '옵션명', value: 'name', align: 'center', sortable: false },
      { text: '수량', value: 'bookingCount', align: 'center', sortable: false },
      { text: '판매가', value: 'price', align: 'center', sortable: false }
    ],
    /**
         * 변경할 요소
         */
    list: [],
    // test
    attachBag: null
  }),
  computed: {
    ...mapGetters({
      setStatus: 'naver/setStatus'
    })
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.inits()
    this.selectNaverFile()
    this.getItemInfo()
    this.getDgnsInfo()
  },
  methods: {
    /**
         * 예약상세 조회
         */
    inits () {
      service.selectBooking(this.instance.params.form).then(res => {
        this.form = res.data
      })
    },
    getStatus (status, idx) {
      return !status ? '(없음)' : this.setStatus[status][idx]
    },
    /**
         *  DGNS 정보 상세 조회
         */
    getDgnsInfo () {
      if (this.instance.params.form.keyRsvNo) {
        roomService.selectReservationDetail(this.instance.params.form.keyRsvNo).then(res => {
          this.dgnsInfo = !res.data ? {} : res.data
        })
      } else {
        this.dgnsInfo = {}
      }
    },
    /**
         * 상품정보 조회
         */
    getItemInfo () {
      itemService.selectItem(this.instance.params.form.dmItemId).then(res => {
        this.item = res.data
      })
    },
    /**
         * 부가정보, 옵션 팝업 열기
         */
    openOptionInfo () {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Booking/BookingOptionInfo',
          params: {
            form: this.form.option
          },
          options: {
            fullscreen: false,
            scrollable: true
          }
        })
      })
    },
    /**
         * 정책 팝업
         */
    policy (status) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Booking/BookingRefundPolicy',
          params: {
            form: this.form.naver,
            status: status,
            search: this.instance.params.search
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 550,
            /**
                         * 변경 사항이 있을 시 정보 갱신
                         */
            closeCallback: (params) => {
              if (params && params.data) {
                this.inits()
              }
            }
          }
        })
      })
    },
    /**
         * 파일 조회
         */
    selectNaverFile () {
      const params = {
        refFldCd: 'naverBooking',
        refNo: this.instance.params.form.bookingId
      }
      service.selectNaverFile(params).then(res => {
        this.attachBag = res.data
      })
    },
    /**
         * 파일 저장
         */
    saveFiles () {
      service.insertNaverFile(this.form.naver.bookingId, this.attachBag).then(res => {
        this.$dialog.alert('첨부파일 수정사항이 반영되었습니다.')
      })
    }
  }
}
</script>
