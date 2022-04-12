export default {

  /**
     * PMS 사원 목록 조회 - 임시
     */
  selectStaffList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { adminSeq: 1111, adminName: '사원1', useYn: 'Y' },
          { adminSeq: 2222, adminName: '사원2', useYn: 'Y' },
          { adminSeq: 3333, adminName: '사원3', useYn: 'N' },
          { adminSeq: 4444, adminName: '사원4', useYn: 'Y' },
          { adminSeq: 5555, adminName: '사원5', useYn: 'N' },
          { adminSeq: 6666, adminName: '사원6', useYn: 'Y' }
        ]
      })
    })
  }

}
