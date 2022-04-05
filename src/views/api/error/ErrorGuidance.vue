<template>
    <v-row wrap>
        <app-card heading="오류 추천 목록" col-classes="col-12">
            <search-form
                init-search
                :search-param.sync="searchParam"
                :search-list="searchList"
                @search="selectErrorGuidanceList"
            ></search-form>
            <v-data-table
                :value="list"
                :no-data-text="emptyText"
                :headers="headers"
                :items="list"
                item-key="rowSeq"
                hide-default-footer
                disable-pagination
                @click:row="openViewErrorGuidanceDialog"
                class="click-row bordered"
            >
                <template v-slot:[`item.procStatCode`]="{ item }">
          <span class="green--text" v-if="item.procStatCode === 'Y'">
            <v-icon small>mdi-check-circle-outline</v-icon>
            처리완료
          </span>
                    <span class="red--text" v-if="item.procStatCode === 'N'">
            <v-icon small>mdi-alert-circle-outline</v-icon>
            처리필요
          </span>
                </template>
                <template v-slot:[`item.keyRsvNo`]="{ item }">
          <span v-if="item.keyRsvNo" @click="openRsv(item)" class="pointer blue--text">
            {{ item.keyRsvNo }}
          </span>
                </template>
                <template v-slot:[`item.errDt`]="{ item }">
                    {{ item.errDt | dateSet }}
                </template>
                <template v-slot:[`item.procName`]="{ item }">
                    <mask-name :text="item.procName" v-if="item.procName" />
                    <span class="grey--text" v-else>-</span>
                </template>
                <template v-slot:[`item.procDt`]="{ item }">
                    {{ item.procDt| dateSet }}
                </template>
            </v-data-table>
            <search-pagination
                v-model="searchParam"
                :total-visible="10"
                circle
                @change="selectErrorGuidanceList"
            ></search-pagination>
        </app-card>
    </v-row>
</template>

<script>
import MaskName from '@/components/Mask/MaskName.vue'
import errorGuidanceService from '@/api/modules/api/errorGuidance.service'

export default {
  name: 'ErrorGuidance',
  components: {
    MaskName
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: []
    }
  },
  computed: {
    /**
         * OTA 여부
         */
    isOta () {
      return Boolean(this.$route.path.indexOf('/ota') === 0)
    },
    /**
         * Social 여부
         */
    isSocial () {
      return Boolean(this.$route.path.indexOf('/social') === 0)
    },
    /**
         * 업무유형 [ota|social]
         */
    taskType () {
      if (this.isOta === true) {
        return 'ota'
      } else if (this.isSocial === true) {
        return 'social'
      }
      return null
    },
    /**
         * 헤더 목록
         */
    headers () {
      const headers = [
        {
          text: '오류순번',
          value: 'errSeq',
          align: 'center',
          sortable: false
        },
        {
          text: '처리상태',
          value: 'procStatCode',
          align: 'center',
          sortable: false
        }
      ]
      if (this.isSocial) {
        // 소셜
        headers.push(...[
          { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
          { text: '우대순번', value: 'ticketSeq', align: 'center', sortable: false }
        ])
      } else if (this.isOta) {
        // OTA
        headers.push({ text: '예약KEY번호', value: 'keyRsvNo', align: 'center', sortable: false })
      }
      headers.push(...[
        {
          text: '오류코드',
          value: 'errCode',
          align: 'center',
          sortable: false
        },
        {
          text: '오류메세지',
          value: 'errMsg',
          align: 'center',
          sortable: false
        },
        {
          text: '오류일자',
          value: 'errDt',
          align: 'center',
          sortable: false
        },
        {
          text: '처리자',
          value: 'procName',
          align: 'center',
          sortable: false
        },
        {
          text: '처리일자',
          value: 'procDt',
          align: 'center',
          sortable: false
        }
      ])
      return headers
    },
    searchList () {
      const searchList = [
        {
          key: 'procStatCode',
          label: '처리상태',
          type: 'select',
          list: [
            {
              text: '처리완료',
              value: 'Y'
            },
            {
              text: '처리필요',
              value: 'N'
            }
          ]
        }]
      if (this.isSocial) {
        // 소셜
        searchList.push([
          { key: 'ticketNo', label: '우대번호', type: 'text' },
          { key: 'ticketSeq', label: '우대순번', type: 'text' }
        ])
      } else if (this.isOta) {
        // OTA
        searchList.push({ key: 'keyRsvNo', label: '예약키번호', type: 'text' })
      }
      searchList.push(...[
        { key: 'errCode', label: '오류코드', type: 'text' },
        { key: 'errMsg', label: '오류메시지', type: 'text' },
        { key: 'memo', label: '메모', type: 'text' },
        {
          key: 'errDt',
          label: '오류일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        },
        {
          key: 'procDt',
          label: '처리일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        }
      ])
      return searchList
    }
  },
  methods: {
    /**
         * 오류 추천 목록 조회
         */
    async selectErrorGuidanceList () {
      if (!this.taskType) return false
      const res = await errorGuidanceService.selectErrorGuidanceList(
        this.taskType,
        this.searchParam
      )
      res.data.forEach(item => {
        item.rowSeq = item.errSeq
      })
      this.list = res.data
      this.searchParam.total = res.pagination.total
    },
    /**
         * 오류 추천 조회 다이얼로그 열기
         */
    openViewErrorGuidanceDialog ({ errSeq }) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/Error/Guidance/ErrorGuidanceViewDialog',
        params: {
          errSeq
        },
        options: {
          width: '700px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectErrorGuidanceList()
          }
        }
      })
    },
    openRsv (item) {
      if (item.keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: item.keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    }
  }
}
</script>
