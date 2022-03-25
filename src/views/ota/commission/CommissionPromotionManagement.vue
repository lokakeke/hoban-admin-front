<template>
  <v-row wrap>
    <app-card heading="회원번호별 프로모션 수수료 리스트" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="getCommissionPromotionGroupList"
      ></search-form>
      <v-data-table
        :no-data-text="emptyText"
        :headers="headers"
        :items="list"
        item-key="memNo"
        :expanded.sync="expanded"
        single-expand
        disable-sort
        hide-default-footer
        disable-pagination
        class="click-row bordered"
        @click:row="expandRow"
      >
        <!-- 회원번호 -->
        <template v-slot:item.memNo="{ item }">
          {{ item.memNm }}
          <v-chip x-small class="ml-1">{{ item.memNo }}</v-chip>
        </template>
        <!-- 등록여부 -->
        <template v-slot:item.existYn="{ item }">
          <strong class="info--text" v-if="item.existYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>등록됨</strong>
          <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>등록안됨</strong>
        </template>
        <!-- 현재 적용기간 -->
        <template v-slot:item.applyRangeYmd="{ item }">
          <strong v-if="item.applyBgnYmd">{{ item.applyBgnYmd | date }} ~ {{ item.applyEndYmd | date }}</strong>
          <span class="grey--text text--lighten-1" v-else>(적용된 설정없음)</span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <!-- 각 회원번호, 적용시작일자별 수수료 리스트 -->
          <td :colspan="headers.length">
            <commission-common-sub-list
              :commission="item"
              commission-type="Promotion"
              v-if="expanded.length > 0 && expanded[0].memNo === item.memNo"
              @refresh="getCommissionPromotionGroupList(true)"
            ></commission-common-sub-list>
          </td>
        </template>
      </v-data-table>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="getCommissionPromotionGroupList"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import CommissionCommonSubList from 'Components/Ota/Commission/Common/CommissionCommonSubList.vue'
import commissionPromotionService from 'Api/modules/ota/commissionPromotion.service'

export default {
  name: 'CommissionPromotionManagement',
  components: {
    CommissionCommonSubList
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        {
          text: '회원번호',
          value: 'memNo',
          align: 'center',
          sortable: false
        },
        {
          text: '정산유형',
          value: 'calcTypeNm',
          align: 'center',
          sortable: false
        },
        {
          text: '등록여부',
          value: 'existYn',
          align: 'center',
          sortable: false
        },
        {
          text: '현재 적용기간',
          value: 'applyRangeYmd',
          align: 'center',
          sortable: false
        }
      ],
      expanded: []
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'memNo', label: '회원번호', type: 'text' },
        {
          key: 'calcTypeCd',
          label: '정산유형',
          type: 'dgnsCode',
          commCd: 'RSL0114'
        },
        {
          key: 'existYn',
          label: '등록여부',
          type: 'select',
          list: [
            {
              text: '등록됨',
              value: 'Y'
            },
            {
              text: '등록안됨',
              value: 'N'
            }
          ]
        },
        {
          key: 'applyBgnYmd',
          label: '적용시작일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        },
        {
          key: 'applyEndYmd',
          label: '적용종료일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        }
      ]
    }
  },
  methods: {
    /**
     * 프로모션 수수료 그룹 목록 조회
     */
    async getCommissionPromotionGroupList (isRefresh) {
      if (isRefresh !== true) { // 단순 새로고침
        this.expanded = [] // 행 확장 초기화
      }
      const response = await commissionPromotionService.selectCommissionPromotionGroupList(this.searchParam)
      this.list = response.data
      this.searchParam.total = response.pagination.total
    },
    /**
     * 행 확장
     */
    expandRow (item, body) {
      body.expand(!body.isExpanded)
    }
  }
}
</script>
