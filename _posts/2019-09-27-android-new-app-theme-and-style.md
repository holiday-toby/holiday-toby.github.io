---
layout: post
title: "新APP打造之主题与样式配置"
category: other
---

### 主题配置(Theme)

[总结一下Android中主题(Theme)的正确玩法](https://www.cnblogs.com/zhouyou96/p/5323138.html)

主题的来源有三个：

1) 来自Android系统自带的

2) 来自兼容包的(比如v7兼容包)

3) 你自己写一个主题



使用android系统中自带的主题要加上“android:”，如：android:Theme.Black
使用v7兼容包中的主题不需要前缀，直接：Theme.AppCompat

解决办法是不要写“android:Theme.Black”，而是写“@android:style/Theme.Black”这样就会有提示
不要写“Theme.AppCompat”，而是写“@style/Theme.AppCompat”

因为 style(@android:style/Theme.Black) 与 theme(android:Theme.Black) 在使命上还是有区别的，所以在eclipse中书写时为了出现自动提示，可以写“@android:style/Theme.Black”，但是写完了之后，记得手动的改为“android:Theme.Black”

```
系统自带主题：
API 1:
android:Theme 根主题
android:Theme.Black 背景黑色
android:Theme.Light 背景白色
android:Theme.Wallpaper 以桌面墙纸为背景
android:Theme.Translucent 透明背景
android:Theme.Panel 平板风格
android:Theme.Dialog 对话框风格

API 11:
android:Theme.Holo Holo根主题
android:Theme.Holo.Black Holo黑主题
android:Theme.Holo.Light Holo白主题

API 14:
Theme.DeviceDefault 设备默认根主题
Theme.DeviceDefault.Black 设备默认黑主题
Theme.DeviceDefault.Light 设备默认白主题

API 21: (网上常说的 Android Material Design 就是要用这种主题)
Theme.Material Material根主题
Theme.Material.Light Material白主题


兼容包v7中带的主题：
Theme.AppCompat 兼容主题的根主题
Theme.AppCompat.Black 兼容主题的黑色主题
Theme.AppCompat.Light 兼容主题的白色主题
```

### 控件样式(style)



### 标题栏



### 白天夜间模式