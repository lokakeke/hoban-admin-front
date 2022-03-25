<template>
  <v-menu bottom
          offset-y
          v-model="expand"
          :close-on-content-click="false"
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-if="mask" text block @click.prevent.stop="" v-on="on" :height="height" style="cursor: zoom-in" :class="`font-${fontSize}`">
        {{mask}}
      </v-btn>
    </template>
    <v-toolbar dense>
      <v-toolbar-title class="subtitle-1">{{view ? text: mask}}</v-toolbar-title>
      <v-divider vertical inset class="mx-4"></v-divider>
      <v-spacer></v-spacer>
        <v-btn icon @click="searchPhoneNo" title="보기" class="ml-3" v-if="!view">
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
    }
  },
  name: 'MaskTelNumber',
  computed: {
    mask () {
      if (this.text == null) {
        return ''
      } else {
        // 010-?(123/1234)-?5678 형태의 가운데를 변환한다.
        const replaceText = this.replaceAll(this.text, '-', '')
        const replaceLength = replaceText.length
        if (replaceLength === 10) {
          return replaceText.substring(0, 3) + '-****-' + replaceText.substring(6)
        } else if (replaceLength === 11) {
          return replaceText.substring(0, 3) + '-****-' + replaceText.substring(7)
        } else {
          return this.text
        }
      }
    }
  },
  data () {
    return {
      expand: false,
      view: false
    }
  },
  methods: {
    searchPhoneNo () {
      this.view = true
      this.$emit('search')
    }
  }
}
</script>
