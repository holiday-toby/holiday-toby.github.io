---
layout: post
title: "Android开发中的GreenDao用法及注意点"
category: other
---

### 背景知识

GreenDao，一个将对象映射到SQLite数据库中的轻量且快速的ORM解决方案。[github地址](https://github.com/greenrobot/greenDAO)

SQLite是一个小巧的关系型数据库，用C语言写的，整个代码只有1万多行。通过对各种数据结构的使用，使得存储到文件中的信息有了索引，非常便于使用与查找。

由于小巧性能稳定等众多的优点，Android与IOS系统中都内置了SQLite，作为默认的本地数据处理引擎。

然而在使用它时，我们往往需要做许多额外的工作，像编写 SQL 语句与解析查询结果等。所以，适用于 Android 的ORM 框架也就孕育而生了。现在市面上主流的框架有OrmLite、SugarORM、Active Android、Realm 与 GreenDAO。

### GREENDAO 设计的主要目标

- 一个精简的库
- 性能最大化
- 内存开销最小化
- 易于使用的 APIs
- 对 Android 进行高度优化

### 使用说明

greenDAO已经上传到mavenCentral，使用前需要添加 [greendao](https://search.maven.org/search?q=g:org.greenrobot AND a:greendao)以及[greendao-gradle-plugin](https://search.maven.org/search?q=g:org.greenrobot AND a:greendao-gradle-plugin)的依赖。

- 首先是在 Android peoject添加依赖。In you root **build.gradle** file:

```groovy
buildscript {
    repositories {
        jcenter()
        mavenCentral() // add repository
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.1'
        classpath 'org.greenrobot:greendao-gradle-plugin:3.2.2' // add plugin
    }
}
```

In your app modules `app/build.gradle` file:

```groovy
apply plugin: 'com.android.application'
apply plugin: 'org.greenrobot.greendao' // apply plugin
 
dependencies {
    implementation 'org.greenrobot:greendao:3.2.2' // add library
}
```

这样，这样就把greenDAO Gradle plugin hook到你的构建进程中，在构建工程的过程中，就会自动生成DaoMaster, DaoSession and DAOs这些类。

- 配置GreenDao参数

```groovy
android {
    ....
    greendao {
        schemaVersion 5
        daoPackage 'com.ldh.sample.greendao'
     	  targetGenDir 'src/main/java'
    }
}
```
- 配置混淆
```
### greenDAO 3
-keepclassmembers class * extends org.greenrobot.greendao.AbstractDao {
public static java.lang.String TABLENAME;
}
-keep class **$Properties

# If you do not use SQLCipher:
-dontwarn org.greenrobot.greendao.database.**
# If you do not use RxJava:
-dontwarn rx.**

```
- 通过注解使用GreenDao

- 数据库的加密与升级
可以参考[GreenDao3使用说明，包括加密与升级](https://www.jianshu.com/p/4e6d72e7f57a)

### 遇到的一些坑

1. 回调处理
2. 缓存问题
3. 数据库升级