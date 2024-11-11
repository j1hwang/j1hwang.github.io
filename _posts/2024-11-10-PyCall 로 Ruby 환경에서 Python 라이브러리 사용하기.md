---
title: PyCall 로 Ruby 환경에서 Python 라이브러리 사용
date: 2024-11-10 16:04:00 +0900
categories: [develop, products]
tags: [ruby, python, nlp]
description: numpy, konlpy 등 Python 라이브러리를 Ruby 코드에서 호출
---

### `PyCall` 이란?

회사에서는 거의 대부분 Ruby On Rails(이하 ROR, 레일즈) 기반 프로젝트를 다루다보니, 사용 가능한 라이브러리가 레일즈 gem 에 한정되는데 PyCall 을 사용하면 Ruby(이하 루비) 코드에서 Python 라이브러리를 사용할 수 있다. Pycall 라이브러리의 설명은 아래와 같다. 간단히 파이썬 코드의 ruby wrapper 라고 보면 된다.

> This library provides the features to directly call and partially interoperate with Python from the Ruby language. You can import arbitrary Python modules into Ruby modules, call Python functions with automatic type conversion from Ruby to Python.

루비는 아무래도 파이썬에 비해 인기가 떨어지는 언어다보니 라이브러리 선택의 폭이 상대적으로 좁다. 파이썬 라이브러리와 동일(혹은, 유사)한 동작을 제공하는 루비 gem 들이 있지만, 성에 차지 않는 경우가 있다. 오래 전, 한글 형태소 분석 처리할 일이 있어서 [KoNLPy](https://konlpy.org/ko/latest/)를 사용했는데 그 때 PyCall 을 사용했다. `konlpy` 말고도 `pytagcloud` 사용해서 [태그 클라우드](https://ko.wikipedia.org/wiki/%ED%83%9C%EA%B7%B8_%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C) 만들 때도 유용하게 썼다.

### 사용 예시

```bash
$ gem install --pre pycall
$ pip install konlpy
```

`pycall` gem 과 `konlpy` 를 설치해주고, 루비 코드에서 아래와 같이 호출할 수 있다.

```ruby
PyCall.import_module('konlpy.tag').Mecab.new.pos "한글 형태소 분석을 해봅시다."

=> [('한글', 'NNG'), ('형태소', 'NNG'), ('분석', 'NNG'), ('을', 'JKO'), ('해', 'VV+EC'), ('봅시다', 'VX+EF'), ('.', 'SF')]
```

### 참고
- [https://github.com/mrkn/pycall.rb](https://github.com/mrkn/pycall.rb)
