<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'PMS 우대번호 조회'">
                <v-row>
                    <v-col sm="2" md="1" class="pr-0">
                        <v-label>종류구분코드</v-label>
                        <v-text-field v-model="form.typeDivCode" label=""
                                      @keypress.enter="$refs.searchTypeDivCode.openDialog()" :rules="emptyRules"
                                      required></v-text-field>
                    </v-col>
                    <v-col align-self="center" cols="auto" class="pl-0">
                        <type-div-code-search-form :data.sync="form" :icon="'search'"
                                                   ref="searchTypeDivCode"></type-div-code-search-form> <!--종류구분코드 조회-->
                    </v-col>
                    <v-col sm="4" md="2" class="pl-0 mr-10" align-self="end">
                        <v-text-field v-model="form.typeDivCodeName" disabled label=""></v-text-field>
                    </v-col>

                    <v-col sm="2" md="1" class="pr-0">
                        <v-label>우대번호</v-label>
                        <v-text-field v-model="form.pvlTicketNo" label="" @keypress.enter="openTicketSearchForm"
                                      :rules="emptyRules" required></v-text-field>
                    </v-col>
                    <v-col align-self="center" cols="auto" class="pl-0">
                        <v-btn outlined color="info" @click="openTicketSearchForm" tabindex="-1">
                            <v-icon left>search</v-icon>
                            조회
                        </v-btn>
                    </v-col>
                    <v-col sm="4" md="2" class="pl-0 mr-10">
                        <v-label>우대번호 명</v-label>
                        <v-text-field v-model="form.pvlTicketName" disabled label=""></v-text-field>
                    </v-col>

                    <v-col cols="auto">
                        <v-label>순번</v-label>
                        <v-text-field v-model="form.seqNoFrom" label=""></v-text-field>
                    </v-col>
                    <v-col cols="auto" align-self="center">~</v-col>
                    <v-col cols="auto" align-self="end">
                        <v-text-field v-model="form.seqNoTo" label=""></v-text-field>
                    </v-col>

                    <v-col sm="4" md="2">
                        <v-label>구분</v-label>
                        <v-select v-model="form.selected" :items="selectList" item-text="value"
                                  item-value="key"></v-select>
                    </v-col>
                    <v-col sm="4" md="2">
                        <v-label>쿠폰번호</v-label>
                        <v-text-field v-model="form.couponNo" label=""></v-text-field>
                    </v-col>
                </v-row>
                <v-row justify="space-between">
                    <v-col cols="4" align-self="center">
                        <div class="black--text">
                            {{ searchParam.total ? "총 " + searchParam.total + " 건&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : "" }}{{ searchParam.page }}
                            / {{ pages }} 페이지
                        </div>
                    </v-col>
                    <v-col cols="4" align-self="center" class="text-right">
                        <v-btn outlined rounded color="info" @click="refresh">
                            <v-icon left>refresh</v-icon>
                            초기화
                        </v-btn>
                        <v-btn outlined rounded color="primary" @click="search">
                            <v-icon left>search</v-icon>
                            검색
                        </v-btn>
                    </v-col>
                </v-row>

                <v-data-table
                    :no-data-text="'검색 결과가 없습니다.'"
                    :headers="headers"
                    :items="list"
                    hide-default-footer
                    item-key="b"
                    class="bordered"
                >
                    <template v-slot:item.g="{item}">
                        <span>{{ item == "Y" ? "사용" : "미사용" }}</span>
                    </template>
                </v-data-table>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import TypeDivCodeSearchForm from './TypeDivCodeSearchForm'
import dgnsTicketService from '@/api/modules/social/dgnsTicket.service'

export default {
  name: 'TicketHistory',
  components: { TypeDivCodeSearchForm },
  computed: {
    pages () {
      if (this.searchParam.size == null || this.searchParam.total == null || this.searchParam.total === 0) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
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
      selectList: [
        { key: '1', value: '전체' },
        { key: '2', value: '테스트 1' },
        { key: '3', value: '테스트 2' }
      ],
      list: [],
      headers: [
        { text: 'No', value: 'a', align: 'center' },
        { text: '우대번호', value: 'pvlTicketNo', align: 'center' },
        { text: '순번', value: 'c', align: 'center' },
        { text: '우대명', value: 'd', align: 'center' },
        { text: '시작일자', value: 'e', align: 'center' },
        { text: '종료일자', value: 'f', align: 'center' },
        { text: '사용유무', value: 'g', align: 'center' },
        { text: '구분', value: 'h', align: 'center' },
        { text: '비고', value: 'i', align: 'center' },
        { text: '쿠폰번호', value: 'j', align: 'center' }
      ],
      form: {
        selected: '1'
      },
      resetForm: {}
    }
  },
  mounted () {
    this.resetForm = this.form
  },
  methods: {
    openTicketSearchForm () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketSearchForm',
        params: {
          ticketNo: this.form.pvlTicketNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
            }
          }
        }
      })
    },
    refresh () {
      this.form = this.resetForm
    },
    search () {
      dgnsTicketService.selectDgnsTicketList(this.searchParam).then(res => {
        this.list = res.data
      })
    }
  }

}
</script>
