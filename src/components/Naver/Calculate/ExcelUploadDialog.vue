<template>
    <dialog-base title="일정산 엑셀 업로드" :instance="instance">
        <v-stepper v-model="step">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="step > 1">파일 선택</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="step > 2">선택한 파일 확인</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" :complete="step > 3">파일 업로드</v-stepper-step>
            </v-stepper-header>
        </v-stepper>
        <div class="mt-5">
            <!-- STEP 1 : 파일 선택 -->
            <div class="text-center" v-if="step === 1 && isLoading === false">
                <v-file-input
                    ref="fileInput"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    label="여기를 클릭하여 업로드 할 일정산 엑셀 파일을 선택해 주세요."
                    class="mt-12 mb-12 ml-12 mr-12"
                    @change="selectExcel"
                ></v-file-input>
                <p class="mb-5">
                    (일정산 엑셀 파일은
                    <a href="#" @click.prevent="downloadExcelTemplate" title="템플릿 파일 다운로드">
                        템플릿 파일
                        <strong>[다운로드]</strong>
                    </a>을 이용하여 작성바랍니다)
                    <br />
                </p>
            </div>
            <!-- STEP 1.5 : 파일 선택 후 로딩 -->
            <div class="text-center" v-if="step === 1 && isLoading === true">
                <div class="mt-12 mb-12 ml-12 mr-12">
                    <v-progress-circular indeterminate :size="70" color="primary"></v-progress-circular>
                    <br />
                    <br />
                    <strong class="primary--text">선택하신 파일을 분석하고 있습니다. 잠시만 기다려주세요...</strong>
                </div>
            </div>
            <!-- STEP 2 : 선택한 파일 확인 -->
            <div v-else-if="step === 2">
                <v-row>
                    <v-col cols="6">
                        <h4>[{{ this.fileName }}] 일정산 엑셀 파일이 선택되었습니다.</h4>
                    </v-col>
                    <v-col cols="6" class="text-right">
            <span class="ml-3">
              {{ sheets[0].name }}
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip small v-on="on">총 {{ sheets[0].rows.length }}건</v-chip>
                </template>
                <span>엑셀에서 입력하신 {{ sheets[0].name }}의 데이터 행(row) 개수입니다.</span>
              </v-tooltip>
            </span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-btn outlined rounded color="grey" @click="prevStep">
                            <v-icon left>undo</v-icon>
                            다시 선택
                        </v-btn>
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <v-btn outlined rounded color="accent" @click="insertDaySetTables">
                            <v-icon left>check</v-icon>
                            파일 업로드
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <!-- STEP 3 : 파일 업로드 -->
            <div class="text-center" v-else-if="step === 3">
                <div class="mt-12 mb-12 ml-12 mr-12">
                    <strong class="primary--text">일정산 정보를 업로드하고 있습니다. 잠시만 기다려주세요...</strong>
                </div>
            </div>
        </div>
    </dialog-base>
</template>

<script>
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/naver/calculateDay.service'

const COMMON_SHEET_HEADER = [
  '주문번호',
  '상품주문번호',
  '구분',
  '상품명',
  '구매자명',
  '정산기준일',
  '정산예정일',
  '정산완료일',
  '결제금액(A)',
  '결제수수료(B)',
  '매출연동 수수료(D)',
  '매출 연동 수수료 구분',
  '정산구분'
]
const COMMON_SHEET_EXAMPLE = [
  '2020061112345678',
  '2020061112345678',
  '상품주문',
  '소노캄C (구.호텔)',
  '김00',
  '20200812',
  '20200813',
  '20200813',
  '230000',
  '7337',
  '14421',
  '네이버예약',
  '정산'
]

const DAY_SETS_SHEET_NAME = '결제정산 - 일별상세'
const DAY_SETS_SHEET_HEADER = [
  ...COMMON_SHEET_HEADER
]
const DAY_SETS_SHEET_EXAMPLE = [
  ...COMMON_SHEET_EXAMPLE
]

