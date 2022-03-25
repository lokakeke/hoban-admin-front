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
import CalcMenuList from 'Components/Ota/Calculation/Menu/CalcMenuList.vue'

export default {
  name: 'MenuManagement',
  components: {
    CalcMenuList
  }
}
</script>
