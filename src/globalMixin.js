import { mapGetters } from 'vuex'
// (woojung)

const globalMixin = {
  data () {
    return {
      emptyRules: [
        v => !!v || '필수 입력항목입니다.',
        v => (!v || v.length !== 0) || '필수 선택항목입니다.'
      ],
      emptyText: '검색 결과가 없습니다.',
      searchLabel: '전체 검색',
      nameRegex: [
        v => (!v || /^[A-Za-z0-9가-힝\s-_():&![\],.%+~@*^'/?²℃※<>]+$/g.test(v)) || '한글, 영문, 숫자, 특수문자(-_():&![],.%+~@*^\'/?²℃※<>)만 입력가능합니다.'
      ],
      oneOrMoreRegex: [
        v => (!v || /^[1-9]{1}[0-9]*$/g.test(v)) || '1 이상의 숫자를 입력해주세요.'
      ],
      emailRegex: [
        v => (!v || (v && /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(v))) || '메일 형식이 올바르지 않습니다.'
      ],
      phoneRegex: [
        v => (!v || /^0\d{1,2}-\d{3,4}-\d{4}$/.test(v)) || '전화번호 형식이 올바르지 않습니다.'
      ],
      mobileRegex: [
        v => (!v || /(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/.test(v)) || '휴대폰 번호 형식이 올바르지 않습니다.'
      ],
      numberRules: [
        v => (!v || /^[0-9\\,]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ],
      numberMinusRules: [
        v => (!v || /^[0-9,\s-]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ]
    }
  },
  methods: {
    replaceAll (value, target, to) {
      return !value ? '' : value.split(target).join(to)
    },
    trimAll (value) {
      return !value ? '' : value.split(' ').join('')
    },
    validForm (form) {
      return new Promise((resolve, reject) => {
        if (form && Object.prototype.hasOwnProperty.call(form, 'validate')) {
          if (form.validate()) {
            resolve()
          } else {
            this.$dialog.alert('필수 입력값을 확인해 주세요.').then(() => {
              form.$el.getElementsByClassName('error--text')[0].getElementsByTagName('input')[0].focus()
            })
            reject(new Error('유효성 검사 오류'))
          }
        } else {
          reject(new Error('폼 데이터 오류'))
        }
      })
    },
    sort (menus) {
      menus = menus.sort((a, b) => a.sortOrder - b.sortOrder)
    },
    cloneDeep (origin) {
      return JSON.parse(JSON.stringify(origin))
    },
    maxLengthRules (length) {
      return [
        v => (!v || v.length <= length) || `글자 수가 ${length}자 이내여야 합니다.`
      ]
    },
    betweenLengthRules (minLength, maxLength) {
      return [
        v => (!v || (v.length >= minLength && v.length <= maxLength)) || `글자 수가 최소 ${minLength}자 최대 ${maxLength}자 이내여야 합니다.`
      ]
    },
    validDateRange (data, msg) {
      let result = false
      if (data && Array.isArray(data) && data.length === 2) {
        result = moment(data[0]).isValid() && moment(data[1]).isValid()
      }
      if (result) {
        return Promise.resolve(true)
      } else {
        this.$dialog.alert(msg || '올바른 날짜를 선택해 주세요.')
        return Promise.reject(new Error('Date range 오류'))
      }
    },
    // 팝업 공지사항 노출 체크
    async checkPopUp () {
      try {
        // 팝업이 노출되어야 하면 노출한다.
        const res = await this.$store.dispatch('settings/checkPopUp')
        await this.$store.dispatch('dialog/open', {
          componentPath: '/System/Main/NoticePopUp',
          params: {
            noticeList: res
          },
          options: {
            fullscreen: false,
            hideToolBar: true,
            dense: true,
            width: 850
          }
        })
      } catch (e) {}
    }
  },
  computed: {
    ...mapGetters({
      writeAuth: 'sidebar/writeAuth',
      partnerYn: 'auth/partnerYn',
      isSupervisor: 'auth/isSupervisor'
    }),
    isPartner () {
      return this.partnerYn === 'Y'
    }
  }
}

export default globalMixin