export default {
  name: 'ExcelUploadDialog',
  extends: DialogBase,
  data () {
    return {
      /**
             * 단계값
             */
      step: 1,
      /**
             * 로딩 여부
             */
      isLoading: false,
      /**
             * 선택한 엑셀 파일 시트 데이터
             */
      sheets: null,
      /**
             * 요금 설정 표 목록
             */
      daySetTables: null,
      fileName: null
    }
  },
  methods: {
    /**
         * 엑셀 파일 선택
         */
    async selectExcel (file) {
      this.isLoading = true
      setTimeout(() => {
        this.sheets = []
        const reader = new FileReader()
        reader.onload = async () => {
          const fileData = reader.result
          const workbook = XLSX.read(fileData, { type: 'binary' })
          const sheets = []
          const name = workbook.SheetNames[0]
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          sheets.push({
            name,
            rows
          })
          if (
            sheets.length === 1 &&
                        sheets[0].name === DAY_SETS_SHEET_NAME
          ) {
            if (sheets[0].rows.length > 0 && sheets[0].rows.length < 1001) {
              this.sheets = sheets
              try {
                const res = await service.convertSheetsToTables(sheets[0].rows)
                this.daySetTables = res.data
                this.fileName = file.name
                this.nextStep()
              } catch {
                this.resetFileInput()
              }
            } else if (sheets[0].rows.length > 1000) {
              this.$dialog.alert('1000건 이하로 등록 가능합니다.')
              this.resetFileInput()
            } else {
              this.$dialog.alert('입력된 데이터가 없습니다.')
              this.resetFileInput()
            }
          } else {
            this.$dialog.alert('잘못된 일정산 엑셀 파일입니다.')
            this.resetFileInput()
          }
        }
        reader.readAsBinaryString(file)
      }, 500)
    },
    /**
         * 엑셀 파일 선택 초기화
         */
    resetFileInput () {
      this.step = 0
      setTimeout(() => {
        this.step = 1
        this.isLoading = false
      })
    },
    /**
         * 이전 단계로 이동
         */
    prevStep () {
      if (this.step > 1) {
        this.step--
      }
      this.isLoading = false
    },
    /**
         * 다음 단계로 이동
         */
    nextStep () {
      if (this.step < 3) {
        this.step++
      }
      this.isLoading = false
    },
    /**
         * 엑셀 템플릿 파일 다운로드
         */
    async downloadExcelTemplate () {
      const workbook = XLSX.utils.book_new()
      const daySetSheet = XLSX.utils.aoa_to_sheet([
        DAY_SETS_SHEET_HEADER,
        DAY_SETS_SHEET_EXAMPLE
      ])
      XLSX.utils.book_append_sheet(
        workbook,
        daySetSheet,
        DAY_SETS_SHEET_NAME
      )
      const workbookFile = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'binary'
      })
      const buf = new ArrayBuffer(workbookFile.length) // convert s to arrayBuffer
      const view = new Uint8Array(buf) // create uint8array as viewer
      for (var i = 0; i < workbookFile.length; i++) {
        view[i] = workbookFile.charCodeAt(i) & 0xff // convert to octet
      }
      saveAs(
        new Blob([buf], { type: 'application/octet-stream' }),
                `결제정산-일별상세_${moment().format('YYYYMMDDHHmmss')}.xlsx`
      )
    },
    /**
         * 요금 설정 표 목록 데이터 등록하기
         */
    async insertDaySetTables () {
      let snackbarObj = null
      if (this.daySetTables.length < 1) {
        await this.$dialog.alert('업로드할 데이터가 없습니다. 엑셀 파일을 확인해 주세요.')
        return
      }
      this.nextStep()
      try {
        await service.insertCalculateDay(this.daySetTables)
        snackbarObj = { type: 'success', text: '알림이 오면 확인해주세요.' }
        this.close({ data: snackbarObj })
      } catch {
        this.prevStep()
      }
    }
  }
}
</script>
