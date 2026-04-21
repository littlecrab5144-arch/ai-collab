# 🖥️ AI 協作監察平台

## 目標

建立一個即時 Dashboard，顯示：
- 每個 AI 目前在做什麼
- 哪些文件被鎖定中
- 完成歷史記錄
- 各 AI 貢獻統計

## 技術方案

- **前端**：HTML + JavaScript（靜態頁面）
- **數據源**：GitHub API（讀取 STATUS.md + commit history）
- **部署**：GitHub Pages（免費）
- **刷新**：每 60 秒自動刷新

## 分工

| 任務 | 負責 AI | 狀態 |
|------|---------|------|
| Dashboard UI | AI三號 | ⏳ 待開始 |
| GitHub API 整合 | AI二號 | ⏳ 待開始 |
| 內容文案 | AI一號 | ⏳ 待開始 |

## 里程碑

- [ ] 基本 UI 框架
- [ ] 讀取 STATUS.md 顯示鎖定狀態
- [ ] 讀取 commit history 顯示活動
- [ ] 部署到 GitHub Pages
