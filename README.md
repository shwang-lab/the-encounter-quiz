# The Encounter — Listening Quiz

25문항 리스닝 퀴즈 웹앱. GitHub Pages에 올려서 학생들에게 링크만 주면 됩니다.

- 학생: 이름 선택 + 오늘의 클래스 코드 입력 → 25문항 (오디오 2회 제한) → 제출 전 PDF 저장 가능 → 제출 시 자동 채점
- 결과는 Google Sheets에 자동 저장
- 강사(instructor.html): 비밀번호(`EngthruFilms100`)로 입장 → 전체 제출 현황·문항별 답 확인, 오늘의 클래스 코드 설정

---

## 1. Google Sheet + Apps Script 설정 (딱 한 번만 하면 됨)

1. [sheets.google.com](https://sheets.google.com) 에서 새 스프레드시트를 만들고 이름을 정해주세요. (예: `Encounter Quiz 2026`)
2. 메뉴에서 **확장 프로그램 > Apps Script** 클릭.
3. 기본으로 열려있는 `Code.gs` 파일 내용을 전부 지우고, 이 프로젝트의 `apps-script/Code.gs` 내용을 통째로 붙여넣기.
4. 오른쪽 위 **배포 > 새 배포** 클릭.
   - 유형: **웹 앱**
   - 실행 계정: **나**
   - 액세스 권한이 있는 사용자: **모든 사용자**
   - **배포** 클릭 → 권한 승인 (본인 계정으로 로그인, "고급" → "안전하지 않은 페이지로 이동" 눌러도 괜찮음, 본인이 만든 스크립트라서 안전함)
5. 배포 완료 후 나오는 **웹 앱 URL**을 복사해두세요. (`https://script.google.com/macros/s/.../exec` 형태)

> 이 URL이 학생 답안이 저장되는 곳으로 가는 유일한 통로입니다. 이후 코드나 명단을 바꿔도 이 URL은 그대로 재사용됩니다.

## 2. 사이트에 URL과 명단 연결

1. `js/config.js` 열어서 `APPS_SCRIPT_URL` 값을 1번에서 복사한 URL로 교체.
2. `js/students.js` 에 올해 학생 명단이 이미 들어가 있습니다. 내년에는 이 파일의 이름 목록만 바꾸면 됩니다.
3. 강사 페이지 비밀번호를 바꾸고 싶다면 `js/config.js`의 `INSTRUCTOR_PASSWORD` **그리고** `apps-script/Code.gs`의 `INSTRUCTOR_PASSWORD` 둘 다 같은 값으로 바꿔주세요 (Apps Script는 다시 배포해야 반영됨: 배포 > 배포 관리 > 수정 > 새 버전).

## 3. GitHub Pages에 올리기

```bash
cd quiz-site
git init
git add .
git commit -m "The Encounter listening quiz"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

그 다음 GitHub 저장소 **Settings > Pages** 에서:
- Source: `Deploy from a branch`
- Branch: `main` / `(root)`

몇 분 후 `https://<username>.github.io/<repo>/` 로 접속되고, 강사 페이지는 `https://<username>.github.io/<repo>/instructor.html` 입니다.

## 4. 시험 당일

1. `instructor.html` 접속 → 비밀번호 입력 → 대시보드 진입.
2. "오늘의 클래스 코드" 칸에 원하는 코드(숫자/문자 아무거나) 입력 후 **코드 설정**. 시험 시작 직전에 공지하세요.
3. 학생에게 `index.html` 링크 공유. 이름 선택 + 코드 입력하면 입장.
4. 제출되는 대로 강사 페이지에서 **새로고침**을 누르면 실시간으로 반영됩니다.
5. 시험이 끝나면 코드를 다른 값으로 바꿔두면 이후 재사용(부정 재접속)을 막을 수 있습니다.

## 재사용 방법 (내년/다음 학기)

매번 새로 만들 필요 없이 아래 세 가지만 바꾸면 됩니다:

1. `js/students.js` — 새 학생 명단으로 교체
2. Google Sheets — 연도/반별로 새 스프레드시트를 만들고 그 안에 Apps Script를 새로 배포해서 `js/config.js`의 URL을 교체 (작년 데이터와 섞이지 않도록)
3. 시험 당일 클래스 코드는 매번 새로 설정

퀴즈 문항·정답·오디오(`js/quiz-data.js`, `audio/`)는 그대로 두면 됩니다.

## 알아두면 좋은 점 (보안 관련 솔직한 설명)

- **강사 비밀번호는 완벽한 보안이 아닙니다.** GitHub Pages는 정적 사이트라 학생이 브라우저 개발자 도구로 페이지 소스를 보면 비밀번호 문자열 자체를 찾을 수 있습니다. 다만 채점 API 쪽(`getResults`)은 Apps Script 서버에서도 같은 비밀번호를 한 번 더 검사하므로, 최소한 "그냥 URL만 알면 아무나 결과를 본다"는 상황은 막아줍니다.
- **정답도 클라이언트(`js/quiz-data.js`)에 있습니다.** 마음만 먹으면 개발자 도구로 정답을 찾을 수 있는 구조입니다. 완전히 막으려면 채점을 서버(Apps Script)에서만 하도록 바꿔야 하는데, 원하시면 이 부분도 개선해드릴 수 있어요.
- **클래스 코드**는 매 시험마다 바꾸는 것을 전제로 설계했습니다. 코드를 안 바꾸면 이전 시험 링크로 다시 들어와 재제출하는 것도 막을 방법이 없습니다.
- 오디오 재생 2회 제한은 "재생 버튼을 다시 누르는 것"만 막습니다. 학생이 개발자 도구를 열어 오디오 파일을 직접 재생하는 것까지는 막지 못합니다 (일반적인 교실 시험 환경에서는 보통 문제되지 않는 수준입니다).

## 파일 구조

```
quiz-site/
├── index.html          학생용 퀴즈 페이지
├── instructor.html     강사용 채점 페이지
├── css/
│   ├── style.css
│   └── instructor.css
├── js/
│   ├── config.js       ← Apps Script URL, 강사 비밀번호 (여기 수정)
│   ├── students.js     ← 학생 명단 (매년 여기 수정)
│   ├── quiz-data.js    문항·정답·오디오 매핑
│   ├── app.js           학생 화면 로직
│   └── instructor.js    강사 화면 로직
├── audio/               21개 오디오 클립 (q01.mp3 ~ q25.mp3)
├── apps-script/
│   └── Code.gs          Google Apps Script에 붙여넣을 코드
└── README.md
```
