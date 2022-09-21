<template>
  <div class="file_upload_container">
    <input
      type="file"
      accept="image/*"
      style="display: none;"
      :multiple="isMultiple"
      :id="inputId"
      @change="fileChanged"
    />
    <v-btn color="primary" rounded @click="openFileInput">
      <v-icon>mdi-image</v-icon>이미지 등록
    </v-btn>
    <div>
      <ul class="image_list">
        <li class="image_item" v-for="(image, imageIndex) in previewImages" :key="imageIndex">
          <v-btn
            class="image_delete_button"
            fab
            dark
            x-small
            color="primary"
            @click="deleteImage(imageIndex)"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
          <img :src="image.src" :style="{'max-height': maxHeight + 'px'}">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    inputId: {
      type: String,
      default: 'fileUploadInput'
    },
    isMultiple: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number,
      default: 200
    },
    imageList: Array,
  },
  data () {
    return {
      previewImages: [],
      imageFileList: []
    }
  },
  methods: {
    deleteImage (imageIndex) {
      this.previewImages.splice(imageIndex, 1)
      this.imageFileList.splice(imageIndex, 1)
      this.$emit('update:imageList', this.imageFileList)
    },
    openFileInput () {
      document.getElementById(this.inputId).click()
    },
    fileChanged (event) {
      event.target.files.forEach(image => {
        const reader = new FileReader()
        reader.onload = (eve) => {
          this.previewImages.push({
            type: 'image',
            src: eve.target.result,
            file: image
          })
        }

        reader.readAsDataURL(image)
        this.imageFileList.push(image)
      })

      this.$emit('update:imageList', this.imageFileList)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.file_upload_container { position: relative; }
.image_list { padding: 0; margin: 10px 0 0; }
.image_item { position: relative; display: inline-block; margin-left: 10px; }
.image_item:first-child { margin-left: 0; }
.image_delete_button { position: absolute; top: 5px; right: 5px; }
</style>
