<template>
    <v-btn class="ma-2" outlined color="black" @click="openDialog">
        <v-icon v-if="icon" class="ml-1">{{ icon }}</v-icon>
        <span v-else>조회</span>
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                persistent
                max-width="1000px"
            >
                <v-card>
                    <v-card-title>
                        <span class="headline">종류구분코드 검색</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-row justify="space-between" @keypress.enter="search">
                                        <v-col cols="11">
                                            <v-text-field v-model="typeDivCode" append-icon="search" clearable
                                                          label="종류구분코드 / 명" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="1" align-self="center" class="text-right">
                                            <v-btn outlined rounded color="primary" @click="search">
                                                <v-icon>search</v-icon>
                                                검색
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-data-table :no-data-text="'데이터가 없습니다.'" :no-result-text="'데이터가 없습니다..'"
                                                  @click:row="setTicket($event)" :headers="headers"
                                                  :items="typeDivCodeList" hide-default-footer>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-col cols="12" class="text-right">
                            <v-btn text @click="close()">닫기</v-btn>
                        </v-col>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-btn>
</template>

<script>
import dgnsTickerService from '@/api/modules/social/dgnsTicket.service'

export default {
  props: ['data', 'icon'],
  name: 'TypeDivCodeSearchForm',
  data () {
    return {
      dialog: false,
      headers: [
        { text: '종류구분 코드', value: 'typeDivCode', align: 'center', sortable: false },
        { text: '종류구분 코드명', value: 'typeDivCodeName', align: 'center', sortable: false }
      ],
      typeDivCode: '',
      searchParam: {},
      typeDivCodeList: []
    }
  },
  mounted () {
  },
  methods: {
    openDialog () {
      if (!this.dialog) {
        this.dialog = true
      }
      if (this.data.typeDivCode) {
        this.typeDivCode = this.data.typeDivCode
      }
      this.search()
    },
    search () {
      dgnsTickerService.selectTypeDivCode(this.searchParam).then(res => {
        this.typeDivCodeList = this.cloneDeep(res.data).filter(data => data.typeDivCode === this.typeDivCode)
      })
    },
    setTicket (info) {
      this.$emit('update:data', Object.assign({}, this.data, info))
      this.close()
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
</style>
