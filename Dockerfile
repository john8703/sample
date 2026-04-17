# ── 1단계: 빌드 ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── 2단계: 서빙 (nginx) ────────────────────────────────────────
FROM nginx:alpine

# Cloud Run은 8080 포트 사용
EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 기본 conf에서 daemon off 확인 후 실행
CMD ["nginx", "-g", "daemon off;"]
