<template>
  <div v-show="readonly === false || uploadFiles.length > 0">
    <v-label v-if="label">{{ label }}</v-label>
    <v-card class="mt-3">
      <v-list :style="{ border: errorBucket.length > 0 ? '1px solid red' : null }">
        <template v-for="(file, fileIndex) in uploadFiles">
          <v-divider :key="fileIndex" v-if="fileIndex !== 0"></v-divider>
          <v-list-item :key="file.name + fileIndex">
            <v-list-item-avatar>
              <img :src="file.thumb" :alt="file.name" v-if="file.thumb" />
              <v-icon color="red" v-else-if="file.type === 'application/pdf'">mdi-file-pdf</v-icon>
              <v-icon v-else>mdi-file</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <a
                      :href="downloadUrl+file.fileId"
                      :download="file.name"
                      v-on="on"
                      v-if="file.fileId"
                    >{{ file.name }}</a>
                    <a :href="file.blob" :download="file.name" v-on="on" v-else>{{ file.name }}</a>
                  </template>
                  <span>클릭하여 다운로드</span>
                </v-tooltip>
              </v-list-item-title>
              <v-list-item-subtitle>{{ file.size | byte }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="readonly === false">
              <span class="info--text" v-if="file.success === true">
                <v-icon color="info">mdi-check-circle</v-icon>
                {{ !file.filePath ? '업로드 완료' : '저장된 파일' }}
              </span>
              <span class="primary--text" v-else>
                <v-progress-circular size="14" width="2" indeterminate color="primary"></v-progress-circular>
                업로드 진행 중... {{ parseInt(file.progress) }}%
              </span>
            </v-list-item-action>
            <v-list-item-action v-if="readonly === false">
              <v-btn small outlined color="error" @click.prevent="$refs.upload.remove(file)">
                <v-icon small>mdi-trash-can-outline</v-icon>삭제
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
        <v-divider v-if="uploadFiles.length > 0 && (limit === 0 || (limit > 0 && limit - uploadFiles.length > 0))"></v-divider>
        <div v-show="readonly === false && (limit === 0 || (limit > 0 && limit - uploadFiles.length > 0))">
          <v-list-item class="pt-3 pb-3">
            <file-upload
              ref="upload"
              v-model="uploadFiles"
              :post-action="uploadUrl"
              :extensions="extensions"
              :accept="accept"
              :headers="attachHeaders"
              :data="attachData"
              :multiple="true"
              :maximum="limit"
              :input-id="inputId"
              @input-file="fnAttachInput"
              @input-filter="fnAttachFilter"
              style="width: 100%;"
            >
              <v-btn x-large outlined block color="info">
                <v-icon left dark>mdi-file-upload</v-icon>새로운 파일 업로드하기
                <span v-if="limit > 0">({{ limit - uploadFiles.length }}개 추가 가능)</span>
              </v-btn>
            </file-upload>
          </v-list-item>
        </div>
      </v-list>
    </v-card>
    <v-messages v-if="!hideMessage" :value="errorBucket" color="error" class="mt-2"></v-messages>
  </div>
</template>

<script>
import VInput from 'vuetify/lib/components/VInput/VInput'
import AttachMixin from 'Mixins/attach.mixin'
import StringUtil from '@/utils/string.util'

export default {
  name: 'Attach',
  extends: VInput,
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      uploadUrl: '/zuul/api/system/attach/upload', // 파일 업로드용 URL (/zuul prefix를 붙이지 않으면 파라미터가 손실됨)
      downloadUrl: '/api/system/attach/download/' // 파일 다운로드용 URL
    }
  },
  props: {
    // 참조항목코드 (ex: exBoard)
    refFldCd: {
      type: String,
      required: true
    },
    // 첨부파일항목값 (ex: thumbs_p)
    atflFldVal: {
      type: String,
      required: true
    },
    // 첨부파일 객체
    value: {
      type: Object,
      required: true
    },
    // 최대 업로드 개수 (기본값: 1)
    limit: {
      type: Number,
      default () {
        return 1
      }
    },
    // 이미지 파일의 경우 압축대상 용량 기준(입력된 byte수를 초과하는 파일은 자동 압축)
    autoCompress: {
      type: Number,
      default () {
        return 1048576 // 1024.00 KB 이상 이미지 파일 압축
      }
    },
    extensions: {
      type: String,
      default () {
        return 'gif,jpg,jpeg,png' // 확장자 제한
      }
    },
    accept: {
      type: String,
      default () {
        return 'image/png,image/gif,image/jpeg' // 업로드 가능파일
      }
    },
    width: {
      type: String,
      default () {
        return '70'
      }
    },
    height: {
      type: String,
      default () {
        return '70'
      }
    },
    inputId: {
      type: String,
      default () {
        return 'file-' + StringUtil.guid()
      }
    },
    readonly: {
      type: Boolean,
      default () {
        return false
      }
    },
    hideMessage: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  mixins: [AttachMixin],
  mounted () {
    const existFiles = Object.assign([], this.value[this.atflFldVal])
    existFiles.forEach(fileItem => {
      this.$refs.upload.add(fileItem)
    })
  }
}
</script>
