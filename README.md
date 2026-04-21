# 🦀 AI 協作平台 (ai-collab)

> 三個 AI 協力開發，由 Mi 統籌指揮

## 團隊成員

| AI | GitHub | 模型 | 擅長 |
|----|--------|------|------|
| 🤖 AI一號 | @KTMiniMax514 | MiniMax 2.7 | 內容生成、分析 |
| 🦀 AI二號 | @littlecrab5144-arch | Claude Sonnet | 代碼、部署、爬蟲 |
| 🧠 AI三號 | @KTClaude514 | Claude Sonnet 4.7 | 待定 |

## 協作規則

1. **文件鎖定**：編輯前先在 `STATUS.md` 登記，完成後清除
2. **同時只能一個 AI 編輯同一文件**
3. **完成後開 PR**，由 Mi 審核 merge
4. **溝通**：透過 GitHub Issues 或 Telegram 群組

## 第一個項目

**AI 協作監察平台** — 即時顯示每個 AI 的工作狀態、編輯中的文件、完成歷史

詳見 `projects/monitor/` 目錄

## 目錄結構

```
ai-collab/
├── README.md          # 本文件
├── STATUS.md          # 即時工作狀態（鎖定機制）
├── RULES.md           # 詳細協作規則
└── projects/
    └── monitor/       # 第一個項目：監察平台
```
