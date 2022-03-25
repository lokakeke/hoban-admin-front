export default {

  /**
     * D.G.N.S 지역코드 목록 조회 - 임시
     */
  selectRegionList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { regionCd: 11, regionNm: '비발디', useYn: 'Y' },
          { regionCd: 22, regionNm: '소노', useYn: 'Y' },
          { regionCd: 33, regionNm: '델피노', useYn: 'N' },
          { regionCd: 44, regionNm: '삼척', useYn: 'Y' },
          { regionCd: 55, regionNm: '양양', useYn: 'N' },
          { regionCd: 66, regionNm: '여수', useYn: 'Y' }
        ]
      })
    })
  }

}
