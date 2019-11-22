---
layout: post
title: "android support包与androidx不能共存的问题"
category: other
---

AndroidX 是 Android 团队用于在 [Jetpack](https://developer.android.google.cn/jetpack?hl=zh_cn) 中开发、测试、打包和发布库以及对其进行版本控制的开源项目。

如果要在新项目中使用 AndroidX，则需要将编译 SDK 设置为 Android 9.0（API 级别 28）或更高版本。

Google为了整合之前混乱的support包命令管理，推出了android，并提供了自动迁移方案。
[官方文档](https://developer.android.google.cn/jetpack/androidx/migrate?hl=zh_cn)

1. 为方便自动迁移，建议迁移之前，**将build tools更新到3.2.0，gradle更新到4.6，依赖库统一更新到28.0.0**
2. 自动迁移项目
>借助 Android Studio 3.2 及更高版本，您可以通过从菜单栏中依次选择 Refactor > Migrate to >AndroidX，快速迁移现有项目以使用 AndroidX。
3. 配置依赖项自动迁移，将 [`gradle.properties` 文件](https://developer.android.google.cn/studio/build/?hl=zh_cn#properties-files)中将以下两个标记设置为 `true` 
```
android.useAndroidX=true
android.enableJetifier=true
```

