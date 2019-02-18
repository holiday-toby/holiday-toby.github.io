---
layout: post
title: "Retrofit+RxJava+OkHttp的最佳实践"
category: net
---

### 背景
这个网络框架升级很久了，使用的过程中升级了几次，改掉了一些原本设计中不合理的地方。虽然只是二次封装，要注意的细节还是蛮多的。

项目中本来封装了Volley作为网络请求框架，但是一些应用场景下不适用，使用不够灵活，公司的app也打算升级到https了。
随着retrofit+rxjava+okhttp逐渐成为主流，我们也决定升级一下,两者大致对比如下：

|     | Volley | Okhttp |
| ---- | ------ | ------ |
|    是否支持Https  | 否 | 是 |
|是否支持Https|--|--|


