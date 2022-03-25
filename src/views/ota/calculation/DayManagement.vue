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
import CalcDayCalendar from 'Components/Ota/Calculation/Day/CalcDayCalendar.vue'

export default {
  name: 'DayManagement',
  components: {
    CalcDayCalendar
  }
}
</script>
