<template>
  <v-row>
    <v-col>
      <app-card heading="정산 일자 관리">
        <calc-day-calendar></calc-day-calendar>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
import CalcDayCalendar from '@/components/Ota/Calculation/Day/CalcDayCalendar.vue'

export default {
  name: 'Day',
  components: {
    CalcDayCalendar
  }
}
</script>
