<template>
  <div class="text-left">
    <v-menu bottom
            offset-y
            v-model="expand"
            :close-on-content-click="false"
            transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn class="subtitle-1" style="text-transform: none !important; cursor: zoom-in;" v-if="mask" block text depressed @click.native.stop v-on="on" @click="view = false">
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
  </div>
</template>

<script>
export default {
  props: { text: String },
  name: 'MaskEmail',
  computed: {
    mask () {
      if (this.text == null) {
        return ''
      } else {
        // ...@... 형태의 경우 @를 기준으로 쪼갠다.
        const split = this.text.split('@')
        console.log()
        return split[0].charAt(0).toLowerCase() + '****@' + split[1].toLowerCase()
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
