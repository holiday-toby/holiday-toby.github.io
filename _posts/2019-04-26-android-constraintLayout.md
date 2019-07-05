---
layout: post
title: "ConstraintLayout中使用paddingTop的兼容性问题"
category: other
---

### 问题一

测试报了一个奇怪的bug，一个页面在分享到微信的时候，如果微信是未登录的，每次返回的时候上方多出一小段空白。

####  分析步骤

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

#### 解决方案

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
### 问题二

遇到了一个新的坑，在**RecyclerView**的列表中的item使用ConstraintLayout作为根布局，当item的顶部的标题由一行变为多行展示的时候，导致底部的两行View挤到了一起。。

#### 分析步骤

看起来是ConstraintLayout在复用的时候没有很好的测量高度导致的，网上找到了一个类似的问题以及解决方案:

添加一个FrameLayout作为根布局～～～

[Android：解决 RecyclerView 的 item 复用引起的布局错乱问题](https://lishide.github.io/2018/05/30/Android-fix-rv-item-view-overlap/)

但是这个方案没有解决我的问题～～～

再次观察了一下，可以在布局预览的时候复现，准确地说，顶部的标题在展示一行半，特定字数的时候就会出现这个问题，多一个字就是好的，少一个字就是坏的，标题在一行到一行半之前才会出现这个离奇的问题。

![屏幕快照 2019-06-14 上午11.39.29](/images/屏幕快照 2019-06-14 上午11.39.29.png)

![屏幕快照 2019-06-14 上午11.39.39](/images/屏幕快照 2019-06-14 上午11.39.39.png)

以下为有问题的原布局。

```xml
<?xml version="1.0" encoding="utf-8"?>

<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <android.support.constraint.ConstraintLayout
        android:id="@+id/item_for_bind_video"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@drawable/bg_normal_white_and_pressed_gray">

        <ImageView
            android:id="@+id/iv_video_cover"
            android:layout_width="108dp"
            android:layout_height="78dp"
            android:layout_marginStart="@dimen/dp_15"
            android:layout_marginTop="@dimen/dp_15"
            android:scaleType="centerCrop"
            android:src="@drawable/yqdk_kfjlxz_image_samplepic"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <ImageView
            android:id="@+id/iv_video_play"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:src="@drawable/fx_icon_bf"
            app:layout_constraintBottom_toBottomOf="@+id/iv_video_cover"
            app:layout_constraintLeft_toLeftOf="@+id/iv_video_cover"
            app:layout_constraintRight_toRightOf="@+id/iv_video_cover"
            app:layout_constraintTop_toTopOf="@+id/iv_video_cover" />

        <TextView
            android:id="@+id/tv_video_duration"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="@dimen/dp_4"
            android:layout_marginBottom="@dimen/dp_4"
            android:background="@drawable/bg_video_duration"
            android:textColor="@color/brokerWhiteColor"
            app:layout_constraintBottom_toBottomOf="@+id/iv_video_cover"
            app:layout_constraintStart_toStartOf="@id/iv_video_cover"
            tools:text="00:03:20" />

        <TextView
            android:id="@+id/tv_title"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="@dimen/dp_15"
            android:layout_marginTop="11dp"
            android:layout_marginEnd="15dp"
            android:ellipsize="end"
            android:maxLines="2"
            android:textColor="#FF000000"
            android:textSize="15sp"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/iv_video_cover"
            app:layout_constraintTop_toTopOf="parent"
            tools:text="顶部的标题在展示一行半，特定字数的时候就会现个问题坏的" />

        <TextView
            android:id="@+id/tv_description"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="@dimen/dp_15"
            android:layout_marginTop="@dimen/dp_4"
            android:textColor="#FF666666"
            android:textSize="13sp"
            app:layout_constraintStart_toEndOf="@id/iv_video_cover"
            app:layout_constraintTop_toBottomOf="@id/tv_title"
            tools:text="东南西北" />

        <TextView
            android:id="@+id/tv_id"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="@dimen/dp_10"
            android:layout_marginTop="@dimen/dp_4"
            android:textColor="#FF666666"
            android:textSize="13sp"
            app:layout_constraintStart_toEndOf="@id/tv_description"
            app:layout_constraintTop_toBottomOf="@id/tv_title"
            tools:text="ID: 6793" />

        <TextView
            android:id="@+id/tv_remain_days"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="@dimen/dp_15"
            android:layout_marginTop="@dimen/dp_4"
            android:textColor="#FF999999"
            android:textSize="13sp"
            app:layout_constraintStart_toEndOf="@id/iv_video_cover"
            app:layout_constraintTop_toBottomOf="@id/tv_description"
            tools:text="剩余展示天数：89天" />

        <TextView
            android:id="@+id/tv_remain_number"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="@dimen/dp_15"
            android:layout_marginTop="@dimen/dp_4"
            android:layout_marginBottom="@dimen/dp_15"
            android:textColor="#FF999999"
            android:textSize="13sp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toEndOf="@id/iv_video_cover"
            app:layout_constraintTop_toBottomOf="@id/tv_remain_days"
            tools:text="剩余绑定次数：14次" />

        <CheckBox
            android:id="@+id/cb_video_checked"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginRight="@dimen/dp_15"
            android:button="@drawable/cb_broker"
            android:clickable="false"
            android:focusable="false"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintTop_toTopOf="parent" />


    </android.support.constraint.ConstraintLayout>
</FrameLayout>

```

#### 解决方案

后来删除了底部View的app:layout_constraintBottom_toBottomOf="parent"属性，采取ConstraintLayout的paddingBottom属性解决了这个问题。

另外，上面的CheckBox需要父布局垂直居中展示，如果设置了父布局的paddingBottom属性，就需要给它设置        android:layout_marginTop="@dimen/dp_15"属性。

总结一下，在ConstraintLayout使用的过程中，如果使用单一维度上的双约束，却不是matchParent或者居中展示，就会很容易导致某个方向上的Margin属性无效，出现这种布局重叠的问题。这里是顶部的layout_marginTop属性失效了。

### Tips

可见，新的ConstraintLayout控件，布局测量中还有一些不完善的地方，需要慢慢去摸索。

还有一篇关于性能的探讨也不错，顺手关注一下

[Android约束性布局ConstraintLayout性能真的比RelativeLayout高吗](https://bbs.csdn.net/topics/392490952)



