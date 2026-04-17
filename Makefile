.PHONY: install dev build preview deploy deploy-gcp clean help

# 기본 타겟
.DEFAULT_GOAL := help

GCP_PROJECT  := ai-chat-493603
GCP_REGION   := asia-northeast3
SERVICE_NAME := todo-app
IMAGE        := $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT)/todo-repo/$(SERVICE_NAME)

install: ## 의존성 설치
	npm install

dev: ## 개발 서버 실행 (http://localhost:5173)
	npm run dev

build: ## 프로덕션 빌드 (dist/)
	npm run build

preview: ## 빌드 결과 로컬 미리보기
	npm run preview

deploy: build ## 빌드 후 GitHub Pages 배포
	git add dist -f
	git commit -m "deploy: $(shell date +'%Y-%m-%d %H:%M:%S')"
	git push origin main

deploy-gcp: build ## 빌드 확인 후 main 푸시 → GitHub Actions가 Cloud Run 배포
	@echo "✅ 빌드 성공 — main 브랜치에 푸시하여 Cloud Run 배포를 트리거합니다"
	git add -A
	git diff --cached --quiet || git commit -m "deploy(gcp): $(shell date +'%Y-%m-%d %H:%M:%S')"
	git push origin main
	@echo "🚀 GitHub Actions 배포 시작: https://github.com/john8703/sample/actions"

clean: ## 빌드 결과물 삭제
	rm -rf dist node_modules

help: ## 사용 가능한 명령어 목록
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
