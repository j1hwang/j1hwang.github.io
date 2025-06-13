---
title: 코드 배포에 대한 노트 (Capistrano)
date: 2025-06-06 15:57:00 +0900
categories: [develop, devops]
tags: [explain, deploy, capistrano]
description: 배포에 사용되는 파일들과 배포 단계 살펴보기
---

지난 번 작성한 [코드 배포에 대한 노트 (Jenkins)](https://j1hwang.github.io/posts/%EC%BD%94%EB%93%9C-%EB%B0%B0%ED%8F%AC%EC%97%90-%EB%8C%80%ED%95%9C-%EB%85%B8%ED%8A%B8-(Jenkins)/)에 이어서, 이번에는 Capistrano Ruby gem 을 통한 배포가 어떤 단계로 이뤄지는지 살펴보겠습니다.

## 배포 관련 코드 위치

우리 회사 코드에서 배포 관련 코드는 크게 3곳에 나뉘어져 있는데요. 프로젝트의 파일 구조에서 살펴본 코드 위치는 아래와 같습니다:
1. lib/capistrano/tasks 폴더
2. config/deploy 폴더
3. config/deploy.rb

----------

## 코드별 간단한 설명

### 1. lib/capistrano/tasks 폴더

- 하위 폴더 `templates`
  - 배포를 수행하는 `cap` 파일에서 활용하는 `erb` 템플릿 파일들이 있습니다.
- `app.cap`
  - Rails 어플리케이션 배포가 잘 됐는지를 확인합니다. 이 코드를 좀 간소화하여 살펴보면 아래와 같습니다.

```ruby
namespace :app do
  task :check_init do
    ...
          execute :ruby, '-r./config/environment', '-e', "''"
    ...
  end
  after 'deploy:finished', 'app:check_init'
end
```

아래쪽 코드를 보면, `deploy:finished` 이후에 이 코드에서 선언한 `app:check_init` 를 실행합니다. Rails 어플리케이션 코드에서 버그가 있는 경우, `execute :ruby` 에서 오류가 발생하고 `cap` 배포는 실패하게 됩니다. 이는 코드 배포는 완료됐는데 Rails 단에서 오류가 나서 실제 서비스가 down 되는 상황을 막기 위함이라 볼 수 있습니다. `cap` 배포 단계에서 실패하면, 기존에 배포돼서 실행되고 있던 어플리케이션에는 영향이 없기 때문입니다.

아무튼, Jenkins 에서의 Console Output 을 살펴보면 아래와 같이 `deploy:finished` 이후 `app:check_init` 가 실행된 것을 확인할 수 있습니다. 이전 글에서 말씀드린대로, `cap` 명령어 실행 시 `--trace` 가 붙어서 실행되는 staging 배포 Jenkins 에서 확인해야 합니다.

```bash
# Jenkins Console Output 일부
** Invoke deploy:finished (first_time)
** Execute deploy:finished
...
** Invoke app:check_init (first_time)
** Execute app:check_init
00:35 app:check_init
```

[Capistrano Deploy flow 링크](https://capistranorb.com/documentation/getting-started/flow/#:~:text=deploy:starting%20deploy:started%20deploy:reverting%20%2D%20revert%20server(s)%20to,finish%20the%20rollback%2C%20clean%20up%20everything%20deploy:finished.) 남깁니다. 아래와 같이 `deploy:finished` deploy flow 다음 원하는 코드가 실행되도록 [Before/After Hooks](https://capistranorb.com/documentation/getting-started/before-after/) 을 사용할 수 있습니다.

```ruby
after 'deploy:finished', 'app:check_init'
```

### 2. config/deploy 폴더

- `deploy_core.rb`
  - 배포 템플릿에서 사용되는 변수 설정 등 (예: `set :user, 'ubuntu'`)
  - `after 'deploy:publishing', 'deploy:restart'` 와 같은 `cap` 코드도 혼재돼있음
  - `deploy_helper.rb`: 템플릿 파일 경로 지정 및 `deploy(_core).rb` 에서 쓰이는 helper method 정의
- `production.rb`, `staging.rb`
  - 배포 환경별로 다른 변수 설정을 합니다.
    - `set :rails_env, 'production'`
    - `set :rails_env, 'staging'`

### 3. config/deploy.rb

```ruby
require_relative 'deploy/deploy_core'
```
공통으로 사용되는 `deploy_core.rb` 코드와 더불어, 해당 프로젝트에서만 사용할 변수 설정 등의 코드가 있습니다.


## 마무리

`cap` 코드가 한 곳에 있지 않고 lib/capistrano/tasks 폴더와 deploy_core.rb 에, 템플릿 변수 `set` 하는 코드도 여러 곳에 퍼져있어서 배포 코드를 볼 때마다 여러 파일을 오가야 하는 불편한 점이 있습니다. 그래서 현재 구조가 좋은지는 잘 모르겠는데요. 추후 개선의 여지가 있다고 봅니다. 일단, 이번 포스팅에서는 배포에 사용되는 파일들과 배포 단계를 간단히 살펴봤습니다.