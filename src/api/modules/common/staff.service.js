export default {

  /**
     * D.G.N.S 사원 목록 조회 - 임시
     */
  selectStaffList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { emplNo: 1111, adminName: '사원1', useYn: 'Y' },
          { emplNo: 2222, adminName: '사원2', useYn: 'Y' },
          { emplNo: 3333, adminName: '사원3', useYn: 'N' },
          { emplNo: 4444, adminName: '사원4', useYn: 'Y' },
          { emplNo: 5555, adminName: '사원5', useYn: 'N' },
          { emplNo: 6666, adminName: '사원6', useYn: 'Y' }
        ]
      })
    })
  }

}
