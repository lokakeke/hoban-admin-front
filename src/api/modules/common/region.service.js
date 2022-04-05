export default {

  /**
     * D.G.N.S 지역코드 목록 조회 - 임시
     */
  selectRegionList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { regionCode: 11, regionName: '비발디', useYn: 'Y' },
          { regionCode: 22, regionName: '소노', useYn: 'Y' },
          { regionCode: 33, regionName: '델피노', useYn: 'N' },
          { regionCode: 44, regionName: '삼척', useYn: 'Y' },
          { regionCode: 55, regionName: '양양', useYn: 'N' },
          { regionCode: 66, regionName: '여수', useYn: 'Y' }
        ]
      })
    })
  }

}
