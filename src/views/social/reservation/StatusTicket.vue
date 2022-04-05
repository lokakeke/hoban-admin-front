<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'판매중/종료예정/종료 별 우대번호 조회'">

                <v-tabs v-model="tab" background-color="transparent" color="basil" grow >
                    <v-tab v-for="item in tabs" :key="item.title">
                        {{ item.title }}
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                    <v-tab-item v-for="(item,index) in tabs" :key="index">
                        <component :is="item.component"></component>
                    </v-tab-item>
                </v-tabs-items>

            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import StatusTicketTab1 from './StatusTicketTab1'
import StatusTicketTab2 from './StatusTicketTab2'
import StatusTicketTab3 from './StatusTicketTab3'
import StatusTicketTab4 from './StatusTicketTab4'
import StatusTicketTab5 from './StatusTicketTab5'
import StatusTicketTab6 from './StatusTicketTab6'

export default {
  components: { StatusTicketTab1, StatusTicketTab2, StatusTicketTab3, StatusTicketTab4, StatusTicketTab5, StatusTicketTab6 },
  name: 'StatusTicket',
  data () {
    return {
      tab: null,
      form: {},
      tabs: [
        { title: '판매중인 딜', component: 'statusTicketTab1' },
        { title: '판매종료 예정 딜', component: 'statusTicketTab2' },
        { title: '판매종료 딜', component: 'statusTicketTab3' },
        { title: '유효기간 유효 딜', component: 'statusTicketTab4' },
        { title: '유효기간 만료예정 딜', component: 'statusTicketTab5' },
        { title: '유효기간 만료 딜', component: 'statusTicketTab6' }
      ]
    }
  },
  mounted () {
  },
  methods: {
    search () {
    },
    getList () {
    }
  }

}
</script>

<style scoped>

</style>
