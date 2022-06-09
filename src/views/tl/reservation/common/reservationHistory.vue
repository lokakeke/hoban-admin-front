<template>
    <div>
        <v-layout wrap>
            <v-flex>
                <v-flex xs12 md6>
                    <v-label class="board">이전 이력 내역</v-label>
                    <v-spacer></v-spacer>
                </v-flex>

                <v-data-table :no-data-text="'데이터가 없습니다.'" :headers="headers" item-key="hstNo"
                              :items="list" class="condensed bordered" hide-default-footer>
                    <template v-slot:body="{ items }">
                        <tbody>
                        <template v-for="(item,index) in items">
                            <tr :key="index">
                                <td class="text-center">{{ item.rsvTypeNm }}</td>
                                <td class="text-center">{{ item.createDatetime }}</td>
                                <td class="text-center">{{ item.tlNetRmTypeGroupName }}</td>
                                <td class="text-center">{{ item.netAgtRmTypeName }}</td>
                                <td class="text-center">{{ item.errorCd && item.errorCd !== '0' ? '오류발생' :'처리완료'  }}</td>
                                <td class="text-center">
                                    {{ item.errorMsg }}
                                </td>
                                <td class="text-xs-center">{{ item.keyRsvNo }}</td>
                                <td class="text-xs-center">{{ item.rsvNo }}</td>
                                <td class="text-xs-center">{{ item.confirmDt }}</td>
                                <td class="text-xs-center">
                                    <pre v-html="item.confirmRemark"></pre>
                                </td>
                            </tr>
                            </template>
                        </tbody>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </div>

</template>

<script>
import reservationHistoryService from '@/api/modules/tl/reservation/reservationHistory.service'

export default {
  props: ['brcNo', 'orgDataId'],
  data () {
    return {
      detail: {},
      headers: [
        { text: '예약구분', value: 'rsvTypeNm', align: 'center', sortable: false },
        { text: '등록일자', value: 'createDatetime', align: 'center' },
        { text: 'TL객실이름', value: 'tlRmTypeName', align: 'center' },
        { text: '판매처 객실이름', value: 'netAgtRmTypeName', align: 'center' },
        { text: '처리여부', value: 'errorCd', align: 'center' },
        { text: '에러 메시지', value: 'errorMsg', align: 'center' },
        { text: '예약KEY번호', value: 'keyRsvNo', align: 'center' },
        { text: '예약번호', value: 'rsvNo', align: 'center' },
        { text: '확인시간', value: 'confirmDt', align: 'center' },
        { text: '확인내용', value: 'confirmRemark', align: 'center' }
      ],
      list: []
    }
  },

  watch: {
    orgDataId (newVal) {
      if (newVal) {
        this.getHistoryList()
      }
    }
  },

  mounted () {
  },
  methods: {
    getHistoryList () {
      const searchParam = { brcNo: this.brcNo, orgDataId: this.orgDataId }
      reservationHistoryService.selectReservationHistoryList(searchParam).then(res => {
        console.log('success~')
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>
p {
    margin-bottom: 10px;
}
</style>
