---
layout: post
title: "singleTask放在APP首页的按HOME键重新打开问题"
category: other
---

### 现象

RN团队那边反馈了一个问题，每一次他们从聊天列表页进入到聊天详情页后，按home键返回桌面，然后再点app图标进入，就回到了列表页，详情页走了onDestory()方法。

之前我们的APP遇到了每次home键返回再进入都重新打开SplashActivity的问题，猜测是同一个问题。

排查下来，发现这个MainActivity的确是App的启动Activity，于是在每次点击icon的时候都会重新启动，加之设置了singleTask属性，于是自动清除了上层的其他页面，其他页面就走了onDestory()方法。

```xml
 <intent-filter>
      <action android:name="android.intent.action.MAIN" />

      <category android:name="android.intent.category.LAUNCHER" />
 </intent-filter>
```



删除这个singleTask属性，就可以正常回到详情页了。

不过疑问在于，为什么标准启动模式的MainActivity，再次点击icon启动的时候就可以回到整个Activity任务栈的最上层？不是应该会新建一个MainActivity才对吗？

### 知识点

时间过去太久了，现场已经丢失了。留作将来学习中的一个疑问。

