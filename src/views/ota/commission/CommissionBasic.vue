<template>
  <v-row wrap>
    <app-card col-classes="col-12">
      <template v-slot:heading>
        회원구분별 기본 수수료 리스트
        <v-spacer></v-spacer>
        <v-btn outlined rounded color="primary" @click="getCommissionMemberIndGroupList">
          <v-icon left>refresh</v-icon>새로고침
        </v-btn>
      </template>
      <v-data-table
        :no-data-text="emptyText"
        :headers="memberInd.headers"
        :items="memberInd.list"
        item-key="memInd"
        :expanded.sync="memberInd.expanded"
        single-expand
        disable-sort
        hide-default-footer
        disable-pagination
        class="click-row bordered"
        @click:row="expandRow"
      >
        <!-- 회원구분 -->
        <template v-slot:item.memInd="{ item }">
          {{ item.memIndName }}
          <v-chip x-small class="ml-1">{{ item.memInd }}</v-chip>
        </template>
        <!-- 등록여부 -->
        <template v-slot:item.existYn="{ item }">
          <strong class="info--text" v-if="item.existYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>등록됨</strong>
          <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>등록안됨</strong>
        </template>
        <!-- 현재 적용일자 -->
        <template v-slot:item.applyYmd="{ item }">
          <strong>{{ item.applyYmd | date }}</strong>
          <span class="grey--text text--lighten-1" v-if="!item.applyYmd">(적용된 설정없음)</span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <!-- 각 회원번호, 적용일자별 수수료 리스트 -->
          <td :colspan="headers.length">
            <commission-common-sub-list
              :commission="item"
              commission-type="MemberInd"
              v-if="memberInd.expanded.length > 0 && memberInd.expanded[0].memNo === item.memNo"
              @refresh="getCommissionMemberIndGroupList(true)"
            ></commission-common-sub-list>
          </td>
        </template>
      </v-data-table>
    </app-card>
    <app-card heading="회원번호별 기본 수수료 리스트" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="getCommissionBasicGroupList"
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
          {{ item.memName }}
          <v-chip x-small class="ml-1">{{ item.memNo }}</v-chip>
        </template>
        <!-- 등록여부 -->
        <template v-slot:item.existYn="{ item }">
          <strong class="info--text" v-if="item.existYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>등록됨</strong>
          <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>등록안됨</strong>
        </template>
        <!-- 현재 적용일자 -->
        <template v-slot:item.applyYmd="{ item }">
          <strong>{{ item.applyYmd | date }}</strong>
          <span class="grey--text text--lighten-1" v-if="!item.applyYmd">(적용된 설정없음)</span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <!-- 각 회원번호, 적용일자별 수수료 리스트 -->
          <td :colspan="headers.length">
            <commission-common-sub-list
              :commission="item"
              commission-type="Basic"
              v-if="expanded.length > 0 && expanded[0].memNo === item.memNo"
              @refresh="getCommissionBasicGroupList(true)"
            ></commission-common-sub-list>
          </td>
        </template>
      </v-data-table>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="getCommissionBasicGroupList"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import CommissionCommonSubList from '@/components/Ota/Commission/Common/CommissionCommonSubList.vue'
import commissionBasicService from '@/api/modules/ota/commissionBasic.service'
import commissionMemberIndService from '@/api/modules/ota/commissionMemberInd.service'

export default {
  name: 'CommissionBasic',
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
          value: 'calcTypeName',
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
          text: '현재 적용일자',
          value: 'applyYmd',
          align: 'center',
          sortable: false
        }
      ],
      /**
       * 확장된 회원번호별 수수료 목록
       */
      expanded: [],
      /**
       * 회원구분 관련
       */
      memberInd: {
        list: [],
        headers: [
          {
            text: '회원구분',
            value: 'memInd',
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
            text: '현재 적용일자',
            value: 'applyYmd',
            align: 'center',
            sortable: false
          }
        ],
        /**
         * 확장된 회원구분별 수수료 목록
         */
        expanded: []
      }
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'memNo', label: '회원번호', type: 'text' },
        {
          key: 'calcTypeCode',
          label: '정산유형',
          type: 'dgnsCode',
          commCode: 'RSL0114'
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
          key: 'applyYmd',
          label: '적용일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        }
      ]
    }
  },
  created () {
    this.getCommissionMemberIndGroupList()
  },
  methods: {
    /**
     * 기본 수수료 그룹 목록 조회
     */
    async getCommissionBasicGroupList (isRefresh) {
      if (isRefresh !== true) { // 단순 새로고침
        this.expanded = [] // 행 확장 초기화
      }
      const response = await commissionBasicService.selectCommissionBasicGroupList(this.searchParam)
      this.list = response.data
      this.searchParam.total = response.pagination.total
    },
    /**
     * 회원구분 수수료 그룹 목록 조회
     */
    async getCommissionMemberIndGroupList (isRefresh) {
      if (isRefresh !== true) { // 단순 새로고침
        this.memberInd.expanded = [] // 행 확장 초기화
      }
      const response = await commissionMemberIndService.selectCommissionMemberIndGroupList()
      this.memberInd.list = response.data
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
