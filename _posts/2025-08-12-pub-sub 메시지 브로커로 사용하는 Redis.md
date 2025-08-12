---
title: pub-sub 메시지 브로커로 사용하는 Redis
date: 2025-08-12 19:14:18 +0900
categories: [develop, devops]
tags: [explain, redis, monorepo]
description: 다양한 프로젝트에서 Redis 를 통해 로그 남기기
---

'Redis' 는 메모리 기반 캐시/데이터 저장소로서 key-value 데이터 구조를 갖고 있다. 우리 회사에서는 이를 데이터 저장 목적이 아닌 pub-sub 메시지 브로커로서 활용하고 있기에 잠시 구조를 살펴보고 기록을 남긴다.

옆자리 동료가 redis log 에 대한 질문을 해서 코드를 좀 뒤져봤다. redis log 라고 해서 redis 저장소에 로그를 남기는 것은 아니고, 위에 적은 것처럼 (monorepo 내의) 다양한 프로젝트에서의 로그를 한 곳에 모아두기 위한 용도로 활용하고 있다.

## Redis 를 맞게 쓰는 것인가?

key-value 저장소 대신 이렇게 쓰는게 맞긴 한 걸까? 나의 조수 gpt 에게 물어보았다.

> Redis를 로그에 쓰는 방법 중에서도 꽤 흔하고, 적절한 패턴입니다.

- 실시간 전달
  - Redis Pub/Sub는 지연이 거의 없어서 여러 서비스에서 동시에 로그를 보내고, 구독자가 바로 받아서 처리할 수 있습니다.
- 구조 단순
  - 브로커 서버 따로 두지 않아도 Redis 하나로 간단히 구현 가능
- 다중 구독
  - 한 로그 스트림을 모니터링 시스템, 알람 시스템, 영구 저장 시스템이 동시에 구독 가능

위와 같은 답변을 들었다.

현재 구조에서는 Pub/Sub 자체에서는 메시지 저장을 하지 않기 때문에 로그의 유실이 생길 때 이를 복구하긴 사실 어렵다. 이전에 로그를 한창 많이 뒤질 때, 특별히 로그의 유실이 있다고 느낀 적이 업긴 하지만..

Redis 5 부터 지원하는 Streams 에서는 Pub/Sub와 달리 메시지를 저장하고, 나중에 컨슈머가 읽을 수 있다고 한다. Kafka 와 같은 동작을 하는 것으로 이해하고 넘어갔다.

## 로그는 어떤 단계를 거쳐 저장되는가?

거대 단일 저장소(monorepo)를 사용하는 우리 회사에서는 여러 서버들에 배포된 다양한 프로젝트에서의 로그를 한 곳에 저장한다. 이 로그는 각 서버에 별도로 저장되는 로그와는 다른 용도로 주로 서비스 동작에 대한 기록(DB 저장까지는 필요없는 경우)이다.

> 다수의 프로젝트들 -> logger 프로젝트(서버) -> s3 백업
{: .prompt-tip }

이와 같은 구조를 가진다.

#### 다수의 프로젝트들 - Publish

```ruby
# 간소화된 코드
# config/initializers/redis_log.rb
$redis_logger = RedisLog.publisher('logger')

# 로그 남기는 코드
$redis_logger.info(메시지)
```

위와 같이 로그를 전달하고자 하는 다수 프로젝트들에서는 어플리케이션 초기화 시, publisher 인 `$redis_logger` 를 선언해두고 필요한 곳에서 이를 호출하여 로그를 남긴다.

#### logger 프로젝트(서버) - Subscriber

```ruby
# 간소화된 코드
# bin/logger
Daemons.run_proc('logger', log_dir: "#{Dir.getwd}/log") do
  RedisLog.subscribe(channel: 'logger')
end
```

위와 같이 로그를 전달받아 저장하는 프로젝트에서는 서버 배포 단계에서 프로세스를 띄워 로그 이벤트를 subscribe 하게 된다.

## 로그가 어느 위치에 저장되는가?

바로 위에 첨부한 코드를 보면 `log_dir` 을 선언해준다. `Dir.getwd` 는 현재 작업 디렉토리(Current Working Directory)다. 결국, logger 프로젝트(crema-logger-rails)가 배포된 하위 디렉토리 `/log` 에 파일이 저장된다.

logger 프로젝트가 실제 어디 서버에 배포되는지는 config/deploy/production.rb 에 아래와 같이 선언돼있으니 저 서버에 접속해보면 된다.

```ruby
role :app, %w[app1 app2]
```

## 결론

위 내용을 통해, 우리 회사에서 pub-sub 메시지 브로커로 사용하는 Redis 에 대해 알아봤다. 간략하게 적는다고 적었는데 핵심만 전달하는 건 역시 쉽지 않은 것 같다.