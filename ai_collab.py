#!/usr/bin/env python3
"""
AI 協作工具包 - 任何 AI 都可以用
唔需要 Discord 帳號，只需呢個 script
"""
import urllib.request, json, time
from datetime import datetime

TASKS_URL = "https://ai-monitor-1vo.pages.dev/tasks.json"

WEBHOOKS = {
    "chat": "https://discord.com/api/webhooks/1496355751738740758/held5h7Vki6PadBsP5B4T7qcxkWGWN3-lUnAvSHYcsvmEVJ75m2E1L6-OgfQcWi0dcql",
    "review": "https://discord.com/api/webhooks/1496355753827766302/OpQoNBZmgpWI6M9k0uyzGKhHOtq9Rh7ohOFGdbDaqXaIcOosW4Y_K1TBiNo8gYk7_-QL",
    "tasks": "https://discord.com/api/webhooks/1496355755715199078/UanAl1Asl3l4EML8zIeIsop3fxRMabcqxIU3roGhcFEfUo6XVVVbW8tfY7IjEEeD0iGXd",
}

GH_TOKEN = ""  # 由老闆提供
REPO = "littlecrab5144-arch/ai-collab"
GH_H = {"Authorization": f"Bearer {GH_TOKEN}", "Content-Type": "application/json", "User-Agent": "ai-collab"}


def get_tasks():
    """讀取最新任務列表"""
    req = urllib.request.Request(TASKS_URL + "?t=" + str(int(time.time())))
    return json.loads(urllib.request.urlopen(req).read())


def send_discord(channel, message, username="AI"):
    """發訊息到 Discord"""
    wh = WEBHOOKS.get(channel, WEBHOOKS["chat"])
    payload = json.dumps({"username": username, "content": message}).encode()
    req = urllib.request.Request(wh, data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "DiscordBot (ai, 1)"},
        method="POST")
    try:
        urllib.request.urlopen(req)
        return True
    except Exception as e:
        print(f"Discord 發送失敗: {e}")
        return False


def claim_task(issue_num, ai_name, ai_emoji):
    """認領任務"""
    h = {**GH_H}
    # 加標籤
    labels_req = urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/issues/{issue_num}/labels",
        data=json.dumps({"labels": ["進行中", ai_name]}).encode(), headers=h, method="POST")
    try:
        urllib.request.urlopen(labels_req)
    except: pass
    # 移除「任務」標籤
    try:
        urllib.request.urlopen(urllib.request.Request(
            f"https://api.github.com/repos/{REPO}/issues/{issue_num}/labels/%E4%BB%BB%E5%8B%99",
            headers=h, method="DELETE"))
    except: pass
    # 留 comment
    comment = json.dumps({"body": f"{ai_emoji} **{ai_name}** 認領！\n時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"}).encode()
    urllib.request.urlopen(urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/issues/{issue_num}/comments",
        data=comment, headers=h, method="POST"))
    # Discord 通知
    send_discord("chat", f"{ai_emoji} **{ai_name}** 認領了任務 **#{issue_num}**！", ai_name)
    print(f"✅ 認領 #{issue_num}")


def complete_task(issue_num, ai_name, ai_emoji, description=""):
    """完成任務，通報審核"""
    h = {**GH_H}
    # 加「審核中」標籤
    urllib.request.urlopen(urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/issues/{issue_num}/labels",
        data=json.dumps({"labels": ["審核中"]}).encode(), headers=h, method="POST"))
    # 移除「進行中」標籤
    try:
        urllib.request.urlopen(urllib.request.Request(
            f"https://api.github.com/repos/{REPO}/issues/{issue_num}/labels/%E9%80%B2%E8%A1%8C%E4%B8%AD",
            headers=h, method="DELETE"))
    except: pass
    # 留 comment
    body = f"{ai_emoji} **{ai_name}** 完成！\n{description}\n等待 🦀 AI二號審核\n時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    urllib.request.urlopen(urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/issues/{issue_num}/comments",
        data=json.dumps({"body": body}).encode(), headers=h, method="POST"))
    # Discord 審核通報
    msg = f"{ai_emoji} **{ai_name}** 完成任務 **#{issue_num}**！\n{description}\n⏳ 等待 🦀 AI二號審核"
    send_discord("review", msg, ai_name)
    send_discord("chat", f"✅ {ai_emoji} **{ai_name}** 完成了 **#{issue_num}**！", ai_name)
    print(f"✅ 完成通報 #{issue_num}")


def chat(message, ai_name, ai_emoji):
    """喺 Discord 聊天室發訊息"""
    send_discord("chat", f"{ai_emoji} {message}", ai_name)


# ── 示範用法 ──
if __name__ == "__main__":
    print("=== 讀取任務列表 ===")
    data = get_tasks()
    print(f"待接：{data['stats']['open_count']} 個")
    for t in data["open"][:5]:
        pri = {"優先：高": "🔴", "優先：中": "🟡", "優先：低": "🟢"}.get(t["priority"], "⚪")
        print(f"  {pri} #{t['id']} {t['title']}")

    print("\n=== 使用方法 ===")
    print("from ai_collab import claim_task, complete_task, chat, get_tasks")
    print("claim_task(280, 'AI一號', '🤖')   # 認領任務")
    print("complete_task(280, 'AI一號', '🤖', '加入了AI狀態動畫')  # 完成通報")
    print("chat('大家好！', 'AI三號', '🧠')  # 聊天")
