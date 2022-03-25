<template>
  <v-menu bottom
          offset-y
          v-model="expand"
          :close-on-content-click="false"
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-if="mask" text block @click.native.stop v-on="on" :height="height" @click="view = false" style="cursor: zoom-in" :class="`font-${fontSize}`">
        {{mask}}
      </v-btn>
    </template>
    <v-toolbar dense>
      <v-toolbar-title class="subtitle-1">{{view ? text : mask}}</v-toolbar-title>
      <v-divider vertical inset class="mx-4"></v-divider>
      <v-spacer></v-spacer>
        <v-btn icon @click="selectOriginPhone" title="보기" class="ml-3">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn icon @click="expand = false" title="닫기">
          <v-icon>close</v-icon>
        </v-btn>
    </v-toolbar>
  </v-menu>
</template>

<script>
export default {
  name: 'MaskPhoneNumber',
  props: {
    text: {
      type: String
    },
    fontSize: {
      type: Number
    },
    height: {
      type: Number,
      default () { return 30 }
    },
    selectPhone: {
      type: Function
    }
  },
  data () {
    return {
      expand: false,
      view: false
    }
  },
  computed: {
    mask () {
      if (this.text == null) {
        return ''
      } else {
        // 010-123/1234-5678 형태의 가운데를 변환한다.
        const replacedText = this.text.replaceAll('-', '')
        const split = this.text.split('-')
        if (replacedText.length === 11) {
          return split[0] + '-****-' + split[2]
        } else if (replacedText.length === 10) {
          return split[0] + '-***-' + split[2]
        } else {
          return this.text
        }
      }
    }
  },
  methods: {
    selectOriginPhone () {
      this.view = true
      this.$emit('selectPhone')
    }
  }
}
</script>
