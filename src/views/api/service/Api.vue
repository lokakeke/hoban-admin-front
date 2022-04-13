<template>
  <v-row>
    <app-card :heading="'API 서비스 목록'" col-classes="col-12 col-md-6" item-classes="border-bottom" auto-height>
      <template v-slot:items>
        <v-row class="pt-2">
          <v-col cols="6">
            <v-autocomplete v-model="taskType"
                            item-text="commCodeName"
                            item-value="commCode"
                            label="업무 구분"
                            id="taskType"
                            ref="taskType"
                            hide-details
                            @change="search"
                            :items="taskTypeList">
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="searchKeyword" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
          </v-col>
        </v-row>
      </template>
      <v-row>
        <v-col v-if="!taskType" cols="12" class="text-center subtitle-1 font-weight-black">업무 구분을 선택해 주세요.</v-col>
        <v-col v-else-if="apiList.length === 0" cols="12" class="text-center subtitle-1 font-weight-black">해당 업무구분에 등록된 API 가 없습니다.</v-col>
        <v-col v-else cols="12" class="py-0">
          <template v-for="item of apiList">
            <v-hover v-slot:default="{ hover }" :key="item.commCode">
              <v-card raised
                      :color="item.active? 'teal lighten-1': ''"
                      :elevation="hover ? 5 : 1"
                      :class="{ 'on-hover': hover, 'teal lighten-5': hover && !item.active }"
                      class="mb-2"
                      @click="showItem(item)">
                <v-card-text class="py-2">
                  <v-row no-gutters class="font-weight-black subtitle-1 mb-2">
                    <v-icon left>http</v-icon>
                    {{item.commCodeName}} - ({{item.commCode}})
                  </v-row>
                  <v-row no-gutters class="pl-2 mb-1">
                    <span class="font-weight-bold mr-3">운영 URL</span>{{item.item01}}
                  </v-row>
                  <v-row no-gutters class="pl-2">
                    <span class="font-weight-bold mr-3">개발 URL</span>{{item.item02}}
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </template>
        </v-col>
      </v-row>
    </app-card>
    <app-card :heading="'API 서비스 등록 업체목록'" col-classes="col-12 col-md-6" auto-height>
      <template v-slot:items v-if="selectService">
        <v-row justify="center" class="py-2 subtitle-1 font-weight-black border-bottom">
          {{taskType | label(taskTypeList, 'commCode', 'commCodeName')}} - {{selectService.commCodeName}} ({{selectService.commCode}})
        </v-row>
      </template>
      <v-row>
        <v-col v-if="!selectService" cols="12" class="text-center subtitle-1 font-weight-black">API 서비스를 선택해 주세요.</v-col>
        <v-col v-else cols="12">
          <v-row>
            <v-col cols="12" class="text-right pt-0">
              <v-btn v-if="writeAuth" color="info" @click="submit"><v-icon left>check</v-icon>등록</v-btn>
              <v-btn color="warning" outlined @click="refresh"><v-icon left>refresh</v-icon>재조회</v-btn>
            </v-col>
          </v-row>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-center">파트너</th>
                <th class="text-center">BUSINESS ID</th>
                <th class="text-center pointer" @click="checkOpen(false)"><v-icon left>{{devIcon}}</v-icon>개발 오픈</th>
                <th class="text-center pointer" @click="checkOpen(true)"><v-icon left>{{prodIcon}}</v-icon>운영 오픈</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of serviceOpenList" :key="item.partnerSeq + '_' + item.businessId">
                <td class="text-center">{{item.companyName}}</td>
                <td class="text-center">{{item.businessId}}</td>
                <td class="text-center">
                  <v-row justify="center" no-gutters>
                    <v-checkbox v-model="item.devOpenYn" true-value="Y" false-value="N" class="pt-0 mt-0" hide-details></v-checkbox>
                  </v-row>
                </td>
                <td class="text-center">
                  <v-row justify="center" no-gutters>
                    <v-checkbox v-model="item.prodOpenYn" true-value="Y" false-value="N" class="pt-0 mt-0" hide-details></v-checkbox>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </app-card>
  </v-row>
