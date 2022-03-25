<template>
    <v-card-text>
        <v-form ref="form" lazy-validation>
            <v-container fluid>
                <v-row>
                    <v-col md="8">
                        <v-row justify="space-between">
                            <v-col cols="6"><v-label>업체 상품 URL 관리</v-label></v-col>
                            <v-col cols="6" class="text-right">
                              <v-btn small rounded outlined @click="goodsUrlAdd()" color="info"><v-icon small>add</v-icon>추가</v-btn>
                            </v-col>
                        </v-row>
                        <v-data-table
                          :no-data-text="'데이터가 없습니다.'"
                          :no-result-text="'데이터가 없습니다..'"
                          :headers="headers" :items="form.goodsList" hide-default-footer class="bordered">
                            <template v-slot:item.move="{ item }">
                              <a :href="item.itemUrl" target="_blank">이동</a>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-btn small color="info" rounded outlined @click="goodsUrlAdd(item)"><v-icon small>check</v-icon>수정</v-btn>
                                <v-btn small color="accent" rounded outlined @click="remove(item)"><v-icon small>remove</v-icon>삭제</v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="text-right">
                        <v-btn color="info" @click="submit()" rounded>수정</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card-text>
</template>

<script>
import ticketService from 'Api/modules/social/ticket.service'

export default {
  props: { data: Object, close: Function, step: Function },
  name: 'TicketRegform4',
  data () {
    return {
      headers: [
        { text: '상품명', value: 'itemNm', align: 'center', sortable: false },
        { text: '주소', value: 'itemUrl', align: 'center', sortable: false },
        { text: '비고', value: 'memo', align: 'center', sortable: false },
        { text: '상품이동', value: 'move', align: 'center', sortable: false },
        { text: '삭제', value: 'action', align: 'center', sortable: false }
      ],
      form: {
        ticketNo: this.data.ticketNo,
        goodsList: []
      }
    }
  },
  mounted () {
    console.log('step 4 mounted')
    this.search()
  },
  methods: {
    // 업체 상품 URL 조회
    search () {
      ticketService.selectGoodsList(this.form.ticketNo).then(res => {
        if (res.data) {
          this.form.goodsList = res.data
        }
      })
    },
    // 업체 상품 URL 추가
    goodsUrlAdd (row) {
      let isNew = true
      let form = {
        ticketNo: this.data.ticketNo
      }
      if (row) {
        isNew = false
        form = this.cloneDeep(row)
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/GoodsUrlDialog',
        params: {
          isNew,
          form
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              // 신규 추가
              if (isNew) {
                let key = 0
                if (this.form.goodsList.length > 0) {
                  key = Number(_.maxBy(this.form.goodsList, 'sortSeq').sortSeq) + 1
                } else {
                  key = this.form.goodsList.length + 1
                }
                params.data.sortSeq = key
                this.form.goodsList.push(params.data)
              } else { // 수정
                const list = []
                for (let row of this.form.goodsList) {
                  if (params.data.sortSeq === row.sortSeq) {
                    row = params.data
                  }
                  list.push(row)
                }
                this.form.goodsList = list
              }
            }
          }
        }
      })
    },
    // 업체상품 URL 삭제
    remove (data) {
      this.$dialog.confirm('선택한 데이터를 삭제하시겠습니까?').then(() => {
        this.form.goodsList.splice(this.form.goodsList.indexOf(data), 1)
      }).catch(() => {})
    },
    // 업체상품 정보 등록/수정
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('업체상품 정보를 수정 하시겠습니까?').then(() => {
          ticketService.insertGoodsList(this.form).then(() => {
            this.$dialog.alert('등록 되었습니다.').then(() => {
            })
          })
        }).catch(() => {})
      })
    }
  }
}
</script>

<style scoped>
</style>
