<template>
    <div>
        <v-row>
            <app-card :heading="'상위 코드'" col-classes="col-sm-12 col-md-6" item-classes="border-bottom" auto-height>
                <template v-slot:items>
                  <v-row align="center" justify="center">
                    <v-col>
                      <v-text-field v-model="filter" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
                    </v-col>
                    <v-col>
                      <v-btn outlined rounded small color="orange" @click="sort(codeList)" v-if="!filter">
                        <v-icon small>refresh</v-icon>
                        원래대로
                      </v-btn>
                      <v-btn outlined rounded small color="info" @click="sortChange(codeList)" v-if="!filter">
                        <v-icon small>swap_vert</v-icon>
                        순서 저장
                      </v-btn>
                      <v-btn outlined rounded small color="primary" @click="addCode()">
                        <v-icon small>add</v-icon>
                        코드 추가
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <template v-if="filteredList && filteredList.length > 0">
                    <v-list dense>
                        <draggable v-model="codeList">
                            <v-list-item v-for="code of filteredList" :key="code.sortSeq" class="menu-list" :class="code.active? 'active' : ''" @click="viewChildren(code)">
                                <v-list-item-action>
                                    <v-btn text @click.stop @click="viewCode(code)" title="상세/수정">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title :class="code.useYn === 'N' ? 'strike' : '' ">
                                        {{ code.commCdNm }} ({{ code.commCd }})
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-icon>keyboard_arrow_right</v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </draggable>
                    </v-list>
                </template>
                <v-row v-else align="center" justify="center">
                    공통코드 가 없습니다.
                </v-row>
              <template v-slot:action>
                <v-row align="end" justify="center">
                  <v-btn outlined rounded small color="orange" @click="sort(codeList)" v-if="!filter">
                    <v-icon small>refresh</v-icon>
                    원래대로
                  </v-btn>
                  <v-btn outlined rounded small color="info" @click="sortChange(codeList)" v-if="!filter">
                    <v-icon small>swap_vert</v-icon>
                    순서 저장
                  </v-btn>
                  <v-btn outlined rounded small color="primary" @click="addCode()">
                    <v-icon small>add</v-icon>
                    코드 추가
                  </v-btn>
                </v-row>
              </template>
            </app-card>
            <app-card :heading="'코드 리스트'" col-classes="col-sm-12 col-md-6">
                <template v-slot:items v-if="param.parentCommCd">
                    <v-btn outlined rounded small color="orange" @click="sort(children)">
                        <v-icon small>refresh</v-icon>
                        원래대로
                    </v-btn>
                    <v-btn outlined rounded small color="info" @click="sortChange(children)">
                        <v-icon small>swap_vert</v-icon>
                        순서 저장
                    </v-btn>
                    <v-btn outlined rounded small color="primary" @click="addCode(param.parentCommCd)">
                        <v-icon small>add</v-icon>
                        코드 추가
                    </v-btn>
                </template>
                <v-row v-if="!param.parentCommCd" align="center" justify="center">
                    상위코드를 선택해 주세요.
                </v-row>
                <template v-else-if="children && children.length > 0">
                    <v-list dense>
                        <draggable v-model="children">
                            <v-list-item v-for="child of children" :key="child.sortSeq" class="menu-list" :class="child.active? 'active' : ''" @click="viewCode(child)">
                                <v-list-item-action>
                                    <v-icon>search</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title :class="child.useYn === 'N' ? 'strike' : '' ">
                                        {{ child.commCdNm }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </draggable>
                    </v-list>
                </template>
                <v-row v-else align="center" justify="center">
                    {{parentCodeName}} 하위 코드리스트가 없습니다.
                </v-row>
                <div v-if="param.parentCommCd">
                    <v-divider class="my-4"></v-divider>
                    <v-row align="end" justify="center">
                        <v-btn outlined rounded small color="orange" @click="sort(children)">
                            <v-icon small>refresh</v-icon>
                            원래대로
                        </v-btn>
                        <v-btn outlined rounded small color="info" @click="sortChange(children)">
                            <v-icon small>swap_vert</v-icon>
                            순서 저장
                        </v-btn>
                        <v-btn outlined rounded small color="primary" @click="addCode(param.parentCommCd)">
                            <v-icon small>add</v-icon>
                            코드 추가
                        </v-btn>
                    </v-row>
                </div>
            </app-card>
        </v-row>
        <common-code-form :dialog.sync="dialog" :data="form" :codeReset="codes" @reload="reload()"></common-code-form>
    </div>
</template>

<script>
import commonCodeService from 'Api/modules/system/commonCode.service'
import commonCodeForm from 'Views/system/commonCode/CommonCodeForm.vue'

export default {
  components: { commonCodeForm },
  name: 'commonCode',
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.reload()
  },
  data () {
    return {
      codeList: [],
      children: [],
      param: {
        parentCommCd: ''
      },
      dialog: false,
      form: {},
      filter: '',
      codes: []
    }
  },
  computed: {
    parentCodeName () {
      let txt = ''
      if (this.param.parentCommCd) {
        const match = _.find(this.codeList, { commCd: this.param.parentCommCd })
        if (match) {
          txt = match.commCdNm + ' - '
        }
      }
      return txt
    },
    filteredList () {
      return this.codeList.filter(data => data.commCdNm.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1 || data.commCd.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
    }
  },
  methods: {
    /** 공통 코드 조회 */
    getCommCdList () {
      commonCodeService.selectCommonCode('CODE_IND').then(res => {
        this.codes = res.data
      })
    },
    /** 하위 리스트 children에 세팅 */
    viewChildren (code) {
      for (const row of this.codeList) {
        row.active = row.commCdNo === code.commCdNo
      }
      this.children = code.children
      this.param.parentCommCd = code.commCd
    },
    /** 하위 코드 리스트 보기 */
    viewCode (code) {
      this.form = _.cloneDeep(code)
      this.dialog = !this.dialog
    },
    /** 코드 추가하기 */
    addCode (parentCommCd) {
      if (parentCommCd !== undefined) {
        this.form = { parentCommCd: parentCommCd }
      } else {
        this.form = {}
      }
      this.form.useYn = 'Y'
      this.dialog = !this.dialog
      this.getCommCdList()
    },
    /** 재조회 */
    reload () {
      commonCodeService.selectCommonCodeList({}).then(res => {
        this.codeList = res.data
        if (this.param.parentCommCd) {
          this.viewChildren(_.find(this.codeList, { commCd: this.param.parentCommCd }))
        }
      })
    },
    /** 순서 변경 */
    sortChange (codeList) {
      // 순서가 변환된 목록을 추려낸다.
      const changeList = []
      for (let index = 0; index < codeList.length; index++) {
        const order = index + 1
        if (order !== codeList[index].sortSeq) {
          changeList.push({ commCdNo: codeList[index].commCdNo, sortSeq: order })
        }
      }
      if (changeList.length === 0) {
        this.$dialog.alert('변경된 사항이 없습니다.')
      } else {
        this.$dialog.confirm('순서를 변경하시겠습니까?').then(() => {
          commonCodeService.updateCommonCodeOrder(changeList).then(res => {
            this.$dialog.alert('저장되었습니다.')
            this.reload()
          })
        }).catch(() => {})
      }
    },
    /** 닫기 */
    close () {
      this.dialog = false
    }
  }
}
</script>