</template>

<script>
import commonCodeService from '@/api/modules/system/commonCode.service'
import serviceOpenService from '@/api/modules/api/serviceOpen.service'

export default {
  name: 'Api',
  data () {
    return {
      taskType: '',
      taskTypeList: [],
      selectService: '',
      apiOriginList: [],
      searchKeyword: '',
      serviceOpenList: []
    }
  },
  mounted () {
    commonCodeService.selectCommonCode('TASK_TYPE').then(res => {
      this.taskTypeList = res.data
    })
  },
  computed: {
    apiList () {
      if (this.searchKeyword) {
        return this.apiOriginList.filter(data =>
          data.commCodeName.indexOf(this.searchKeyword) > -1 ||
          data.item01.indexOf(this.searchKeyword) > -1 ||
          data.item02.indexOf(this.searchKeyword) > -1
        )
      } else {
        return this.apiOriginList
      }
    },
    devIcon () {
      if (!this.serviceOpenList || this.serviceOpenList.length === 0) {
        return 'check_box_outline_blank'
      } else {
        const checkList = this.serviceOpenList.filter(data => data.devOpenYn === 'Y')
        if (checkList.length === 0) {
          return 'check_box_outline_blank'
        } else if (checkList.length === this.serviceOpenList.length) {
          return 'check_box'
        } else {
          return 'indeterminate_check_box'
        }
      }
    },
    prodIcon () {
      if (!this.serviceOpenList || this.serviceOpenList.length === 0) {
        return 'check_box_outline_blank'
      } else {
        const checkList = this.serviceOpenList.filter(data => data.prodOpenYn === 'Y')
        if (checkList.length === 0) {
          return 'check_box_outline_blank'
        } else if (checkList.length === this.serviceOpenList.length) {
          return 'check_box'
        } else {
          return 'indeterminate_check_box'
        }
      }
    }
  },
  methods: {
    initParam () {
      this.searchKeyword = ''
      this.selectService = ''
    },
    async search () {
      try {
        if (!this.taskType) {
          await this.$dialog.alert('업무 구분을 선택해 주세요.')
          this.$refs.taskType.focus()
          this.$refs.taskType.activateMenu()
        } else {
          const res = await commonCodeService.selectCommonCode(this.taskType)
          this.initParam()
          this.apiOriginList = res.data.map(data => {
            data.active = false
            return data
          })
        }
      } catch (e) {}
    },
    async showItem (item) {
      try {
        if (!this.apiOriginList.find(data => data.commCode === item.commCode).active) {
          const res = await serviceOpenService.selectServiceOpenFullList(this.taskType, item.commCode)
          this.apiOriginList.forEach(data => {
            data.active = false
          })
          item.active = true
          this.selectService = item
          this.serviceOpenList = res.data
        }
      } catch (e) {}
    },
    checkOpen (isProd = false) {
      if (this.serviceOpenList.length > 0) {
        const checkList = this.serviceOpenList.filter(data => isProd ? data.prodOpenYn === 'Y' : data.devOpenYn === 'Y')
        if (checkList.length === 0) {
          this.serviceOpenList.forEach(data => { isProd ? data.prodOpenYn = 'Y' : data.devOpenYn = 'Y' })
        } else {
          this.serviceOpenList.forEach(data => { isProd ? data.prodOpenYn = 'N' : data.devOpenYn = 'N' })
        }
      }
    },
    async refresh () {
      const res = await serviceOpenService.selectServiceOpenFullList(this.taskType, this.selectService.commCode)
      this.serviceOpenList = res.data
    },
    async submit () {
      try {
        if (this.serviceOpenList.length === 0) {
          this.$dialog.alert('입력 될 업체 정보가 없습니다.')
          return
        }
        await this.$dialog.confirm('업체 API 오픈정보를 입력 하시겠습니까?')
        await serviceOpenService.updateServiceOpenFullList(this.serviceOpenList)
        this.$dialog.alert('API 오픈정보를 입력하였습니다.')
        this.refresh()
      } catch (e) {}
    }
  }
}
</script>
