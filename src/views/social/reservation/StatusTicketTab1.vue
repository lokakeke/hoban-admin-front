<template>
    <v-card flat>
        <search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>

        <v-data-table
            :no-data-text="'검색 결과가 없습니다.'"
            :items="list"
            hide-default-footer
            item-key="b"
            class="bordered"
        >
            <template v-slot:body="{ items }">
                <thead>
                <tr>
                    <th class="text-center" colspan="2">딜명</th>
                    <th class="text-center">딜 진행 일정</th>
                    <th class="text-center">정산요약</th>
                    <th class="text-center">미답변 문의</th>
                    <th class="text-center" colspan="2">관리</th>
                </tr>
                </thead>
                <tbody>
                <tr style="background-color: white" v-for="(item, index) in items" :key="index">
                    <template v-if="item.c">
                        <td class="text-center height-auto pt-5 pb-5">
                <span class="font-md blue-grey--text">
                  실 판매 수량
                  <span class="font-md font-weight-bold pointer">{{ item.b }}</span>
                </span>개
                            <br />(+입금확인중
                            <span class="font-weight-bold red--text pointer">0</span>개)
                            <br />
                            <br />
                            <v-btn class="primary" small @click="infoDetail(item)">대기내역 다운</v-btn>
                        </td>
                        <td class="text-center">
                            <span class="font-md blue-grey--text">실 매출액</span>
                            <br />
                            <span class="font-lg blue-grey--text">{{ item.c }} 원</span>
                        </td>
                    </template>
                    <template v-else>
                        <td class="text-center font-weight-bold height-auto" colspan="2">{{ item.a }}</td>
                        <td class="text-left pt-10 pb-10" :rowspan="item.c ? 2 : ''">
                            판매기간
                            <br />
                            <span class="font-weight-bold">{{ item.d }}</span>
                            <br />
                            <br />유효기간
                            <br />
                            <span class="font-weight-bold">{{ item.e }}</span>
                            <br />
                            <br />사용처리
                            <br />
                            <span class="font-weight-bold">{{ item.f }}</span>
                        </td>
                        <td class="text-left pt-10 pb-10" :rowspan="item.c ? 2 : ''">
                            정산예정일
                            <br />
                            <br />1차
                            <br />매월 말일 + 15영업일
                            <br />
                            <br />정산예정금액 0원이하
                            <br />:대금 지급 불가
                            <br />
                            <br />
                            <v-btn class="primary" small @click="infoDetail(item)">정산정보 더보기</v-btn>
                        </td>
                        <td class="text-center" :rowspan="item.c ? 2 : ''">
                            <span class="font-weight-bold red--text pointer">{{ item.g }}</span> 건
                        </td>
                        <td class="text-center" :rowspan="item.c ? 2 : ''">-</td>
                        <td class="text-center" :rowspan="item.c ? 2 : ''">
                            <v-btn class="primary" small @click="infoDetail(item)">미리보기</v-btn>
                            <v-btn class="primary" small @click="infoDetail(item)">매출상세보기</v-btn>
                            <v-btn class="primary" small @click="infoDetail(item)">공지관리</v-btn>
                        </td>
                    </template>
                </tr>
                </tbody>
            </template>
        </v-data-table>
        <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </v-card>
</template>

<script>
import statusTicketService from '@/api/modules/social/statusTicket.service'

export default {
  props: ['tab'],
  name: 'StatusTicketTab1',
  computed: {
    searchList () {
      return [
        { key: '1', label: '딜명', type: 'text' },
        { key: '2', label: '딜 진행 일정', type: 'dateRange' }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      form: {}
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    search () {
    },
    getList () {
      statusTicketService.selectStatusTicketList(this.searchParam).then(res => {
        this.list = res.data
      })
    },
    infoDetail (item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
</style>
