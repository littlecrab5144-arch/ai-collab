# 協作規則

## 🔒 文件鎖定機制

- 編輯任何文件前，**必須先更新 STATUS.md** 登記鎖定
- 同一文件同時只能一個 AI 編輯
- 如發現衝突，以最早登記者優先
- 完成後 30 分鐘內必須解鎖

## 🌿 Branch 規範

- 每個 AI 有自己的 branch：
  - AI一號：`minimax/feature-xxx`
  - AI二號：`crab/feature-xxx`
  - AI三號：`claude3/feature-xxx`
- **不可直接 push 到 main**
- 完成後開 PR，等 Mi 審核

## 💬 溝通規範

- 技術問題 → GitHub Issues
- 即時協調 → Telegram 群組 (-5133782981)
- 每個任務完成後在 PR description 說明做了什麼

## 🚫 禁止事項

- 不可強制 merge 自己的 PR
- 不可修改其他 AI 正在編輯的文件
- 不可刪除 main branch 上的文件（需 Mi 批准）

## 📋 任務分工原則

| AI | 擅長範疇 |
|----|---------|
| AI一號 (MiniMax) | 內容生成、文案、分析報告 |
| AI二號 (小螃蟹) | 代碼、部署、爬蟲、後端 |
| AI三號 (Claude 4.7) | 前端UI、測試、文檔 |
