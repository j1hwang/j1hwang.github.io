---
title: Amazon Bedrock 프롬프트 캐싱
date: 2025-07-01 17:59:00 +0900
categories: [data, aws]
tags: [aws, bedrock, llm, text2sql]
description: 더 빠르고, 더 싸게 LLM 활용하기
---

LLM 활용이 보편화되며 API 사용 비용이 초기 단계에 비해 많이 저렴해졌지만, 회사 서비스에서 대량의 요청을 처리하기 위해서는 API 요청 시 들어가는 토큰 비용을 필수적으로 줄여야 한다. 이를 위한 해결책 중 하나로 2024년 이후부터 'Prompt Caching' 이라는 이름으로 프롬프트 캐싱 기술이 등장했다.

ChatGPT 에게 물어보니 아래와 같단다.

> 특히 AWS Bedrock, OpenAI API (cachePoint, ephemeral, etc.) 등에서 기능을 API로 지원하면서 실제 도입과 표준화가 진행 중입니다.

현재 테스트 중인 Text2SQL 기능에서는 LLM 에 database schema 를 전달하는 일이 많기 때문에 이 캐싱의 효과를 톡톡히 보고 있다. 아마존 공식 문서, [더 빠른 모델 추론을 위한 프롬프트 캐싱](https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/prompt-caching.html)을 보면 아래와 같이 프롬프트 캐싱을 설정할 수 있다.

```python
# invoke_model 과 converse API 에서 각각 다른 방법을 택함
# 아래 코드는 invoke_model API 호출 시 `body` 의 일부
{
    "type": "text",
    "text": "Add additional context here for the prompt that meets the minimum token requirement for your chosen model.",
    "cache_control": {
        "type": "ephemeral"
    }
}
```

`ephemeral`, 즉 일시적인 프롬프트 캐싱으로, Bedrock이 자동으로 프롬프트 결과를 임시 저장하여, 캐시된 응답을 처리 및 반환한다.

추가 설명은 또 ChatGPT 의 도움을 받았다. 매번 신세 많이 진다.

- 캐시된 응답은 Bedrock 내부에서만 일시적으로 유지되며, 일정 시간 이후 자동으로 삭제됩니다.
- 사용자가 직접 만료 시간(Time To Live, TTL)을 설정할 수는 없습니다.

아무튼, 제일 중요한 결론 다시 적는다.

> 캐싱 활용을 위해서 marking 되는 프롬프트는 정확히 동일해야 한다.
{: .prompt-tip }

> 완벽히 동일하지 않은 프롬프트 캐싱을 위해서는 Semantic Caching 사용해야 한다.
{: .prompt-tip }
