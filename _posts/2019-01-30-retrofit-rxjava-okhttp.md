---
layout: post
title: "Retrofit+RxJava+OkHttp的最佳实践"
category: net
---

## 一、背景
这个网络框架其实很久以前封装的了，使用的过程中也多次升级，改掉了原本设计中一些不合理的地方，在此总结一下。

虽然只是二次封装，其实要注意的细节还是蛮多的，在易用性与扩展性方面的平衡上也有很多地方需要去权衡。

项目中本来封装了Volley作为网络请求框架，但是一些应用场景下有局限性，随着retrofit+rxjava+okhttp逐渐成为主流，我们也决定及时更新项目中的技术方案，两者大致对比如下：

|     | Okhttp | Volley |
| ---- | ------ | ------ |
|    是否支持Https  | 同时支持http和https | 只支持Http请求 |
| 性能 | 非常高效，利用连接池减少请求延迟，可以重用socket连接 | 性能一般，不在更新 |
| 缓存 | 支持 | 支持 |
|使用场景|专注于连接效率的 HTTP 客户端，封装较麻烦，推荐结合Retrofit使用|特别适合数据量小，通信频繁的网络操作。|

## 二、约定数据结构

首先需要和服务端约定好数据结构，这样我们的封装才能做更多的事情，否则的话就只能拿到服务端返回的数据，不能对一些服务端的错误进行统一的处理了。

请求成功示例：
```json
{
  "status": "ok",
  "message": "",
  "data": {
    "text": "新增成功"
  }
}
请求成功，业务使用的数据封装在data内
```
请求失败示例：

```json
{
  "status": "error",
  "errcode": "102",
  "message": "check fail"
}
网络请求失败时，errcode为后端的错误码，message为向用户展示的错误的提示
```

## 三、接口调用方式

- 定义一个接口![屏幕快照 2018-05-07 下午2.56.08](https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/屏幕快照%202018-05-07%20下午2.56.08.png)
- 业务调用![屏幕快照 2018-05-07 下午2.46.22](https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/屏幕快照%202018-05-07%20下午2.46.22.png)

## 四、框架整体结构

基本方向是，发挥出Retrofit与Rxjava的优点，让项目中的接口调用更加简洁可靠。

基本思路是，拿到数据后，我们可以对请求返回的最外层数据，统一进行异常的处理和非空的判断，页面状态的判断，这样就不用在每个接口去做一堆重复的操作了。

![屏幕快照 2018-05-08 下午12.25.39](https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/屏幕快照%202018-05-08%20下午12.25.39.png)项目中的progressBar是封装在BaseActivity中的，而且有多种形式，这里没有做封装。如果加入进来也很方便。

## 五、代码细节

#### 添加header与公共参数

这里用到了ThreadLocal，在拦截器中通过ThreadLocal来保存不同请求的header参数	

#### 线程调度

通过NetTransformers包装了RxJava的相关功能

#### 数据解析

使用FastJsonConverterFactory

#### 异常处理

在处理数据流的过程中抛出自定义异常，最后在Rxjava的onErrorResumeNext()方法中统一转换为标准格式异常，然后抛出在onError方法中处理。

#### 接口回调的取消


## 六、一些非标准格式的请求处理

非标准格式数据，同步请求，非Rxjava处理请求使用RetrofitFactory，其它使用HttpProvider

## 七、遇到的一些坑

1. 一开始没有brokerIntercepter中没有使用TheadLocal，导致同时掉用两个接口的时候，其中一个接口有几率失败
2. 升级Rxjava2的时候，重新封装了一套新的调用方式，对老的调用方式进行了兼容
3. 一开始对Retrofit生成的接口service没有进行复用，后来通过HashMap实现了接口生成类的复用
4. 整个项目需要共用一个OkhttpClient实体，否则有可能导致内存溢出
5. 代码中没有什么例外，一切有因必有果。必然是有所连接，才会得出我们的结果，连接的各种方式就是设计模式。