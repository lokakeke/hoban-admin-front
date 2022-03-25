<template>
  <v-menu bottom
          offset-y
          v-model="expand"
          :close-on-content-click="false"
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-if="mask" text block @click.native.stop v-on="on" @click="view = false" :class="{'auto-height': autoHeight, 'cursor-zoomIn': true }">
        {{mask}}
      </v-btn>
    </template>
    <v-toolbar dense>
      <v-toolbar-title class="subtitle-1">{{view ? text: mask}}</v-toolbar-title>
      <v-divider vertical inset class="mx-4"></v-divider>
      <v-spacer></v-spacer>
      <v-btn icon @click="view = true" title="보기" class="ml-3">
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
    text: String,
    autoHeight: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  name: 'MaskName',
  computed: {
    mask () {
      if (this.text == null) {
        return ''
      } else {
        // 가나다 형태의 이름의 가운데를 변환한다.
        const length = this.text.length
        const textArr = this.text.split('')
        let hiddenName = textArr[0]
        for (let i = 0; i < length - 2; i++) {
          hiddenName += '*'
        }
        hiddenName += textArr[length - 1]
        return hiddenName
      }
    }
  },
  data () {
    return {
      expand: false,
      view: false
    }
  }
}
</script>

<style scoped lang="scss">
button.v-btn {
  &.cursor-zoomIn {
    cursor: zoom-in;
  }
  &.auto-height {
    height: auto;
  }
}
</style>
