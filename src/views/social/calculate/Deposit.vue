<template>
    <v-row wrap>
        <app-card :heading="'업체 리스트'" col-classes="col-4">
            <search-form init-search="" :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"
                         :cols="12"></search-form>
            <v-data-table :no-data-text="'검색 결과가 없습니다.'" :headers="partnerHeaders" :items="partnerList"
                          item-key="partnerNo" hide-default-footer class="click-row"
                          @click:row="getDepositList($event)">
            </v-data-table>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        </app-card>
        <template v-if="partnerNo !== null">
            <app-card :heading="subheader" col-classes="col-8">
                <v-data-table :no-data-text="'검색 결과가 없습니다.'" :headers="depositHeaders" :items="depositList"
                              item-key="partnerNo" hide-default-footer class="click-row" @click:row="open($event)">
                    <template v-slot:item.deposit="{item}">
                        {{ item.deposit | price }}
                    </template>
                    <template v-slot:item.agentCode="{item}">
                        {{ item.agentCode === null ? "-" : item.agentCode }}
                    </template>
                    <template v-slot:item.isUse="{item}">
                        {{ item.isUse ? "Y" : "N" }}
                    </template>
                    <template v-slot:item.action>
                        <v-btn text rounded color="success" @click.native.stop>
                            <v-icon left>edit</v-icon>
                            수정
                        </v-btn>
                        <v-btn text rounded color="accent" @click.native.stop>
                            <v-icon left>remove</v-icon>
                            삭제
                        </v-btn>
                    </template>
                </v-data-table>
                <v-col cols="12" class="text-right pb-0">
                    <v-btn outlined rounded color="info">
                        <v-icon left>add</v-icon>
                        신규 등록
                    </v-btn>
                </v-col>
            </app-card>
        </template>

        <deposit-management-dialog v-model="isDialog" :deposit-type="depositType"></deposit-management-dialog>
    </v-row>
</template>

<script>
/* import service from '@/api/modules/social/deposit.service'
import DepositDialog from '@/views/social/caclulate/DepositDialog.vue' */

export default {
  name: 'Deposit',
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      partnerList: [],
      partnerHeaders: [
        { text: '파트너명', value: 'partnerName', align: 'center', sortable: false },
        { text: '계약기간', value: 'contractTo', align: 'center', sortable: false }
      ],
      partnerNo: null,
      depositList: [],
      depositHeaders: [
        { text: '예치금 구분', value: 'depositType', align: 'center', sortable: false },
        { text: '예치금 KEY', value: 'depositKey', align: 'center', sortable: false },
        { text: '예치금', value: 'deposit', align: 'center', sortable: false },
        { text: 'Agent', value: 'agentCode', align: 'center', sortable: false },
        { text: '사용여부', value: 'isUse', align: 'center', sortable: false },
        { text: '액션', value: 'action', align: 'center', sortable: false }
      ],
      isDialog: false,
      partnerName: null,
      depositType: null
    }
  },
  components: {
    // FIXME DepositDialog
  },
  methods: {
    search () {
      // 조회
      /* FIXME service.selectPartnerList(this.searchParam).then(res => {
        const list = []
        for (const data of res.data) {
          list.push(data)
        }
        this.partnerList = list
        this.searchParam.total = this.partnerList.length
      }) */
    },
    getDepositList (event) {
      this.partnerNo = event.partnerNo
      this.partnerName = event.partnerName

      /* FIXME service.selectPartnerDepositList(this.partnerNo).then((response) => {
        this.depositList = response.data
      }) */
    },
    open (event) {
      this.depositType = event.depositType
      this.isDialog = true
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'partnerName', label: '파트너명', type: 'text' }
      ]
    },
    subheader () {
      return '예치금 등록관리 - ' + this.partnerName
    }
  }
}
</script>

<style scoped>

</style>
