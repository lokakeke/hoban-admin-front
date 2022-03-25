<template>
  <v-row>
    <v-col>
      <app-card heading='위약 규정 관리'>
        <!-- 위약 규정 테이블 -->
        <penalty-rule-table @change="onChangePenaltyRule"></penalty-rule-table>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
import PenaltyRuleTable from 'Components/Ota/Calculation/PenaltyRule/PenaltyRuleTable.vue'

export default {
  name: 'PenaltyRuleManagement',
  components: {
    PenaltyRuleTable
  },
  data () {
    return {
      key: 0
    }
  },
  methods: {
    /**
     * 위약 규정 변경 이벤트 핸들러
     */
    onChangePenaltyRule () {
      this.key++
    }
  }
}
</script>

<style scoped>

</style>
