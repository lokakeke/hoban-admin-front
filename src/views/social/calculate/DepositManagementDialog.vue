<template>
    <v-dialog
        :value="value"
        @input="close(false)"
        fullscreen
        scrollable
        persistent
        transition="dialog-bottom-transition"
    >
        <v-card tile>
            <v-card-title class="pa-0">
                <v-toolbar dark flat color="primary" dense>
                    <v-btn icon dark @click="close(false)">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>예치금 상세 - {{ depositType }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="close(false)">Close</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container fluid v-if="value">
                    <v-card flat>
                        <v-card-title>예치금 상세 리스트</v-card-title>
                        <v-card-text>
                            <v-data-table :no-data-text="'검색 결과가 없습니다.'" :headers="depositHeaders" :items="depositList"
                                          item-key="partnerNo" hide-default-footer class="click-row"
                                          @click:row="open($event)">
                            </v-data-table>
                            <v-col cols="12" class="text-right pb-0">
                                <v-btn class="ma-2" outlined rounded icon color="info">
                                    <v-icon>add</v-icon>
                                </v-btn>
                                <v-btn outlined rounded color="info">
                                    <v-icon left>dashboard</v-icon>
                                    엑셀 다운로드
                                </v-btn>
                                <v-btn outlined rounded color="info">
                                    <v-icon left>calendar_today</v-icon>
                                    월력보기
                                </v-btn>
                            </v-col>
                        </v-card-text>
                    </v-card>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'DepositManagementDialog',
  props: ['value', 'depositType'],
  data () {
    return {
      dialog: false,
      depositHeaders: [
        { text: 'No', value: 'depositNo', align: 'center', sortable: false },
        { text: '작성일자', value: 'registerDated', align: 'center', sortable: false },
        { text: '입금은행', value: 'bankName', align: 'center', sortable: false },
        { text: '계좌번호', value: 'accountNumber', align: 'center', sortable: false },
        { text: '입금예정일', value: 'expectedDate', align: 'center', sortable: false },
        { text: '입금예정액', value: 'expectedDeposit', align: 'center', sortable: false },
        { text: '비고', value: 'reference', align: 'center', sortable: false },
        { text: '승인자', value: '', align: 'center', sortable: false },
        { text: '승인일자', value: '', align: 'center', sortable: false },
        { text: '승인여부', value: '', align: 'center', sortable: false }
      ],
      depositList: []
    }
  },
  methods: {
    close (status) {
      this.$emit('input', status)
    }
  }
}
</script>

<style scoped>

</style>
