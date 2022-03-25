<template>
    <v-container fluid>
        <v-form ref="form" lazy-validation autocomplete="off">
            <v-row>
                <v-col cols="12" class="subtitle-1 font-weight-bold">
                    * 개발 서비스 테스트 완류 및 접수 후 운영서비스 등록 바랍니다.
                    <div v-if="isNew">* 신규 등록일 경우 운영서비스 등록을 하실 수 없습니다.(개발 서비스 테스트 완료 후 체크해 주세요.)</div>
                </v-col>
                <template v-if="!list || list.length === 0">
                    <v-col cols="12" class="text-center title font-weight-bold" align-self="center">
                        * 등록된 API 서비스가 없으므로 진행할 수 없습니다.
                    </v-col>
                </template>
                <template v-else>
                    <v-col cols="6" class="text-center">
                        <v-list>
                            <v-list-item class="font-weight-bold" @click="toggleDevList">
                                <v-list-item-action>
                                    <v-icon>{{checkDevIcon}}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    개발 서비스
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item v-for="(item, index) in list" :key="index" @click="check(true, item)">
                                <v-list-item-action>
                                    <v-icon>{{item.devOpenYn === 'Y'? 'check_box': 'check_box_outline_blank'}}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    {{item.svcNm}}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="6" class="text-center">
                        <v-list>
                            <v-list-item class="font-weight-bold" @click="toggleProdList" :disabled="isNew">
                                <v-list-item-action>
                                  <v-icon>{{checkProdIcon}}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    운영 서비스
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <template v-if="isNew">
                                <v-list-item v-for="(item, index) in list" :key="index">
                                    <v-list-item-action>
                                        <v-icon>{{item.prodOpenYn === 'Y'? 'check_box': 'check_box_outline_blank'}}</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        {{item.svcNm}}
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                            <template v-else>
                                <v-list-item v-for="(item, index) in list" :key="index" @click="check(false, item)">
                                    <v-list-item-action>
                                        <v-icon>{{item.prodOpenYn === 'Y'? 'check_box': 'check_box_outline_blank'}}</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        {{item.svcNm}}
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-col>
                </template>
            </v-row>
        </v-form>
        <v-row v-if="writeAuth">
            <v-col cols="12" class="text-right">
                <template v-if="isNew">
                    <v-btn color="info" rounded @click="prev"><v-icon left>arrow_back</v-icon>이전 단계</v-btn>
                    <v-btn color="info" rounded @click="submit"><v-icon left>arrow_forward</v-icon>다음 단계</v-btn>
                </template>
                <v-btn v-else color="info" rounded @click="submit"><v-icon left>check</v-icon>수정</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import service from 'Api/modules/api/serviceOpen.service'

export default {
  props: { item: Object, isNew: Boolean, insertData: Object },
  name: 'ApiServiceTab',
  mounted () {
    this.init()
  },
  watch: {
    'item.taskType': function () {
      console.log('업무구분 변경')
      this.init()
    }
  },
  computed: {
    checkDevIcon () {
      if (this.list.length > 0) {
        const checkLength = this.list.filter(data => data.devOpenYn === 'Y').length
        if (checkLength === this.list.length) {
          return 'check_box'
        } else if (checkLength > 0) {
          return 'indeterminate_check_box'
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    },
    checkProdIcon () {
      if (this.list.length > 0) {
        const checkLength = this.list.filter(data => data.prodOpenYn === 'Y').length
        if (checkLength === this.list.length) {
          return 'check_box'
        } else if (checkLength > 0) {
          return 'indeterminate_check_box'
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    }
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    toggleDevList () {
      if (this.list.length > 0) {
        const checkLength = this.list.filter(data => data.devOpenYn === 'Y').length
        if (checkLength === this.list.length) {
          for (const dev of this.list) {
            dev.devOpenYn = 'N'
          }
        } else {
          for (const dev of this.list) {
            dev.devOpenYn = 'Y'
          }
        }
      }
    },
    toggleProdList () {
      if (this.list.length > 0) {
        const checkLength = this.list.filter(data => data.prodOpenYn === 'Y').length
        if (checkLength === this.list.length) {
          for (const prod of this.list) {
            prod.prodOpenYn = 'N'
          }
        } else {
          for (const prod of this.list) {
            prod.prodOpenYn = 'Y'
          }
        }
      }
    },
    init () {
      service.selectServiceOpenList(this.item.taskType, this.item.businessId).then(res => {
        this.list = res.data
        if (this.isNew) {
          this.toggleDevList()
        }
      })
    },
    check (isDev, row) {
      if (isDev) {
        row.devOpenYn = row.devOpenYn === 'Y' ? 'N' : 'Y'
      } else {
        if (!this.isNew) {
          const prodOpen = row.prodOpenYn
          const devOpen = row.devOpenYn
          // 개발체크가 안되었을때 운영 체크를 하려고 하면 막는다.
          if (devOpen === 'N' && prodOpen === 'N') {
            this.$dialog.alert('개발서비스 체크를 하셔야 <br/> 운영서비스를 체크할 수 있습니다.')
          } else {
            row.prodOpenYn = row.prodOpenYn === 'Y' ? 'N' : 'Y'
          }
        }
      }
    },
    submit () {
      this.validForm(this.$refs.form).then(() => {
        const commitList = this.list.filter(data => data.devOpenYn === 'Y' || data.prodOpenYn === 'Y')
        if (this.isNew) {
          if (commitList.length === 0) {
            this.$dialog.alert('한개 이상의 API 서비스를 체크하여 주세요.')
            return
          }
          this.$emit('update:insertData', Object.assign({}, this.insertData, { serviceOpenList: commitList }))
          this.$emit('changeTab', true)
        } else {
          this.$dialog.confirm('API 서비스 정보를 수정 하시겠습니까?').then(() => {
            service.updateServiceOpenList(this.item.businessId, commitList).then(res => {
              this.$dialog.alert('정보를 수정하였습니다.')
            })
          })
        }
      })
    },
    prev () {
      this.$emit('changeTab', false)
    }
  }
}
</script>
