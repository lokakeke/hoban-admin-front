<template>
  <dialog-base :instance="instance">
    <template v-slot:title>파트너 API {{isNew? '추가': '수정'}}</template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="6">
          <v-label>API 구분</v-label>
          <v-autocomplete
            v-model="form.apiInd"
            :items="apiIndList"
            item-value="commCd"
            item-text="commCdNm"
            :rules="emptyRules"
            autocomplete="off"
            @change="setApiIndInfo"
          ></v-autocomplete>
        </v-col>
        <v-col cols="6">
          <v-label>API Method</v-label>
          <v-text-field
            v-model="form.apiMethod"
            label
            readonly
            placeholder="API 구분을 선택하면 자동입력 됩니다."
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label>
            API URL
          </v-label>
          <v-text-field
            v-model="form.apiUrl"
            label
            :rules="emptyRules"
            clearable
            :hint="apiUrlDesc ? `URL 경로는 ${apiUrlDesc} 형태로 입력되어야 합니다.` : ''"
            placeholder="http:// 혹은 https:// 로 시작하는 URL을 입력해 주세요."
            v-if="apiUrlDesc"
          ></v-text-field>
          <v-text-field value="" :rules="emptyRules" placeholder="먼저 API 구분을 선택해 주세요." disabled v-else></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label>
            <v-row>
              <v-col cols="6">
                API Headers
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                  </template>
                  <div>API 호출 시 header에 들어갈 key, value값을 입력해 주세요.</div>
                </v-tooltip>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn color="info" rounded small @click="addHeaderList">
                  <v-icon left>add</v-icon>추가
                </v-btn>
              </v-col>
            </v-row>
          </v-label>
          <v-simple-table dense>
            <template v-slot:default>
              <colgroup>
                <col width="200px" />
                <col />
                <col width="100px" />
              </colgroup>
              <tbody>
                <tr v-for="headerItem in headerList" :key="headerItem.index">
                  <td>
                    <v-text-field
                      v-model="headerItem.key"
                      :rules="emptyRules"
                      placeholder="key"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="headerItem.value"
                      :rules="emptyRules"
                      placeholder="value"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn color="error" rounded small @click="deleteHeaderList(headerItem)">
                      <v-icon left>remove</v-icon>삭제
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-card
            class="mb-6 pa-3 grey lighten-4 text-center"
            outlined
            v-if="headerList.length < 1"
          >
            <span class="grey--text">등록된 Header가 없습니다.</span>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-label>사용여부</v-label>
          <v-radio-group v-model="form.useYn" row>
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="error" @click="deleteApi" v-if="!isNew">
        <v-icon left>remove</v-icon>삭제
      </v-btn>
      <v-btn outlined rounded color="info" @click="apply">
        <v-icon left>check</v-icon>입력
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import StringUtil from '@/utils/string.util'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import commonCodeService from 'Api/modules/system/commonCode.service'
import partnerApiService from 'Api/modules/partner/partnerApi.service'

export default {
  extends: DialogBase,
  name: 'PartnerApiDialog',
  data () {
    return {
      isNew: false,
      form: {
        apiInd: null,
        apiUrl: null,
        apiMethod: null,
        apiHeader: null,
        useYn: 'Y'
      },
      apiIndList: null,
      apiUrlDesc: null,
      headerList: []
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      this.isNew = this.instance.params.isNew
      this.form = _.cloneDeep(this.instance.params.form)
      this.convertHeaderToList()
      await this.selectApiIndList()
      this.setApiIndInfo()
    },
    /**
     * API Header를 입력을 위한 List로 변환
     */
    convertHeaderToList () {
      const headerList = []
      if (this.form.apiHeader) {
        try {
          const headerObj = JSON.parse(this.form.apiHeader)
          Object.keys(headerObj).forEach((headerKey) => {
            headerList.push({
              index: StringUtil.guid(),
              key: headerKey,
              value: headerObj[headerKey]
            })
          })
        } catch {
          // header json parsing error
        }
      }
      this.headerList = headerList
    },
    /**
     * API 구분 목록 조회
     */
    async selectApiIndList () {
      this.apiIndList = []
      try {
        const response = await commonCodeService.selectCommonCode('COMM0010')
        this.apiIndList = response.data
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * API 구분 정보 설정
     */
    setApiIndInfo () {
      let apiIndObj = null
      this.apiIndList.some((apiIndItem) => {
        if (apiIndItem.commCd === this.form.apiInd) {
          apiIndObj = apiIndItem
          return true
        }
        return false
      })
      if (apiIndObj) {
        this.apiUrlDesc = apiIndObj.item01
        this.form.apiMethod = apiIndObj.item02
      }
    },
    /**
     * Header List 새로 등록
     */
    addHeaderList () {
      this.headerList.push({ index: StringUtil.guid(), key: '', value: '' })
    },
    /**
     * Header List 삭제
     */
    deleteHeaderList (headerItem) {
      const idx = _.findIndex(
        this.headerList,
        (o) => o.index === headerItem.index
      )
      this.headerList.splice(idx, 1)
    },
    /**
     * 저장
     */
    async apply () {
      try {
        await this.validForm(this.$refs.form)
        // header 목록을 JSON String 으로
        const apiHeader = {}
        this.headerList.forEach(header => {
          if (header.key && header.value) {
            apiHeader[header.key] = header.value
          }
        })
        this.form.apiHeader = JSON.stringify(apiHeader)
        await this.$dialog.confirm(
          `API 정보를 ${this.isNew ? '입력' : '수정'} 하시겠습니까?`
        )
        if (this.isNew) {
          await partnerApiService.insertPartnerApi(this.form)
        } else {
          await partnerApiService.updatePartnerApi(this.form)
        }
        this.close({ search: true })
      } catch (e) {}
    },
    /**
     * 삭제
     */
    async deleteApi () {
      try {
        await this.$dialog.confirm('API를 삭제 하시겠습니까?')
        await partnerApiService.deletePartnerApi(
          this.form.ptnrNo,
          this.form.apiInd
        )
        await this.$dialog.alert('API를 삭제 하였습니다.')
        this.close({ search: true })
      } catch (e) {}
    }
  }
}
</script>
