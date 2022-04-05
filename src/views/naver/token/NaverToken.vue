<template>
  <v-row>
    <!--    1번째 칸-->
    <v-col md="4" sm="12" cols="12" class="pr-1">
      <app-card :heading="'토큰 목록'" auto-height>
        <v-divider></v-divider>
        <v-list dense v-if="token" class="pa-5">
          <v-list-item v-for="item of token" :key="item.userId" @click="viewDetail(item)"
           class="menu-list" :class="item.active ? 'active' : ''">
            <v-list-item-action>
              <v-icon>account_tree</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title :class="{ 'strike': item.useYn === 'N' }">
                {{ item.userId }}<template v-if="item.userId === 'admin'">{{ isOperation ? ' (운영)' : ' (개발)' }}</template>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-row v-else align="center" justify="center">
          등록된 토큰 아이디 그룹이 없습니다.
        </v-row>
      </app-card>
    </v-col>
    <!--    2번째 칸-->
    <v-col md="8" sm="12" cols="12" class="pl-1">
      <app-card :heading="'토큰 관리'" auto-height>
        <v-divider></v-divider>
        <v-row class="pa-5" v-if="selectToken">
          <v-col cols="12" class="pt-0 pb-0 mb-0">
            <v-alert dense outlined type="info" class="font-sm" v-if="selectToken === 'admin'">
              네이버 API 호출시 필요한 토큰 정보입니다.<br />
              갱신시 새로 발급된 토큰 정보로 네이버 API가 호출됩니다.<br />
              `네이버 예약 파트너센터 관리 계정`이 변경될 경우엔<br />
              새로 발급받으신 리프레시 토큰 정보를 가지고 신규발급을 진행하셔야 합니다.<br />
              리프레시 토큰은 [개발,운영]이 따로 관리되며 발급요청은<br />
              `네이버 예약 파트너센터 담당자`에게 요청하셔야 합니다.
            </v-alert>
            <v-alert dense outlined type="error" class="font-sm" v-else-if="selectToken === 'naver'">
              네이버에서 호반호텔앤리조트의 API 호출 할 수 있는 인증 토큰 정보입니다.<br />
              갱신시 기존 토큰은 사용할 수 없게 됩니다.<br />
              변경 즉시 [네이버 예약 파트너센터] 담당자에게 공유해야 합니다.<br />
              * 토큰 정보 변경으로 인해 네이버 예약이 안될 수 있습니다. *
            </v-alert>
          </v-col>
          <v-col cols="12" class="pt-2 pb-0 mb-3">
            <v-card class="pa-3" color="grey lighten-3" outlined>
              <v-textarea readonly
                label="토큰 키" v-model="form.tokenKey"
              ></v-textarea>
            </v-card>
          </v-col>
          <v-col cols="12" class="pt-2 pb-0 mb-3" v-if="selectToken === 'admin'">
            <v-card class="pa-3" color="grey lighten-3" outlined>
              <v-textarea readonly
                label="리프레시 토큰" v-model="form.refreshToken"
              ></v-textarea>
            </v-card>
          </v-col>
          <v-col class="text-right mt-3" v-if="selectToken === 'admin'">
            <v-btn outlined rounded color="info" @click="open('edit')">
              <v-icon>edit</v-icon>갱신하기
            </v-btn>
            <v-btn outlined rounded color="success" @click="open('new')">
              <v-icon>refresh</v-icon>신규발급
            </v-btn>
          </v-col>
          <v-col class="text-right mt-3" v-else-if="selectToken === 'naver'">
            <v-btn outlined rounded color="info" @click="edit()">
              <v-icon>edit</v-icon>갱신하기
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="pa-5" v-else>
          <v-col md="8" sm="7" cols="12" class="pl-1">
            왼쪽 메뉴에서 조회하실 토큰을 선택해 주세요.
          </v-col>
        </v-row>
      </app-card>
    </v-col>
    <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
  </v-row>
</template>

<script>
import service from '@/api/modules/naver/token.service'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'

export default {
  name: 'NaverToken',
  components: {
    CommonSnackbars
  },
  data: function () {
    return {
      /**
       * 토큰 목록
       */
      token: null,
      /**
       * 선택된 토큰 아이디
       */
      selectToken: null,
      /**
       * 선택된 토큰 객체
       */
      form: null,
      /**
       * snack bar
       */
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: ''
    }
  },
  computed: {
    isOperation () {
      return window.location.origin.indexOf('//sonoadmin.') > -1
    }
  },
  methods: {
    /**
     * 초기화
     */
    inits () {
      service.selectTokenList().then(res => {
        this.token = res.data
      })
    },
    viewDetail (group) {
      for (const row of this.token) {
        row.active = row.userId === group.userId
      }
      this.selectToken = group.userId
      this.form = _.cloneDeep(group)
    },
    /**
     * 팝업 열기
     */
    open (val) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Token/NaverTokenUpdate',
          params: {
            form: this.form,
            inits: this.inits,
            val: val
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 600
          }
        })
      })
    },
    edit () {
      this.$dialog.confirm('토큰을 갱신 하시겠습니까?' +
        (this.form.userId ? '<p style="color: red;">갱신시 기존 토큰은 사용할 수 없게 됩니다.' +
          '<br />변경 즉시 [네이버 예약 파트너센터] 담당자에게 공유해야 합니다.</p>' : ''))
        .then(() => {
          /**
           * 수정하기
           */
          service.updateToken(this.form).then(res => {
            if (res.data === 1) {
              this.showSnackbar('success', '갱신되었습니다. 잠시 후 자동으로 초기화면으로 이동합니다.')
              setTimeout(() => {
                this.$router.go(0)
              }, 1000)
            } else {
              this.$dialog.confirm('오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
            }
          }).catch(() => {
          })
        })
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    }
  },
  mounted () {
    this.inits()
  }
}
</script>
