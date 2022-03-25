<template>
  <dialog-base :instance="instance">
    <template v-slot:title>파트너 API 테스트</template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="6">
          <v-label>API 구분</v-label>
          <v-text-field
            v-model="form.apiIndNm"
            label
            readonly
            placeholder=""
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-label>API Method</v-label>
          <v-text-field
            v-model="form.apiMethod"
            label
            readonly
            placeholder=""
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label>
            API URL
          </v-label>
          <v-text-field
            v-model="form.apiUrl"
            label
            readonly
            placeholder=""
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label>
            <v-row>
              <v-col cols="6">
                API Headers
              </v-col>
            </v-row>
          </v-label>
          <v-simple-table dense>
            <template v-slot:default>
              <colgroup>
                <col width="30%" />
                <col />
                <col width="70%" />
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
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="sendData"
            label="전송정보 예제"
            :readonly="true"
            rows="25"
            no-resize
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-label>
          <v-row>
            <v-col cols="12">
              전송 결과
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <div>API 호출 후 결과값에 대해서는 Map(key,value) 값만 리턴해주시기 바랍니다.</div>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-label>
        <v-col cols="12">
          <v-textarea
            v-model="responseData"
            label="전송 결과값"
            :readonly="true"
            no-resize
            outlined
            hide-details
            dense
          />
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="send">
        <v-icon left>check</v-icon>전송
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import StringUtil from "@/utils/string.util"
import partnerApiService from "Api/modules/partner/partnerApi.service"

export default {
  extends: DialogBase,
  name: 'PartnerApiTestDialog',
  data () {
    return {
      form: {
        apiInd: null,
        apiIndNm: null,
        apiUrl: null,
        apiMethod: null,
        apiHeader: null,
        useYn: 'Y'
      },
      sendDate: '',
      responseData: '',
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
      this.form = _.cloneDeep(this.instance.params.form)
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
      this.now = moment().format('YYYYMMDD')
      this.sendData = '[\n' +
        ' {\n' +
        '  "type" : "ROOM"\n' +
        '  ,"dateTime" : "' + moment().format('YYYY-MM-DD HH:mm:SS') + '"\n' +
        '  ,"storeCd" : "02"\n' +
        '  ,"storeNm" : "소노벨 비발디파크 B · C (구 오크 · 파인)"\n' +
        '  ,"rmTypeCd" : "00B28"\n' +
        '  ,"rmTypeNm" : "스위트 오크(클린)"\n' +
        '  , "ciYmd" : "' + this.now + '"\n' +
        '  , "orgRmAmt" : "120000"\n' +
        '  , "saleRmAmt" : "135000"\n' +
        '  , "pkgNo" : ""\n' +
        ' } ,\n' +
        ' {\n' +
        '  "type" : "ROOM"\n' +
        '  ,"dateTime" : "' + moment().format('YYYY-MM-DD HH:mm:SS') + '"\n' +
        '  ,"storeCd" : "02"\n' +
        '  ,"storeNm" : "소노벨 비발디파크 B · C (구 오크 · 파인)"\n' +
        '  ,"rmTypeCd" : "00B28"\n' +
        '  ,"rmTypeNm" : "스위트 오크(클린)"\n' +
        '  , "ciYmd" : "' + moment(this.now).add(1, 'days').format('YYYYMMDD') + '"\n' +
        '  , "orgRmAmt" : "120000"\n' +
        '  , "saleRmAmt" : "135000"\n' +
        '  , "pkgNo" : ""\n' +
        ' },\n' +
        ' {\n' +
        '  "type" : "ROOM"\n' +
        '  ,"dateTime" : "' + moment().format('YYYY-MM-DD HH:mm:SS') + '"\n' +
        '  ,"storeCd" : "02"\n' +
        '  ,"storeNm" : "소노벨 비발디파크 B · C (구 오크 · 파인)"\n' +
        '  ,"rmTypeCd" : "00B28"\n' +
        '  ,"rmTypeNm" : "스위트 오크(클린)"\n' +
        '  , "ciYmd" : "' + moment(this.now).add(2, 'days').format('YYYYMMDD') + '"\n' +
        '  , "orgRmAmt" : "120000"\n' +
        '  , "saleRmAmt" : "135000"\n' +
        '  , "pkgNo" : ""\n' +
        ' }\n' +
        ']'
    },
    async send () {
      await this.$dialog.confirm('요금을 테스트 전송 하시겠습니까?')
      const response = await partnerApiService.testSendRoomAmount(this.form)
      this.responseData = JSON.stringify(response.data)
    }
  }
}
</script>
