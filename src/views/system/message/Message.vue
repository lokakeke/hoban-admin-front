<template>
  <div>
    <v-row>
      <app-card :heading="'메시지 관리'" col-classes="col-sm-12 col-md-6">
        <template>
          <v-row align="center" justify="center">
            <v-col class="pt-0"></v-col>
            <v-col class="pt-0">
              <v-text-field v-model="filter" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
            </v-col>
          </v-row>
        </template>
        <template v-if="filteredList && filteredList.length > 0">
          <v-list dense>
            <draggable v-model="messageList">
              <transition-group type="transition" name="flip-list">
                <v-list-item
                  v-for="message of filteredList"
                  :key="message.sortOrder"
                  @click="viewChildren(message)"
                  class="menu-list"
                  :class="message.active? 'active' : ''"
                >
                  <v-list-item-action>
                    <v-icon>edit</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title :class="message.useYn === 'N'? 'strike' : ''">{{ message.messageName }} ({{ message.messageId }})</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
            </draggable>
          </v-list>
        </template>
        <v-row v-else align="center" justify="center">메시지 정보가 없습니다.</v-row>
        <v-divider class="my-4"></v-divider>
        <v-row align="end" justify="center">
          <v-btn outlined rounded small color="orange" @click="sort(messageList)" v-if="!filter">
            <v-icon small class="mr-1">refresh</v-icon>원래대로
          </v-btn>
          <v-btn outlined rounded small color="info" @click="sortChange(messageList)" v-if="!filter">
            <v-icon small class="mr-1">swap_vert</v-icon>순서 저장
          </v-btn>
          <v-btn outlined rounded small color="primary" @click="addNotify()">
            <v-icon small>add</v-icon>메시지 메뉴 추가
          </v-btn>
        </v-row>
      </app-card>
      <app-card :heading="'상세 정보'" col-classes="col-sm-12 col-md-6">
        <v-row v-if="!detail.messageId" align="center" justify="center">관리할 메시지를 선택해 주세요.</v-row>
        <template v-else>
          <v-form ref="detail" lazy-validation>
            <v-label>메시지 ID</v-label>
            <v-text-field
              v-model="detail.messageId"
              :rules="emptyRules"
              label
              required
              class="pt-0"
              disabled
            ></v-text-field>
            <v-label>메시지 구분</v-label>
            <v-autocomplete v-model="detail.messageType" :rules="emptyRules" :items="serverCodeList" :item-text="'commonCodeName'" :item-value="'commonCode'" required class="pb-3 pt-0"/>
            <v-label>메시지 이름</v-label>
            <v-text-field v-model="detail.messageName" :rules="emptyRules" label required class="pb-0"/>
            <v-label>
              메시지 내용
              <common-tooltip :type="'info'" :position="'right'" :text="'{숫자}의 내용은 메시지 전송 시, 메시지 수신 테이블에 저장된 파라미터 1~5번까지의 내용으로 변경됩니다.'" />
            </v-label>
            <v-text-field v-model="detail.message" :rules="emptyRules" label required class="pt-0"/>
            <v-label>설명</v-label>
            <v-textarea
              auto-grow
              filled
              color="deep-purple"
              rows="1"
              v-model="detail.messageDesc"
              label
              class="pt-0"
            ></v-textarea>
            <v-checkbox
              class="mt-0"
              v-model="detail.useYn"
              label="사용여부(미사용 시 메시지는 발송되지 않습니다.)"
              required
              true-value="Y"
              false-value="N"
            ></v-checkbox>
          </v-form>
        </template>
        <v-divider v-if="detail.messageId" class="my-4"></v-divider>
        <v-row align="end" justify="center" v-if="detail.messageId">
          <v-btn outlined rounded small color="orange" @click="reload()">
            <v-icon small>refresh</v-icon>원래대로
          </v-btn>
          <v-btn outlined rounded small color="info" @click="modify()">
            <v-icon small>edit</v-icon>수정
          </v-btn>
        </v-row>
      </app-card>
    </v-row>

    <v-navigation-drawer fixed v-model="dialog" :width="600" right app stateless temporary>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>메시지 메뉴 입력</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="form" lazy-validation>
          <v-label>메시지 ID</v-label>
          <v-text-field v-model="form.messageId" :rules="emptyRules" label disabled class="pt-0"></v-text-field>
          <v-label>메시지 구분</v-label>
          <v-autocomplete v-model="form.messageType" :rules="emptyRules" :items="serverCodeList" :item-text="'commonCodeName'" :item-value="'commonCode'" required class="pb-3 pt-0"/>
          <v-label>메시지 이름</v-label>
          <v-text-field v-model="form.messageName" :rules="emptyRules" label required class="pt-0"></v-text-field>
          <v-label>
            메시지 내용
            <common-tooltip :type="'info'" :position="'right'" :text="'{숫자}의 내용은 메시지 전송 시, 메시지 수신 테이블에 저장된 파라미터 1~5번까지의 내용으로 변경됩니다.'" />
          </v-label>
          <v-text-field v-model="form.message" :rules="emptyRules" label required class="pt-0"/>
          <v-label>설명</v-label>
          <v-textarea
            auto-grow
            filled
            color="deep-purple"
            rows="1"
            v-model="form.messageDesc"
            label
            class="pt-0"
          ></v-textarea>
          <v-checkbox
            class="mt-0"
            v-model="form.useYn"
            label="사용여부(미사용 시 메시지는 발송되지 않습니다.)"
            required
            true-value="Y"
            false-value="N"
          ></v-checkbox>

          <v-row justify="center">
            <v-btn outlined rounded small color="orange" @click="reset()">
              <v-icon small>refresh</v-icon>원래대로
            </v-btn>
            <v-btn outlined rounded small color="info" @click="insert()">
              <v-icon small>check</v-icon>입력
            </v-btn>
            <v-btn outlined rounded small color="primary" @click="dialog = false">
              <v-icon small>close</v-icon>닫기
            </v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import messageService from '@/api/modules/system/message.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'message',
  components: {
    CommonTooltip
  },
  data () {
    return {
      messageList: [],
      serverCodeList: [],
      detail: {},
      detailClone: {},
      dialog: false,
      form: {},
      filter: ''
    }
  },
  computed: {
    filteredList () {
      const filter = this.messageList.filter(data => data.messageName.indexOf(this.filter) !== -1 || data.messageId.indexOf(this.filter) !== -1)
      return filter
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.search()
    this.getServerCode()
  },
  methods: {
    getServerCode () {
      commonCodeService.selectCommonCode('MESSAGE_TYPE').then(res => {
        this.serverCodeList = res.data
      })
    },
    getNewNotifyId () {
      messageService.newNotifyId().then(res => {
        this.$set(this.form, 'messageId', res.data)
      })
    },
    search (messageId) {
      messageService.selectList({}).then(res => {
        this.messageList = res.data
        if (messageId) {
          for (const row of this.messageList) {
            if (row.messageId === messageId) {
              this.viewChildren(row)
            }
          }
        }
      })
    },
    viewChildren (notify) {
      for (const row of this.messageList) {
        row.active = row.messageId === notify.messageId
      }
      this.detail = _.cloneDeep(notify)
      this.detailClone = _.cloneDeep(notify)
    },
    reload () {
      this.detail = _.cloneDeep(this.detailClone)
    },
    addNotify () {
      this.form = { useYn: 'Y' }
      this.getNewNotifyId()
      this.dialog = !this.dialog
    },
    sortChange (list) {
      const changeList = []
      for (let index = 0; index < list.length; index++) {
        const seq = index + 1
        if (seq !== list[index].sortOrder) {
          changeList.push({ messageId: list[index].messageId, sortOrder: seq })
        }
      }
      if (changeList.length === 0) {
        this.$dialog.alert('변경된 사항이 없습니다.')
      } else {
        this.$dialog
          .confirm('순서를 변경하시겠습니까?')
          .then(() => {
            messageService.updateSort(changeList).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.search(this.detail.messageId)
            })
          })
          .catch(() => {})
      }
    },
    modify () {
      this.validForm(this.$refs.detail).then(() => {
        this.$dialog
          .confirm('메시지 메뉴를 수정하시겠습니까?')
          .then(() => {
            messageService.update(this.detail).then(res => {
              this.$dialog.alert('정보를 입력하였습니다.')
              this.search(this.detail.messageId)
            })
          })
          .catch(() => {})
      })
    },
    insert () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog
          .confirm('메시지 메뉴를 입력하시겠습니까?')
          .then(() => {
            messageService.insert(this.form).then(res => {
              this.$dialog.alert('정보를 입력하였습니다.')
              this.search(this.detail.messageId)
              this.dialog = false
            })
          })
          .catch(() => {})
      })
    },
    reset () {
      this.form = {}
      this.$refs.form.resetValidation()
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
