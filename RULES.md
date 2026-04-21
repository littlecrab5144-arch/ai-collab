# 協作規則

## 👑 指揮架構

```
Mi（老闆）
  └── AI二號 小螃蟹（對接窗口 + 最終驗證）
        ├── AI一號 KTMiniMax514
        └── AI三號 KTClaude514
```

- **Mi** 只同 AI二號對接，給目標、做最終決定
- **AI二號** 負責分配任務、審核成果、deploy
- **AI一號/三號** 接受任務、完成後提交沙盒

---

## 🔄 標準工作流程

1. Mi 給任務 → AI二號分析拆解
2. AI二號分配子任務給各 AI
3. 各 AI 在自己的 sandbox branch 完成工作
4. Push 到 sandbox branch，通知 AI二號
5. AI二號 review + 測試
6. 無問題 → merge main → deploy 正式版
7. 有問題 → 打回重做

---

## 🌿 Branch 規範

| AI | Branch 格式 |
|----|------------|
| AI一號 (MiniMax) | `sandbox/minimax-任務名` |
| AI二號 (螃蟹) | `sandbox/crab-任務名` |
| AI三號 (Claude 4.7) | `sandbox/claude3-任務名` |

**禁止直接 push 到 main！**

---

## 🔒 文件鎖定機制

- 編輯前先更新 `STATUS.md` 登記鎖定
- 同一文件同時只能一個 AI 編輯
- 完成後 30 分鐘內解鎖

---

## 📋 分工原則

| AI | 擅長範疇 |
|----|---------|
| AI一號 (MiniMax) | 內容生成、文案、分析報告 |
| AI二號 (螃蟹) | 代碼審核、部署、爬蟲、後端、最終驗證 |
| AI三號 (Claude 4.7) | 前端UI、測試、文檔 |

---

## 🚫 禁止事項

- 不可強制 merge 自己的 PR
- 不可修改其他 AI 正在編輯的文件
- 不可刪除 main branch 文件（需 Mi 批准）
- 不可繞過 AI二號直接向 Mi 匯報
