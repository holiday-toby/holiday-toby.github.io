---
layout: default
title: "Android开发依赖冲突解决方案，一个so文件被导入了两次"
category: bug
---
### 问题描述： 

> Error:Execution failed for task ':newbroker:transformNativeLibsWithMergeJniLibsForDebug'.
> More than one file was found with OS independent path 'lib/armeabi/libengine.so'

在引入一个依赖的时候，如果报了这种错误，一般是两个library都使用了同一个.so文件，解决方案有两个
1. 找到对应的依赖，其中exclude掉对应的冲突文件
```
compile ('cn.qqtheme.framework:WheelPicker:1.5.1'){
        exclude group:'com.android.support'
    }
```
2. 在module 的build文件的android中修改
```
android {
    compileSdkVersion 26
    buildToolsVersion "26.0.2"



    packagingOptions {//加上这些，pickFirst，选择优先导入的
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE.txt'
        exclude 'META-INF/rxjava.properties'
        pickFirst 'lib/armeabi/libwffmpeg.so'
        pickFirst 'lib/armeabi-v7a/libwffmpeg.so'
        pickFirst 'lib/armeabi-v8a/libwffmpeg.so'
        pickFirst 'lib/armeabi/libengine.so'
        pickFirst 'lib/armeabi-v7a/libengine.so'
        pickFirst 'lib/armeabi-v8a/libengine.so'
    }
}
```
    //If you have a library that's adding some android .so files –like libassmidi.so or libgnustl_shared.
    so– you have to tell gradle to pick just one when packaging, otherwise you'll get the conflict.

    也可以这样：
```
    packagingOptions{
        exclude 'META-INF/*'   //排除这些文件
        pickFirst 'lib/*/libengine.so'
        pickFirst 'lib/*/libwffmpeg.so'
    }    
```
