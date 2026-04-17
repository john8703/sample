.PHONY: install dev build preview deploy clean help

# 기본 타겟
.DEFAULT_GOAL := help

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

clean: ## 빌드 결과물 삭제
	rm -rf dist node_modules

help: ## 사용 가능한 명령어 목록
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
