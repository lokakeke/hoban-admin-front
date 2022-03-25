<template>
  <div class="mt-5 mb-7">
    <v-data-table
      :no-data-text="emptyText"
      :headers="headers"
      :items="list"
      :items-per-page="5"
      :footer-props="{
          'items-per-page-text': '페이지당 데이터 개수',
          'items-per-page-all-text': '전체'
        }"
      disable-sort
      :hide-default-footer="list.length === 0"
      :loading="isLoading"
      loading-text="조회 중입니다. 잠시만 기다려주세요..."
      class="elevation-5"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <template v-if="commissionType === 'MemberInd'">
              {{ commission.memIndNm }}
              <v-chip x-small class="ml-1">{{ commission.memInd }}</v-chip>
            </template>
            <template v-else>
              {{ commission.memNm }}
              <v-chip x-small class="ml-1">{{ commission.memNo }}</v-chip>
            </template>
            {{ commissionTypeText }} 수수료 리스트
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="info" outlined @click="openCreateCommissionDialog(commission)" v-if="writeAuth">
            <v-icon left>add</v-icon>새로운 {{ commissionTypeText }} 수수료 등록
          </v-btn>
        </v-toolbar>
      </template>
      <!-- 적용여부 -->
      <template v-slot:item.applyYn="{ item }">
        <strong class="info--text" v-if="item.applyYn === 'Y'">
          <v-icon small left>check</v-icon>적용됨
        </strong>
      </template>
      <!-- 적용일자 -->
      <template v-slot:item.applyYmd="{ item }">
        <strong>{{ item.applyYmd | date }}</strong>
      </template>
      <!-- 적용기간 -->
      <template v-slot:item.applyRangeYmd="{ item }">
        <strong>{{ item.applyBgnYmd | date }} ~ {{ item.applyEndYmd | date }}</strong>
      </template>
      <!-- 사용여부 -->
      <template v-slot:item.useYn="{ item }">
        <v-btn small color="info" outlined v-model="item.useYn" @click="toggleCommissionUseYn(item)" v-if="item.useYn === 'Y'">
          <span class="info--text">
            <v-icon>check</v-icon>사용함
          </span>
        </v-btn>
        <v-btn small color="error" outlined v-model="item.useYn" @click="toggleCommissionUseYn(item)" v-else>
          <span class="error--text">
            <v-icon>close</v-icon>사용안함
          </span>
        </v-btn>
      </template>
      <!-- 등록일시 -->
      <template v-slot:item.crtDt="{ item }">{{ item.crtDt | dateSet }}</template>
      <!-- 수정일시 -->
      <template v-slot:item.updDt="{ item }">{{ item.updDt | dateSet }}</template>
      <template v-slot:item.actions="{ item }">
        <div class="mt-2 mb-2" v-if="writeAuth">
          <v-btn small color="info" outlined @click="openUpdateCommissionDialog(item)">
            <v-icon left>edit</v-icon>수정
          </v-btn>
          <v-btn small color="info" outlined @click="openCopyCommissionDialog(item)">
            <v-icon left>mdi-content-copy</v-icon>복사
          </v-btn>
          <v-btn small color="error" outlined @click="deleteCommission(item)">
            <v-icon left>mdi-trash-can-outline</v-icon>삭제
          </v-btn>
        </div>
        <div class="mt-2 mb-2" v-else>
          <v-btn small color="info" outlined @click="openUpdateCommissionDialog(item)">
            <v-icon left>pageview</v-icon>보기
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CommissionCommonSubList',
  props: {
    /**
     * 수수료 항목
     */
    commission: {
      type: Object,
      required: true
    },
    /**
     * 수수료 유형 [Basic|Promotion|MemberInd]
     */
    commissionType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 5,
        total: 0
      },
      /**
       * 목록
       */
      list: [],
      headers: [
        {
          text: '적용여부',
          value: 'applyYn',
          align: 'center',
          sortable: false
        },
        {
          text: '적용일자',
          value: 'applyYmd',
          align: 'center',
          sortable: false
        },
        { text: '등록일시', value: 'crtDt', align: 'center', sortable: false },
        { text: '수정일시', value: 'updDt', align: 'center', sortable: false },
        { text: '사용여부', value: 'useYn', align: 'center', sortable: false },
        { text: '기능', value: 'actions', align: 'center', sortable: false }
      ],
      isLoading: true
    }
  },
  computed: {
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
    }
  },
  watch: {
    'commission.memNo' (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.getCommissionList()
      }
    },
    'commission.memInd' (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.getCommissionList()
      }
    }
  },
  created () {
    // 프로모션의 경우 적용일자 대신 적용기간을 노출
    if (this.commissionType === 'Promotion') {
      this.headers.some(header => {
        if (header.value === 'applyYmd') {
          header.text = '적용기간'
          header.value = 'applyRangeYmd'
          return true
        }
        return false
      })
    }
    this.getCommissionList()
  },
  methods: {
    /**
     * 수수료 목록 조회
     */
    async getCommissionList () {
      this.isLoading = true
      this.list = []
      const selectListFunction = this.commissionService[`selectCommission${this.commissionType}List`]
      let response = null
      if (this.commissionType === 'MemberInd') {
        response = await selectListFunction(this.commission.memInd)
      } else {
        response = await selectListFunction(this.commission.memNo)
      }
      this.list = response.data
      this.isLoading = false
    },
    /**
     * 수수료 등록 Dialog 열기
     */
    openCreateCommissionDialog (item) {
      // 이미 해당 항목에 등록된 적용일자(혹은 기간) 목록을 전달해야함
      const existApplyYmdList = []
      this.list.forEach(item => {
        if (this.commissionType === 'Promotion') {
          existApplyYmdList.push({
            applyBgnYmd: item.applyBgnYmd,
            applyEndYmd: item.applyEndYmd
          })
        } else {
          existApplyYmdList.push(item.applyYmd)
        }
      })
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Commission/Common/CommissionCommonDetailDialog',
        params: {
          commissionType: this.commissionType,
          memNo: this.commission.memNo,
          memNm: this.commission.memNm,
          memInd: this.commission.memInd,
          memIndNm: this.commission.memIndNm,
          existApplyYmdList
        },
        options: {
          scrollable: true,
          closeCallback: result => {
            if (result) {
              this.getCommissionList()
              this.$emit('refresh')
            }
          }
        }
      })
    },
    /**
     * 수수료 수정 Dialog 열기
     */
    openUpdateCommissionDialog (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Commission/Common/CommissionCommonDetailDialog',
        params: {
          commissionType: this.commissionType,
          memNo: item.memNo,
          memInd: item.memInd,
          applyYmd: item.applyYmd,
          applyBgnYmd: item.applyBgnYmd,
          applyEndYmd: item.applyEndYmd
        },
        options: {
          scrollable: true,
          closeCallback: result => {
            if (result) {
              this.getCommissionList()
              this.$emit('refresh')
            }
          }
        }
      })
    },
    /**
     * 수수료 복사 Dialog 열기
     */
    openCopyCommissionDialog (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Commission/Common/CommissionCommonCopyDialog',
        params: {
          commissionType: this.commissionType,
          memNo: item.memNo,
          memNm: item.memNm,
          memInd: item.memInd,
          memIndNm: item.memIndNm,
          applyYmd: item.applyYmd,
          applyBgnYmd: item.applyBgnYmd,
          applyEndYmd: item.applyEndYmd
        },
        options: {
          scrollable: true,
          closeCallback: result => {
            if (result) {
              this.getCommissionList()
              this.$emit('refresh')
            }
          }
        }
      })
    },
    /**
     * 수수료 삭제
     */
    deleteCommission (item) {
      let applyYmdText = null
      if (this.commissionType === 'Promotion') {
        applyYmdText = this.$options.filters.date(item.applyBgnYmd) + ' ~ ' + this.$options.filters.date(item.applyEndYmd)
      } else {
        applyYmdText = this.$options.filters.date(item.applyYmd)
      }
      this.$dialog
        .confirm(
          `정말로 '${applyYmdText}' 수수료 정보를 삭제하시겠습니까?`
        )
        .then(async () => {
          const deleteFuntion = this.commissionService[`deleteCommission${this.commissionType}`]
          if (this.commissionType === 'Basic') {
            // 기본
            await deleteFuntion(
              item.memNo,
              item.applyYmd
            )
          } else if (this.commissionType === 'Promotion') {
            // 프로모션
            await deleteFuntion(
              item.memNo,
              item.applyBgnYmd,
              item.applyEndYmd
            )
          } else if (this.commissionType === 'MemberInd') {
            // 회원구분
            await deleteFuntion(
              item.memInd,
              item.applyYmd
            )
          }
          // 다시 목록 조회
          this.getCommissionList()
          this.$emit('refresh')
          await this.$dialog.alert('삭제되었습니다.')
        })
        .catch(() => {})
    },
    /**
     * 수수료 사용여부 토글
     */
    toggleCommissionUseYn (item) {
      const isUse = item.useYn !== 'Y'
      this.$dialog
        .confirm(
          `정말로 '${this.$options.filters.date(item.applyYmd)}' 수수료 정보를 '${isUse === true ? '사용함' : '사용안함'}'으로 변경하시겠습니까?`
        )
        .then(async () => {
          const useYn = isUse === true ? 'Y' : 'N'
          const updateFuntion = this.commissionService[`updateCommission${this.commissionType}UseYn`]
          if (this.commissionType === 'Basic') {
            // 기본
            await updateFuntion(
              item.memNo,
              item.applyYmd,
              useYn
            )
          } else if (this.commissionType === 'Promotion') {
            // 프로모션
            await updateFuntion(
              item.memNo,
              item.applyBgnYmd,
              item.applyEndYmd,
              useYn
            )
          } else if (this.commissionType === 'MemberInd') {
            // 회원구분
            await updateFuntion(
              item.memInd,
              item.applyYmd,
              useYn
            )
          }
          // 다시 목록 조회
          this.getCommissionList()
          this.$emit('refresh')
          await this.$dialog.alert('수정되었습니다.')
        })
        .catch(() => {})
    }
  }
}
</script>
