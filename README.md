# Micro Frontend Project

마이크로프론트엔드 아키텍처로 구성된 프로젝트입니다.

## 구조

```
├── packages/
│   ├── shell/      # 호스트 앱 (포트 3000)
│   └── chatbot/    # 챗봇 마이크로앱 (포트 3001)
├── package.json    # 워크스페이스 루트
└── pnpm-workspace.yaml
```

## 기술 스택

- **빌드 도구**: Vite 7.x
- **프레임워크**: React 19
- **MFE**: Module Federation (@originjs/vite-plugin-federation)
- **언어**: TypeScript
- **패키지 매니저**: pnpm (workspace)

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

#### 모든 앱 동시 실행
```bash
pnpm dev
```

#### 개별 실행
```bash
# Shell (호스트) 앱만
pnpm dev:shell

# Chatbot 앱만
pnpm dev:chatbot
```

### 3. WebSocket 서버 실행 (선택)

실시간 채팅 테스트를 위해 WebSocket 서버 실행:

```bash
cd packages/chatbot
node server.js
```

## 포트 구성

| 앱 | 포트 | 설명 |
|---|---|---|
| Shell | 3000 | 메인 호스트 애플리케이션 |
| Chatbot | 3001 | 챗봇 리모트 모듈 |
| WebSocket | 8080 | 실시간 채팅 서버 (테스트용) |

## 빌드

```bash
pnpm build
```

## Module Federation 구성

### Shell (Host)
- Chatbot 모듈을 `http://localhost:3001/assets/remoteEntry.js`에서 로드
- React, React-DOM을 공유 의존성으로 설정

### Chatbot (Remote)
- `./Chatbot` 컴포넌트를 외부에 노출
- 독립 실행 모드도 지원 (개발/테스트용)

## 개발 가이드

### 새 마이크로앱 추가

1. `packages/` 디렉토리에 새 패키지 생성
2. `vite.config.ts`에 federation 설정 추가
3. Shell의 remotes에 새 앱 등록
4. `pnpm-workspace.yaml`은 자동으로 인식

### 공유 의존성 추가

`vite.config.ts`의 `shared` 배열에 패키지명 추가:

```ts
federation({
  shared: ['react', 'react-dom', 'your-shared-lib'],
})
```
