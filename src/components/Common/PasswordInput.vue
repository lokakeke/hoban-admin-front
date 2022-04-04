<template>
  <v-row no-gutters>
    <v-col lg="9" md="8" cols="6">
      <v-text-field
        v-model="password"
        :type="showPassword? 'text': 'password'"
        :label="label"
        :rules="required? emptyRules: undefined"
        @keydown="checkCapsLock"
        @change="$emit('input', password)"
        clearable
      >
      </v-text-field>
    </v-col>
    <v-col lg="3" md="4" cols="6" class="pl-2">
      <v-checkbox v-model="showPassword" label="입력 보기" hide-details></v-checkbox>
    </v-col>
    <v-col cols="12" class="text-center">
      <small v-if="capsLock" class="orange--text font-weight-bold"><v-icon left>warning</v-icon>Caps Lock 키가 활성화 되었습니다.</small>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default () {
        return '비밀번호'
      }
    },
    required: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      capsLock: false,
      showPassword: false,
      password: ''
    }
  },
  methods: {
    checkCapsLock (e) {
      if (e.getModifierState) {
        this.capsLock = e.getModifierState('CapsLock')
      }
    }
  },
  mounted () {
    this.password = this.value
  }
}
</script>
