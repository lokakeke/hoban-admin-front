import draggable from 'vuedraggable'
import ImageCompressor from 'image-compressor.js'

const mixin = {
  components: {
    draggable
  },
  data () {
    return {
      attachHeaders: { 'jwt-header': this.$store.getters['auth/jwtToken'] },
      attachData: {
        refFldCd: this.refFldCd,
        atflFldVal: this.atflFldVal
      },
      uploadFiles: []
    }
  },
  watch: {
    uploadFiles (model) {
      const attachBag = _.cloneDeep(this.value)
      attachBag[this.atflFldVal] = model
      this.$emit('change', attachBag)
      const onFieldChange = this.$parent.onFieldChange
      if (onFieldChange) {
        onFieldChange()
      }
    }
  },
  methods: {
    /**
     * 파일 변경 filter
     * @param newFile
     * @param oldFile
     * @param prevent
     * @returns {*}
     */
    fnAttachFilter (newFile, oldFile, prevent) {
      if (newFile && newFile.file && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
          newFile.error = 'compress'
          const imageCompressor = new ImageCompressor()
          imageCompressor.compress(newFile.file, {
            convertSize: 1000000,
            maxWidth: 1920
          }).then((file) => {
            this.$refs.upload.update(newFile, {
              error: '', file, size: file.size, type: file.type
            })
          }).catch((err) => {
            this.$refs.upload.update(newFile, { error: err.message || 'compress' })
          })
        }
      }
      if (newFile && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        const URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
      return false
    },
    /**
     * 파일 변경 이벤트
     * @param newFile
     * @param oldFile
     */
    fnAttachInput (newFile, oldFile) {
      // Update file
      if (newFile && oldFile) {
        // Upload progress
        if (newFile.progress !== oldFile.progress) {
        }
        // Upload error
        if (newFile.error !== oldFile.error && oldFile.error !== 'compress') {
          // 실패 메세지 노출
          this.$dialog.alert(`${newFile.name} 업로드에 실패하였습니다. ${newFile.error}`)
          this.$refs.upload.remove(newFile)
        }

        // Uploaded successfully
        if (newFile.success !== oldFile.success) {
          // 성공 메세지 노출
        }
      }
      // Automatic upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (newFile && !newFile.active) {
          newFile.active = true
        }
      }
      if (!newFile && oldFile) {
        const deleteFileCode = '_deleted'
        // remove
        if (oldFile.success && oldFile.filePath) {
          if (!this.value[deleteFileCode]) {
            this.value[deleteFileCode] = []
          }
          this.value[deleteFileCode].push(oldFile)
        }
        this.$refs.upload.remove(oldFile)
      }
    }
  }
}

export default mixin
