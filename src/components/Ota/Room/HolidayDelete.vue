<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      휴일삭제
    </template>
    <v-container fluid>
      <v-row>
        <v-col>
          <p class="h6 red--text">※ 오늘날짜를 기준으로 미래의 날짜에 지정한 휴일을 삭제합니다.</p>
          <v-select
              :items="types"
              item-text="text"
              item-value="hldyCode"
              label="휴일을 제거할 타입을 지정해주세요"
              v-model="type"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-end">
          <v-btn @click="deleteHoliday"
                 color="primary"
          >
            삭제
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'HolidayDelete',
  data: function () {
    return {
      events: [],
      types: [
        { text: '전체', hldyCode: 'A' },
        { text: '영업장', hldyCode: 'S' },
        { text: '객실', hldyCode: 'R' }
      ],
      type: ''
    }
  },
  mounted () {
    this.events = this.instance.params.events
  },
  methods: {
    async deleteHoliday () {
      if (!this.type) {
        this.$dialog.alert('타입을 지정해주세요')
        return
      }

      try {
        await this.$dialog.confirm('오늘날짜를 기준으로 휴일 데이터가 모두 삭제됩니다. 계속 진행하시겠습니까?')

        const typeFilterEvents = this.type === 'A' ? this.events : this.events.filter((event) => event.hldyCode === this.type)

        const today = moment().format('YYYY-MM-DD')
        const filterEvents = typeFilterEvents.filter((event) => {
          return moment(event.start).isSameOrAfter(moment(today))
        })

        const resultEvents = this.events.filter(data => {
          return filterEvents.findIndex(row => {
            return data.storeCode === row.storeCode && data.hldyCode === row.hldyCode && data.rmTypeCode === row.rmTypeCode && data.start === row.start
          }) === -1
        })

        this.close(resultEvents)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
