---
slug: cs-ci-cd-pipeline
title: CI/CD 파이프라인
tags: [ cs ]
---

## ✔️ 지속적 통합 (Continuous Integration)
개발자가 작성한 작은 코드 변경을 코드 베이스에 통합합니다. 변경한 부분이 통합되면, <mark>**자동으로 새로운 시스템을 빌드하고 현재 시스템에 존재하는 모든 테스트를 실행**</mark>합니다. 만약 이전에 동작했던 어떤 부분이 망가졌다면, 개발자는 해당 부분을 다시 수정합니다. 이러한 일련의 과정을 포함하는 소프트웨어 개발 방식을 `지속적 통합(Continuous Integration)`이라고 합니다. `지속적 통합`의 핵심 목표는 소프트웨어의 품질을 개선하고, 새로운 소프트웨어의 변경 사항을 검증하는데 소요되는 시간을 단축 시키며, 버그를 조기에 발견하기 위함입니다.

## ✔️ 지속적 배포 (Continuous Deployment)
`지속적 통합 (Continuous Integration)`을 통해서 빌드된 코드(빌드 아티팩트)를 <mark>**프로덕션 환경에 자동으로 배포하는 것을 의미**</mark>합니다.

## ✔️ 지속적 전달(Continuous Delivery)
`지속적 전달(Continuous Delivery)`은 빌드 아티팩트를 <mark>**프로덕션 환경에 바로 배포하기 위해서 수동으로 작업**</mark>해야 한다는 점에서 `지속적 배포 (Continuous Deployment)`와 차이가 있습니다.

CD 과정에는 빌드 아티팩트를 관리 및 저장하는 공간이 필요할 수도 있습니다. 예를 들어, AWS S3, Docker Registry, Nexus를 사용할 수 있습니다.

## ✔️ CI/CD 파이프라인
일반적으로 위 방식들을 합쳐 `CI/CD 파이프라인`이라고 부르며, `CI/CD 파이프라인`을 구축하기 위한 도구로 `Jenkins`, `Travis CI`, `Github Action` 등이 존재합니다.