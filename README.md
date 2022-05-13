# Hoban Hotel&Resort

Hoban Hotel&Resort API 관리 시스템 홈페이지
<br /><br />

##설치 전 사전 작업 (이미 되어있으면 안해도 무방)
* node.js 16.x 버전 설치. (npm도 같이 설치 됨)
  다운로드: https://nodejs.org/ko
* git client 최신 버전 설치.
  다운로드: https://git-scm.com/downloads

##설치 (최초 1회 실행)
1. cmd(Mac은 Terminal) 실행.
2. 프로젝트의 `package.json` 파일이 존재하는 최상단 디렉토리로 이동.
3. 아래 명령어를 입력하여 `package.json`에 정의된 node.js 의존성 라이브러리 설치.
   `yarn install`
   <br />
4. husky 훅 추가.
   `npx husky add .husky/pre-commit "yarn build"`
   `git add .husky/pre-commit`

##스크립트 명령1: 로컬 개발서버 실행 (serve)
cmd에서 `package.json`이 존재하는 디렉토리로 이동 후 아래 명령어를 입력.

`yarn run serve`

(명령어가 실행되면 **127.0.0.1:9090** 으로 개발용 서버가 실행됨)

##스크립트 명령2: 배포용 파일 생성 (build)
cmd에서 `package.json`이 존재하는 디렉토리로 이동 후 아래 명령어를 입력.

`yarn build`

(명령어가 실행되면 /dist 디렉토리에 vite 으로 번들링이 완료된 배포용 파일이 생성 됨. 이 파일들을 별도의 웹서버에 복사하면 배포 완료)
<br />

##스크립트 명령2: 배포용 파일 개발서버 실행 (preview:build)
cmd에서 `package.json`이 존재하는 디렉토리로 이동 후 아래 명령어를 입력.

`yarn preview:build`
번들링이 완료된 배포용 파일을 사용해 개발서버 실행

(명령어가 실행되면 /dist 디렉토리에 vite 으로 번들링이 완료된 배포용 파일이 생성 됨. 이 파일들을 별도의 웹서버에 복사하면 배포 완료)
<br />

##Vue.js 개발 시 필수 유틸
- Vue.js devtools (Chrome Extension) 설치 필요함.
  - 설치 링크 : https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
  <br />

##추천 개발툴
- Webstorm(유료)
- Visual Studio Code(=vscode, 무료)
<br />

##소스에 문제가 없는데 개발서버 or 배포 스크립트 실행이 안되는 경우
1. `/node_modules` 디렉토리 삭제.
2. 위의 설치 과정(`yarn install`)을 실행.
3. 다시 작업 시도

## 기타
- `auto-import.d.ts` 에 빨간색 경고표시가 뜨지만 typescript 관련 경고, 신경쓰지 않아도 된다.
