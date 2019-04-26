---
layout: post
title: "ConstraintLayout中使用paddingTop的兼容性问题"
category: other
---

### 背景

测试报了一个奇怪的bug，一个页面在分享到微信的时候，如果微信是未登录的，每次返回的时候上方多出一小段空白。

###  分析步骤

于是登出微信，果然可以复现。发现未登录微信时页面会弹出软键盘，返回的页面是没有软键盘的，推测这个时候调用了某个方法，导致了View的重新布局。

如果关闭软键盘再返回，不会出现这个多余空白。

但是看了一下其他ScrollView+ListView布局的分享页面并没有这个问题。应该是这个页面使用的ConstraintLayout布局的兼容问题。

```xml
    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <android.support.constraint.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:paddingTop="20dp"
            tools:context=".activity.XPremiumActivity">


            <ImageView
                android:id="@+id/iv1"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="6dp"
                android:paddingTop="@dimen/dp_10"
                android:src="@drawable/dot_premium_step_on"
                app:layout_constraintBottom_toTopOf="@+id/line1"
                app:layout_constraintEnd_toEndOf="@+id/iv4"
                app:layout_constraintStart_toStartOf="@+id/iv4"
                app:layout_constraintTop_toTopOf="parent" />
                
                .....
                
         </android.support.constraint.ConstraintLayout>
    </ScrollView>
```

布局文件中ConstraintLayout中有个android:paddingTop="20dp"，每次多出的空白正好和这个值差不多，于是把这个值改为5dp，果然每次多处的空白小了一些。

结论，每次多出的空白应该就是这个设置在ConstraintLayout中的paddingTop，应该是由软键盘页面返回时页面高度有变化，于是发生了重新测量，于是ConstraintLayout在onSizeChanged()或者onLayout()方法中多设置了一次paddingTop。。。

### 解决方案

可以在这个页面增加一个跳转到软键盘弹出页面来跑一下，或者在相关方法中打印log来验证想法。不清楚如果修改Activity的android:windowSoftInputMode，是否可以防止页面重新布局，如果可以，也可以解决这个问题，先mark一下。有时间在尝试。

我的解决方案比较简单粗暴，删除了ConstraintLayout的paddingTop，并把顶层子View的PaddingTop增加20dp，问题不在出现。

```xml
    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <android.support.constraint.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            tools:context=".activity.XPremiumActivity">


            <ImageView
                android:id="@+id/iv1"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="6dp"
                android:paddingTop="@dimen/dp_30"
                android:src="@drawable/dot_premium_step_on"
                app:layout_constraintBottom_toTopOf="@+id/line1"
                app:layout_constraintEnd_toEndOf="@+id/iv4"
                app:layout_constraintStart_toStartOf="@+id/iv4"
                app:layout_constraintTop_toTopOf="parent" />
                
                .....
                
         </android.support.constraint.ConstraintLayout>
    </ScrollView>
```



