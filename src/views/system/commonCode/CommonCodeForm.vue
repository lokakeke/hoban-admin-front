<template>
    <v-navigation-drawer
        fixed
        v-model="dialog"
        :width="600"
        right
        app
        temporary
        stateless>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="close">
                <v-icon>close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>공통코드 {{ form.commonCodeSeq ? "상세/수정" : "입력" }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark text @click="close">Close</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-container v-if="form !== undefined">
            <v-form ref="form" lazy-validation>
                <template v-if="form.parentCommonCode">
                    <v-label>상위 코드</v-label>
                    <v-text-field v-model="form.parentCommonCode" :rules="emptyRules" label="" class="pt-0"
                                  disabled></v-text-field>
                    <v-label>코드</v-label>
                    <v-text-field v-model.trim="form.commonCode" :rules="emptyRules" label="" required
                                  class="pt-0"></v-text-field>
                </template>
                <template v-else>
                    <v-label>코드</v-label>
                    <v-row>
                        <!-- 최상의 코드 등록시 -->
                        <v-col v-if="!form.commonCodeSeq">
                            ㅏㅏㅏㅏ
                            <v-autocomplete v-model="commCodeText" :items="codeReset" :item-value="'commonCode'"
                                            :item-text="'commonCodeName'" :rules="emptyRules" label required class="pt-0"
                                            @change="newCommCode(commCodeText)"></v-autocomplete>
                        </v-col>
                        <v-col>
                            ㅇㅇㅇㅇ
                            <v-text-field v-model="form.commonCode" :rules="emptyRules" label required class="pt-0" readonly
                                          :disabled="form.commonCodeSeq !== undefined && form.commonCodeSeq !== null"></v-text-field>
                        </v-col>
                    </v-row>
                </template>
                <v-label>코드 이름</v-label>
                <v-text-field v-model="form.commonCodeName" :rules="emptyRules" label="" required class="pt-0"></v-text-field>
                <v-label>코드 설명</v-label>
                <v-textarea auto-grow filled color="deep-purple" rows="1" v-model="form.commonCodeDesc" label=""
                            class="pt-0"></v-textarea>

                <v-label>아이템01</v-label>
                <v-text-field v-model.trim="form.item01" label="" class="pt-0"></v-text-field>
                <v-label>아이템02</v-label>
                <v-text-field v-model.trim="form.item02" label="" class="pt-0"></v-text-field>
                <v-label>아이템03</v-label>
                <v-text-field v-model.trim="form.item03" label="" class="pt-0"></v-text-field>
                <v-label>아이템04</v-label>
                <v-text-field v-model.trim="form.item04" label="" class="pt-0"></v-text-field>
                <v-label>아이템05</v-label>
                <v-text-field v-model.trim="form.item05" label="" class="pt-0"></v-text-field>

                <v-checkbox class="mt-0" v-model="form.useYn" label="사용여부" required true-value="Y"
                            false-value="N"></v-checkbox>

                <v-row justify="center">
                    <v-btn outlined rounded small color="orange" @click="reset">
                        <v-icon small left>refresh</v-icon>
                        원래대로
                    </v-btn>
                    <v-btn outlined rounded small color="info" @click="emit">
                        <v-icon small left>check</v-icon>
                        입력
                    </v-btn>
                    <v-btn v-if="form.useYn === 'N'" outlined rounded small color="red" @click="deleteCommCode">
                        <v-icon small left>check</v-icon>
                        삭제
                    </v-btn>
                    <v-btn outlined rounded small color="primary" @click="close">
                        <v-icon small left>close</v-icon>
                        닫기
                    </v-btn>
                </v-row>
            </v-form>
        </v-container>
    </v-navigation-drawer>
</template>

<script>
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  props: ['dialog', 'data', 'codeReset'],
  name: 'commonCodeForm',
  data () {
    return {
      form: {},
      commCodeText: ''
    }
  },
  mounted () {
    this.form = this.data
  },
  watch: {
    dialog () {
      this.form = _.cloneDeep(this.data)
      this.$refs.form.resetValidation()
    }
  },
  methods: {
    newCommCode (item) {
      commonCodeService.selectCommCodeOfCommCode(item).then(res => {
        this.$set(this.form, 'commonCode', res.data)
      })
    },
    /** 수정 */
    emit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(this.form.commonCodeSeq ? '공통코드를 수정하시겠습니까?' : '공통코드를 입력하시겠습니까?').then(() => {
          if (this.form.commonCodeSeq) {
            commonCodeService.updateCommonCode(this.form).then(res => {
              this.$dialog.alert('수정되었습니다.')
              this.$emit('reload')
              this.close()
            })
          } else {
            commonCodeService.insertCommonCode(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.$emit('reload')
              this.close()
            })
          }
        }).catch(() => {
        })
      })
    },
    /** 초기화 */
    reset () {
      this.form = _.cloneDeep(this.data)
    },
    /** 삭제 */
    deleteCommCode () {
      // 삭제 로직 추가
      this.$dialog.confirm('정말로 삭제 하시겠습니다?').then(() => {
        if (this.form.commonCodeSeq) {
          commonCodeService.deleteCommonCode(this.form.commonCodeSeq)
          this.$emit('reload')
          this.close()
        }
      })
    },
    /** 닫기 */
    close () {
      this.$emit('update:dialog', false)
    }
  }
}
</script>
