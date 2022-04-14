<template>
  <v-row>
    <v-col>
      <app-card heading="정산 메뉴 관리">
        <calc-menu-list></calc-menu-list>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
import CalcMenuList from '@/components/Ota/Calculation/Menu/CalcMenuList.vue'

export default {
  name: 'CalculationMenu',
  components: {
    CalcMenuList
  }
}
</script>
