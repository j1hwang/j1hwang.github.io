---
date: 2026-05-11
tags:
  - AI
  - n8n
  - ActionCable
  - RubyOnRails
  - LLM
  - Agent
description:
---
## 기존 방식의 문제

클라이언트에서 ActionCable 채널로 메시지를 보내면, 채널 액션 안에서 AI Agent API를 동기로 호출하고 응답을 기다린 뒤 broadcast하는 구조였다.

  ```ruby
  def send_message(data)
    result = AiAgent.call(data['prompt'])  # 최대 2분 블로킹
    ActionCable.server.broadcast("channel_#{current_user.id}", result)
  end
  ```

AI Agent 응답이 최대 2분까지 걸릴 수 있는데, ActionCable 채널 액션은 Puma 스레드에서 실행된다. 즉, 응답을 기다리는 동안 스레드가 점유된다. Puma 스레드풀은 보통 10개 내외 수준이라, 동시 요청이 몇 개만 들어와도 스레드풀이 고갈되어 **전체 서비스가 응답 불가** 상태가 된다.

## 개선 방향

채널 액션에서는 Event publish 또는 Background(BG) job 을 enqueue만 하고 즉시 반환하고, AI Agent 호출은 백그라운드의 워커가 전담한다. 응답이 준비되면 다시 이벤트를 발행해 채널에서 broadcast한다.

#### 개선 전

```mermaid
  sequenceDiagram
      participant Client
      participant WebServer as Web Server (ActionCable)
      participant AiAgent as AI Agent

      Client->>WebServer: send_message
      WebServer->>AiAgent: API 호출 (블로킹)
      Note over WebServer: Puma 스레드 점유
      AiAgent-->>WebServer: 응답
      WebServer->>Client: broadcast
  ```

#### 개선 후

  ```mermaid
  sequenceDiagram
      participant Client
      participant WebServer as Web Server (ActionCable)
      participant BgWorker as BG Worker

      Client->>WebServer: send_message
      WebServer->>BgWorker: Event publish or Job enqueue
      WebServer-->>Client: AI Agent 호출 없이 반환
	  Note over WebServer: Puma 스레드 점유 안 함
      BgWorker->>BgWorker: AI Agent 호출 (블로킹)
      BgWorker->>Client: broadcast (결과 전달)
  ```

> [!info]
> Puma 스레드는 이벤트 발행 후 즉시 반환되므로 스레드풀 고갈 문제가 해소된다.