<template>
  <dialog-base :title="`${commissionTypeText} 수수료 복사`" :instance="instance">
    <v-banner elevation="5">
      <v-avatar slot="icon" color="primary">
        <v-icon color="white">mdi-content-copy</v-icon>
      </v-avatar>
      <h3>
        <template v-if="commissionType === 'MemberInd'">
          {{ instance.params.memIndName }}
          <v-chip small class="ml-1">{{ instance.params.memInd }}</v-chip>
        </template>
        <template v-else>
          {{ instance.params.memName }}
          <v-chip small class="ml-1">{{ instance.params.memNo }}</v-chip>
        </template>
        <template
          v-if="commissionType === 'Promotion'"
        >회원의 {{ instance.params.applyBgnYmd | date }} ~ {{ instance.params.applyEndYmd | date }} 프로모션 수수료 설정을 복사합니다.</template>
        <template
          v-else
        >회원의 {{ instance.params.applyYmd | date }} {{ commissionTypeText }} 수수료 설정을 복사합니다.</template>
      </h3>
      <h3>복사할 대상의 회원{{ commissionType === 'MemberInd' ? '구분' : ' 번호' }}를 아래 목록에서 검색하여 선택해 주세요.</h3>
    </v-banner>
    <search-form
      class="mt-6"
      init-search
      :search-param.sync="searchParam"
      :search-list="searchList"
      @search="getCommissionGroupList"
      v-if="commissionType !== 'MemberInd'"
    ></search-form>
    <v-data-table
      :class="{ 'mt-6': commissionType === 'MemberInd' }"
      :no-data-text="emptyText"
      :headers="headers"
      :items="list"
      item-key="memNo"
      disable-sort
      hide-default-footer
      disable-pagination
      class="click-row bordered"
    >
      <!-- 대상 선택 -->
      <template v-slot:item.actions="{ item }">
        <v-btn color="info" outlined @click="chooseCopyTarget(item)">
          <v-icon left>mdi-check</v-icon>선택
        </v-btn>
      </template>
      <!-- 회원번호 -->
      <template v-slot:item.memNo="{ item }">
        {{ item.memName }}
        <v-chip x-small class="ml-1">{{ item.memNo }}</v-chip>
      </template>
      <!-- 회원번호 -->
      <template v-slot:item.memInd="{ item }">
        {{ item.memIndName }}
        <v-chip x-small class="ml-1">{{ item.memInd }}</v-chip>
      </template>
      <!-- 등록여부 -->
      <template v-slot:item.existYn="{ item }">
        <strong class="info--text" v-if="item.existYn === 'Y'">
          <v-icon small color="info" left>mdi-check</v-icon>등록됨
        </strong>
        <strong class="error--text" v-else>
          <v-icon small color="error" left>mdi-close</v-icon>등록안됨
        </strong>
      </template>
      <!-- 현재 적용일자 -->
      <template v-slot:item.applyYmd="{ item }">
        <strong>{{ item.applyYmd | date }}</strong>
        <span class="grey--text text--lighten-1" v-if="!item.applyYmd">(적용된 설정없음)</span>
      </template>
      <!-- 현재 적용기간 -->
      <template v-slot:item.applyRangeYmd="{ item }">
        <strong
          v-if="item.applyBgnYmd"
        >{{ item.applyBgnYmd | date }} ~ {{ item.applyEndYmd | date }}</strong>
        <span class="grey--text text--lighten-1" v-else>(적용된 설정없음)</span>
      </template>
    </v-data-table>
    <search-pagination
      v-model="searchParam"
      :total-visible="10"
      circle
      @change="getCommissionGroupList"
      v-if="commissionType !== 'MemberInd'"
    ></search-pagination>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'CommissionCommonCopyDialog',
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
          text: '대상 선택',
          value: 'actions',
          align: 'center',
          sortable: false
        },
        {
          text: '회원번호',
          value: 'memNo',
          align: 'center',
          sortable: false
        },
        {
          text: '정산유형',
          value: 'calcTypeCode',
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
      ]
    }
  },
  computed: {
    /**
     * 수수료 유형
     */
    commissionType () {
      return this.instance.params.commissionType // Basic or Promotion or MemberInd
    },
    /**
     * 수수료 유형별 텍스트
     */
    commissionTypeText () {
      if (this.commissionType === 'Basic') {
        return '기본'
      } else if (this.commissionType === 'Promotion') {
        return '프로모션'
      } else if (this.commissionType === 'MemberInd') {
        return '회원구분'
      }
      return ''
    },
    /**
     * 수수료 서비스 객체
     */
    commissionService () {
      return require(`Api/modules/ota/commission${this.commissionType}.service`)
        .default
    },
    searchList () {
      if (this.commissionType === 'MemberInd') {
        return []
      }
      const searchList = [
        {
          key: 'memNo',
          label: '회원번호',
          type: 'text'
        }
      ]
      if (this.commissionType !== 'MemberInd') {
        searchList.push({
          key: 'calcTypeCode',
          label: '정산유형',
          type: 'dgnsCode',
          commCd: 'RSL0114'
        })
      }
      if (this.commissionType === 'Promotion') {
        searchList.push({
          key: 'applyBgnYmd',
          label: '적용시작일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        })
        searchList.push({
          key: 'applyEndYmd',
          label: '적용종료일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        })
      } else {
        searchList.push({
          key: 'applyYmd',
          label: '적용일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        })
      }
      return searchList
    }
  },
  created () {
    // commissionType에 맞게 headers를 편집
    if (this.commissionType === 'Promotion') {
      this.headers.some(header => {
        if (header.value === 'applyYmd') {
          header.text = '현재 적용기간'
          header.value = 'applyRangeYmd'
          return true
        }
        return false
      })
    } else if (this.commissionType === 'MemberInd') {
      this.headers.some(header => {
        if (header.value === 'memNo') {
          header.text = '회원구분'
          header.value = 'memInd'
          return true
        }
        return false
      })
      // 회원구분은 목록 조회를 별도로 실행
      this.getCommissionGroupList()
    }
  },
  methods: {
    /**
     * 수수료 그룹 목록 조회
     */
    async getCommissionGroupList () {
      const selectGroupListFunction = this.commissionService[
        `selectCommission${this.commissionType}GroupList`
      ]
      const response = await selectGroupListFunction(this.searchParam)
      this.list = response.data
      if (response.pagination) {
        this.searchParam.total = response.pagination.total
      }
    },
    /**
     * 수수료 복사 대상 선택
     */
    async chooseCopyTarget ({ memNo, memName, memInd, memIndName }) {
      // 이미 해당 항목에 등록된 적용일자(혹은 기간) 목록을 전달해야함
      const existApplyYmdList = []
      const selectListFunction = this.commissionService[
        `selectCommission${this.commissionType}List`
      ]
      let response = null
      if (this.commissionType === 'MemberInd') {
        response = await selectListFunction(memInd)
      } else {
        response = await selectListFunction(memNo)
      }
      response.data.forEach(item => {
        existApplyYmdList.push(
          this.commissionType === 'Promotion'
            ? {
              applyBgnYmd: item.applyBgnYmd,
              applyEndYmd: item.applyEndYmd
            }
            : item.applyYmd
        )
      })
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Commission/Common/CommissionCommonDetailDialog',
        params: {
          commissionType: this.instance.params.commissionType,
          memNo: this.instance.params.memNo,
          memName: this.instance.params.memName,
          memInd: this.instance.params.memInd,
          memIndName: this.instance.params.memIndName,
          applyYmd: this.instance.params.applyYmd,
          applyBgnYmd: this.instance.params.applyBgnYmd,
          applyEndYmd: this.instance.params.applyEndYmd,
          copyTarget: {
            memNo,
            memName,
            memInd,
            memIndName
          },
          existApplyYmdList
        },
        options: {
          scrollable: true,
          closeCallback: result => {
            this.close(result)
          }
        }
      })
    }
  }
}
</script>
