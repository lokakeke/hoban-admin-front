import api from 'Api'
// (woojung)

const excelMixin = {
  methods: {
    downLoadExcel (url, fileName, param, extension) {
      if (!extension) {
        extension = '.xlsx'
      }
      if (!url) {
        this.$dialog.alert('엑셀 다운로드 url 정보가 누락 되었습니다.')
        return
      } else if (!fileName) {
        this.$dialog.alert('엑셀 다운로드 파일이름이 누락 되었습니다.')
        return
      }
      if (!param) {
        param = {}
      }
      fileName = fileName + '_' + moment().format('YYYY년MM월DD일HH시mm분ss초') + extension
      this.$dialog.confirm('엑셀 다운로드를 진행 하시겠습니까?').then(() => {
        api.get(url, { params: param, responseType: 'arraybuffer' }).then(res => {
          this.downLoadExcelFile(res, fileName)
        })
      })
    },
    async downLoadExcelPost (url, fileName, param, extension) {
      try {
        if (!extension) {
          extension = '.xlsx'
        }
        if (!url) {
          this.$dialog.alert('엑셀 다운로드 url 정보가 누락 되었습니다.')
          return
        } else if (!fileName) {
          this.$dialog.alert('엑셀 다운로드 파일이름이 누락 되었습니다.')
          return
        }
        if (!param) {
          param = {}
        }
        fileName = fileName + '_' + moment().format('YYYY년MM월DD일HH시mm분ss초') + extension
        await this.$dialog.confirm('엑셀 다운로드를 진행 하시겠습니까?')
        const res = await api.post(url, param, { responseType: 'arraybuffer' })
        this.downLoadExcelFile(res, fileName)
      } catch (e) {}
    },
    downLoadExcelFile (res, fileName) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.target = '_self'
      link.download = fileName
      link.click()
    }
  }
}

export default excelMixin
