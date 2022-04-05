<template>
    <div class="pl-0">
        <app-card custom-classes="elevation-0">
            <template v-slot:heading>
                <div class="title font-weight-bold">예약 현황</div>
                <v-spacer />
                <v-menu bottom :close-on-click="true" :nudge-width="80" back>
                    <template v-slot:activator="{ on }">
                        <v-btn outlined rounded v-on="on" color="cyan">
                            폰트 사이즈
                        </v-btn>
                    </template>
                    <v-card>
                        <v-list>
                            <v-list-item>
                                <v-radio-group v-model="selectedSize">
                                    <v-radio v-for="n in [9,12,16]" :key="n" :label="`size ${n}px`" :value="n"
                                             @click="changeFontSize(n)" class="font-weight-bold" />
                                </v-radio-group>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>
            </template>
            <virtual-scroll-table :headers="headers" :items="rsvList" :item-height="30">
                <template v-slot:rsvState="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.rsvState }}</span>
                </template>
                <template v-slot:memNo="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.memNo }}</span>
                </template>
                <template v-slot:rsvNo="{item}">
          <span :class="`font-${selectedSize} info--text`" @click="showDetail(item)">
            <v-btn small color="info" text block><v-icon small>search</v-icon>{{ item.rsvNo }}</v-btn>
          </span>
                </template>
                <template v-slot:guestName="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.guestName }}</span>
                </template>
                <template v-slot:smsPhone="{item}">
                    <template v-if="item.smsPhone">
                        <mask-phone-number :height="20" :font-size="selectedSize" :text="item.smsPhone"
                                           @selectPhone="selectPhone(item)" />
                    </template>
                </template>
                <template v-slot:ciYmd="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.ciYmd }}</span>
                </template>
                <template v-slot:nights="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.nights }}</span>
                </template>
                <template v-slot:rmCnt="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.rmCnt }}</span>
                </template>
                <template v-slot:storeName="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.storeName }}</span>
                </template>
                <template v-slot:dongCodeName="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.dongCodeName }}</span>
                </template>
                <template v-slot:rmTypeName="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.rmTypeName }}</span>
                </template>
                <template v-slot:rsvTypeName="{item}">
                    <span :class="`font-${selectedSize}`">{{ item.rsvTypeName }}</span>
                </template>
            </virtual-scroll-table>
        </app-card>
        <app-card custom-classes="elevation-0">
            <template v-slot:heading>
                <div class="title font-weight-bold">잔여 객실 현황</div>
            </template>
            <v-col cols="12" class="pa-0">
                <v-simple-table
                    v-dragscroll="{target: '.v-data-table__wrapper'}"
                    class="bordered"
                    dense
                    fixed-header
                    height="180">
                    <thead>
                    <tr>
                        <th class="text-center">날짜</th>
                        <th v-for="room in originList" :key="room.rmTypeCode"
                            class="text-center font-weight-medium text--darken-1" v-html="room.rmTypeName" />
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(stockList, day) in roomList" :key="day">
                        <td class="text-center py-1">{{ getDate(day) }}</td>
                        <td class="text-center py-1" v-for="(stock, index) in stockList" :key="index">
                            {{ stock.stockQty }}
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-col>
        </app-card>
    </div>
</template>

<script>
import roomService from '@/api/modules/ota/roomReservation.service'
import VirtualScrollTable from '@/components/Common/VirtualScrollTable.vue'

export default {
  components: { VirtualScrollTable },
  name: 'RoomReservationListWrapper',
  props: {
    /**
         * 검색 조건
         */
    searchParam: {
      type: Object
    },
    /**
         * 예약 현황 목록
         */
    rsvList: {
      type: Array
    },
    /**
         * 테이블 Header
         */
    headers: {
      type: Array
    },
    /**
         * 가공된 잔여 객실 목록
         */
    roomList: {
      type: Object
    },
    /**
         * 원본 잔여 객실 목록
         */
    originList: {
      type: Array
    },
    /**
         * 예약 현황 목록의 높이
         */
    listHeight: {
      type: String
    }
  },
  data () {
    return {
      selectedSize: 12 // font-size 변수
    }
  },
  methods: {
    /**
         * 리스트 중 1개 선택시
         */
    showDetail (item) {
      this.$emit('show-detail', item)
    },
    /**
         * 날짜포멧 변경
         */
    getDate (oneDay) {
      if (oneDay) {
        return moment(oneDay).format('YYYY-MM-DD (ddd)')
      } else {
        return oneDay
      }
    },
    /**
         * font size 변경
         */
    changeFontSize (size) {
      this.selectedSize = size
    },
    /**
         * 실제 이용자 연락처 조회
         */
    async selectPhone (item) {
      const res = await roomService.selectRealSmsphone(item.keyRsvNo)
      item.smsPhone = res.data.toString()
    }
  }
}
</script>
