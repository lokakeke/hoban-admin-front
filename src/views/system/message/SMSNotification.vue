<template>
  <div>
    <v-row>
      <app-card :heading="'카카오 알림톡 관리'" col-classes="col-sm-12 col-md-6">
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
            <draggable v-model="notiList">
              <template v-for="notify of filteredList">
                <v-list-item
                  :key="notify.notifyId"
                  @click="viewChildren(notify)"
                  :class="['menu-list', notify.active? 'active' : '']"
                >
                  <v-list-item-action>
                    <v-icon>edit</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title :class="notify.useYn === 'N'? 'strike' : ''">{{ notify.notifyName }} ({{ notify.notifyId }})</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </draggable>
          </v-list>
        </template>
        <v-row v-else align="center" justify="center">카카오 알림 정보가 없습니다.</v-row>
        <v-divider class="my-4"></v-divider>
        <v-row align="end" justify="center">
          <v-btn outlined rounded small color="orange" @click="sort(notiList)" v-if="!filter">
            <v-icon small class="mr-1">refresh</v-icon>원래대로
          </v-btn>
          <v-btn outlined rounded small color="info" @click="sortChange(notiList)" v-if="!filter">
            <v-icon small class="mr-1">swap_vert</v-icon>순서 저장
          </v-btn>
          <v-btn outlined rounded small color="primary" @click="addNotify()">
            <v-icon small>add</v-icon>카카오 알림 메뉴 추가
          </v-btn>
        </v-row>
      </app-card>
      <app-card :heading="'상세 정보'" col-classes="col-sm-12 col-md-6">
        <v-row v-if="!detail.notifyId" align="center" justify="center">관리할 카카오 알림을 선택해 주세요.</v-row>
        <template v-else>
          <v-form ref="detail" lazy-validation>
            <v-label>서비스 번호</v-label>
            <v-autocomplete v-model="detail.svcNo" :items="serviceList" :item-value="'commCode'" :item-text="'commCodeName'" autocomplete="off" :rules="emptyRules" label required class="pt-0"></v-autocomplete>
            <v-label>진행단계</v-label>
            <v-autocomplete v-model="detail.progStat" :items="progStatList" :item-value="'commCode'" :item-text="'commCodeName'" autocomplete="off" :rules="emptyRules" label required class="pt-0"></v-autocomplete>
            <v-label>템플릿 번호</v-label>
            <v-text-field v-model="detail.notifyId" :rules="emptyRules" label required class="pt-0" disabled></v-text-field>
            <v-label>템플릿 명</v-label>
            <v-text-field v-model="detail.notifyName" :rules="emptyRules" label required class="pt-0"/>
            <v-label>카카오 알림 제목</v-label>
            <v-text-field v-model="detail.title" :rules="emptyRules" label required class="pt-0"/>
            <v-label>발송내용
              <common-tooltip :type="'info'" :position="'right'" :text="'{숫자}의 내용은 카카오 알림톡 전송 시, 파라미터 1~10번까지의 내용으로 변경됩니다.'" />
            </v-label>
            <v-textarea
              outlined
              color="deep-purple"
              v-model="detail.notifyDesc"
              label
            ></v-textarea>
            <v-label>샘플</v-label>
            <v-textarea
              outlined
              color="deep-purple"
              v-model="detail.sample"
              label
            ></v-textarea>
            <v-label>비고</v-label>
            <v-textarea
              outlined
              color="deep-purple"
              v-model="detail.etc"
              label
            ></v-textarea>

            <v-row justify="space-between">
              <v-col cols="12" class="text-right">
                <v-btn small rounded outlined @click="addButton" color="info">
                  <v-icon small>check</v-icon>추가
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              class="bordered"
              :no-data-text="'데이터가 없습니다.'"
              :no-result-text="'데이터가 없습니다..'"
              :headers="buttonheaders"
              :items="buttonList"
              item-key="index"
              hide-default-footer
            >
              <template v-slot:item.buttonName="{item}">
                <v-text-field v-model="item.buttonName" label="" :rules="emptyRules"></v-text-field>
              </template>
              <template v-slot:item.url="{item}">
                <v-text-field v-model="item.url" label="" :rules="emptyRules"></v-text-field>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn
                  small
                  color="accent"
                  rounded
                  outlined
                  @click="removeButton(item)"
                >
                  <v-icon small>remove</v-icon>삭제
                </v-btn>
              </template>
            </v-data-table>
            <v-checkbox
              class="mt-0"
              v-model="detail.useYn"
              label="사용여부(미사용 시 알림은 발송되지 않습니다.)"
              required
              true-value="Y"
              false-value="N"
            ></v-checkbox>
          </v-form>
        </template>
        <v-divider v-if="detail.notifyId" class="my-4"></v-divider>
        <v-row align="end" justify="center" v-if="detail.notifyId">
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
        <v-toolbar-title>카카오 알림 메뉴 입력</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="form" lazy-validation>
          <v-label>서비스 번호</v-label>
          <v-autocomplete v-model="form.svcNo" :items="serviceList" :item-value="'commCode'" :item-text="'commCodeName'" autocomplete="off" :rules="emptyRules" label required class="pt-0"></v-autocomplete>
          <v-label>진행단계</v-label>
          <v-autocomplete v-model="form.progStat" :items="progStatList" :item-value="'commCode'" :item-text="'commCodeName'" autocomplete="off" :rules="emptyRules" label required class="pt-0"></v-autocomplete>
          <v-label>템플릿 번호</v-label>
          <v-text-field v-model="form.notifyId" :rules="emptyRules" label required class="pt-0"></v-text-field>
          <v-label>카카오 알림 이름</v-label>
          <v-text-field v-model="form.notifyName" :rules="emptyRules" label required class="pt-0"></v-text-field>
          <v-label>카카오 알림 제목</v-label>
          <v-text-field v-model="form.title" :rules="emptyRules" label required class="pt-0"/>
          <v-label>발송내용
            <common-tooltip :type="'info'" :position="'right'" :text="'{숫자}의 내용은 카카오 알림톡 전송 시, 파라미터 1~10번까지의 내용으로 변경됩니다.'" />
          </v-label>
          <v-textarea
            outlined
            color="deep-purple"
            v-model="form.notifyDesc"
            label
          ></v-textarea>
          <v-label>샘플</v-label>
          <v-textarea
            outlined
            color="deep-purple"
            v-model="form.sample"
            label
          ></v-textarea>
          <v-label>비고</v-label>
          <v-textarea
            outlined
            color="deep-purple"
            v-model="form.etc"
            label
          ></v-textarea>

          <v-row justify="space-between">
            <v-col cols="12" class="text-right">
              <v-btn small rounded outlined @click="addButton" color="info">
                <v-icon small>check</v-icon>추가
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            class="bordered"
            :no-data-text="'데이터가 없습니다.'"
            :no-result-text="'데이터가 없습니다..'"
            :headers="buttonheaders"
            :items="buttonList"
            item-key="index"
            hide-default-footer
          >
            <template v-slot:item.buttonName="{item}">
              <v-text-field v-model="item.buttonName" label="" :rules="emptyRules"></v-text-field>
            </template>
            <template v-slot:item.url="{item}">
              <v-text-field v-model="item.url" label="" :rules="emptyRules"></v-text-field>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn
                small
                color="accent"
                rounded
                outlined
                @click="removeButton(item)"
              >
                <v-icon small>remove</v-icon>삭제
              </v-btn>
            </template>
          </v-data-table>

          <v-checkbox
            class="mt-0"
            v-model="form.useYn"
            label="사용여부(미사용 시 알림은 발송되지 않습니다.)"
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
import smsManageService from '@/api/modules/system/smsNoti.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'smsNotification',
  components: {
    CommonTooltip
  },
  data () {
    return {
      notiList: [],
      detail: {},
      detailClone: {},
      dialog: false,
      form: {},
      filter: '',
      serviceList: [],
      progStatList: [],
      buttonList: [],
      buttonheaders: [
        { text: '버튼명', value: 'buttonName', align: 'center', sortable: false },
        { text: 'URL', value: 'url', align: 'center', sortable: false },
        { text: '삭제', value: 'action', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    filteredList () {
      return this.notiList.filter(data => data.notifyName.indexOf(this.filter) !== -1 || data.notifyId.indexOf(this.filter) !== -1)
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.search()
    this.selectSvcList()
    this.selectProgStatList()
  },
  methods: {
    search (notifyId) {
      smsManageService.selectList({}).then(res => {
        this.notiList = res.data
        if (notifyId) {
          for (const row of this.notiList) {
            if (row.notifyId === notifyId) {
              this.viewChildren(row)
            }
          }
        }
      })
    },
    viewChildren (notify) {
      for (const row of this.notiList) {
        row.active = row.notifyId === notify.notifyId
      }
      this.detail = _.cloneDeep(notify)
      this.buttonList = _.cloneDeep(notify.buttonList)
      this.detailClone = _.cloneDeep(notify)
    },
    reload () {
      this.detail = _.cloneDeep(this.detailClone)
    },
    selectSvcList () {
      commonCodeService.selectCommonCode('COMM0002').then(res => {
        this.serviceList = res.data
      })
    },
    selectProgStatList () {
      commonCodeService.selectCommonCode('COMM0007').then(res => {
        this.progStatList = res.data
      })
    },
    addNotify () {
      this.form = { useYn: 'Y' }
      this.dialog = !this.dialog
    },
    sortChange (list) {
      // 순서가 변환된 목록을 추려낸다.
      const changeList = []
      for (let index = 0; index < list.length; index++) {
        const seq = index + 1
        if (seq !== list[index].sortSeq) {
          changeList.push({ notifyId: list[index].notifyId, sortSeq: seq })
        }
      }
      if (changeList.length === 0) {
        this.$dialog.alert('변경된 사항이 없습니다.')
      } else {
        this.$dialog
          .confirm('순서를 변경하시겠습니까?')
          .then(() => {
            smsManageService.updateSort(changeList).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.search(this.detail.notifyId)
            })
          })
          .catch(() => {})
      }
    },
    modify () {
      this.validForm(this.$refs.detail).then(() => {
        this.$dialog
          .confirm('카카오 알림 메뉴를 수정하시겠습니까?')
          .then(() => {
            this.detail.buttonList = this.buttonList
            smsManageService.update(this.detail).then(res => {
              this.$dialog.alert('정보를 입력하였습니다.')
              this.search(this.detail.notifyId)
            })
          })
          .catch(() => {})
      })
    },
    insert () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog
          .confirm('카카오 알림 메뉴를 입력하시겠습니까?')
          .then(() => {
            this.form.buttonList = this.buttonList
            smsManageService.insert(this.form).then(res => {
              this.$dialog.alert('정보를 입력하였습니다.')
              this.search(this.detail.notifyId)
              this.dialog = false
            })
          })
          .catch(() => {})
      })
    },

    // 버튼 추가
    addButton () {
      this.buttonList.push({ buttonName: '', url: '' })
    },
    // 버튼 삭제
    removeButton (data) {
      this.$dialog.confirm('선택한 버튼을 삭제하시겠습니까?').then(() => {
        this.buttonList.splice(this.buttonList.indexOf(data), 1)
      }).catch(() => {})
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
