<template>
  <v-list>
    <v-list-item class="calc-menu-header">
      <div>파트너</div>
      <v-spacer></v-spacer>
      <div class="text-right">
        정산 메뉴 노출 설정
      </div>
    </v-list-item>
    <v-list-item v-for="calcMenu in calcMenuList" :key="calcMenu.ptnrNo" class="calc-menu-item">
      <div>
        <v-chip x-small>{{ calcMenu.ptnrNo }}</v-chip>
        <span class="ml-2">{{ calcMenu.ptnrName }}</span>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom v-for="calcMenuCode in calcMenuCodeList" :key="calcMenuCode.commCode">
        <template v-slot:activator="{ on }">
          <v-btn
            :color="calcMenu.openCalcMenu[calcMenuCode.commCode] === true ? 'green' : 'grey'"
            class="ml-1"
            :style="{ 'color': calcMenu.openCalcMenu[calcMenuCode.commCode] === true ? 'white' : '#ddd' }"
            @click="toggleCalcMenu(calcMenu, calcMenuCode)"
            v-on="on"
          >{{ calcMenuCode.commCodeName }}</v-btn>
        </template>
        클릭하면 "{{ calcMenu.ptnrName }}" 파트너에게 " {{ calcMenuCode.commCodeName }}" 정산 메뉴를 {{ calcMenu.openCalcMenu[calcMenuCode.commCd] === true ? '숨깁니다.' : '노출합니다.' }}
      </v-tooltip>
    </v-list-item>
  </v-list>
</template>

<script>
import calculationMenuService from '@/api/modules/ota/calculationMenu.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'CalcMenuList',
  data () {
    return {
      /**
       * 정산 메뉴 목록
       */
      calcMenuList: null,
      /**
       * 정산 메뉴 코드 목록
       */
      calcMenuCodeList: null
    }
  },
  async created () {
    await this.selectCalcMenuCodeList()
    this.selectCalcMenuList()
  },
  methods: {
    /**
     * 정산 메뉴 목록 조회
     */
    async selectCalcMenuList () {
      const res = await calculationMenuService.selectCalcMenuList()
      this.calcMenuList = res.data
    },
    /**
     * 정산 메뉴 조회
     */
    async selectCalcMenu (ptnrNo) {
      const res = await calculationMenuService.selectCalcMenu(ptnrNo)
      if (this.calcMenuList) {
        this.calcMenuList.some((calcMenu) => {
          if (calcMenu.ptnrNo === res.data.ptnrNo) {
            calcMenu.openCalcMenu = res.data.openCalcMenu
            return true
          }
          return false
        })
      }
    },
    /**
     * 정산 메뉴 코드 목록 조회
     */
    async selectCalcMenuCodeList () {
      const res = await commonCodeService.selectCommonCode('OTA0006')
      this.calcMenuCodeList = res.data
    },
    /**
     * 정산 메뉴 열기/닫기
     */
    async toggleCalcMenu ({ ptnrNo, ptnrName, openCalcMenu }, calcMenuCode) {
      if (this.writeAuth === true) {
        const openYn = openCalcMenu[calcMenuCode.commCd] === true ? 'N' : 'Y'
        await calculationMenuService.toggleCalcMenu(
          ptnrNo,
          calcMenuCode.commCd,
          openYn
        )
        this.selectCalcMenu(ptnrNo)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.calc-menu-header {
  font-size: 11px;
  padding: 7px 12px 0 12px;
  border-bottom: 1px solid #ddd;
}
.calc-menu-item {
  padding: 7px 12px;
  border-bottom: 1px solid #ddd;
  &:hover {
    background-color: #eee;
  }
}
</style>
