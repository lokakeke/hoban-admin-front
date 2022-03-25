<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-right pb-0">
          <v-btn outlined rounded color="info" @click="openDialog()">
            <v-icon left>add</v-icon>추가
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-simple-table class="bordered click-row">
            <thead>
            <tr>
              <th class="text-center">구분</th>
              <th class="text-center">URL</th>
              <th class="text-center">Method</th>
              <th class="text-center">사용여부</th>
              <th class="text-center">등록일자</th>
              <th class="text-center">수정일자</th>
              <th class="text-center">테스트</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in list" :key="index" @click="openDialog(item)">
              <td class="text-center">{{item.apiIndNm}}</td>
              <td class="text-center">{{item.apiUrl}}</td>
              <td class="text-center">{{item.apiMethod}}</td>
              <td class="text-center">{{item.useYn}}</td>
              <td class="text-center">{{item.crtDt | date('YYYY-MM-DD HH:mm:ss')}}</td>
              <td class="text-center">{{item.updDt | date('YYYY-MM-DD HH:mm:ss')}}</td>
              <td class="text-center">
                <v-btn outlined rounded color="accent" @click="openTestDialog(item)">
                  <v-icon left>check</v-icon>실행
                </v-btn>
              </td>
            </tr>
            <tr v-if="!list || list.length === 0">
              <td colspan="7" class="text-center">API 정보가 없습니다.</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import partnerApiService from "Api/modules/partner/partnerApi.service"

export default {
  name: 'PartnerApiManagement',
  props: {
    partnerNo: String
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.searchList()
  },
  methods: {
    searchList () {
      this.list = []
      partnerApiService.selectPartnerApiList(this.partnerNo).then(res => {
        this.list = res.data
      })
    },
    openDialog (row) {
      const isNew = row === undefined
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerApiDialog',
        params: {
          isNew,
          form: row || { ptnrNo: this.partnerNo, apiInd: null, apiUrl: '', apiMethod: '', apiHeader: '', useYn: 'Y' },
          list: this.list
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.search) {
              this.searchList()
            }
          }
        }
      })
    },
    openTestDialog (row) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerApiTestDialog',
        params: {
          form: row,
          list: this.list
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.search) {
              this.searchList()
            }
          }
        }
      })
    }
  }
}
</script>
