---
layout: post
title: "checkbox自定义图片及扩大点击区域"
category: other
---

1. 自定义图片资源，一般UI会给这样一张选中图片，需要自定义边框

![截屏2020-02-28下午5.01.24](https://ftp.bmp.ovh/imgs/2020/02/ec7ea11c94347ab2.png)
首先定义选中资源zc_cbx_oncheck.xml：

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">

    <item>
        <shape android:shape="oval">
            <stroke
                android:width="1dp"
                android:color="@color/colorAccentSecond" />
            <size
                android:width="@dimen/dp_18"
                android:height="@dimen/dp_18" />
        </shape>
    </item>
     <item android:top="1dp"
        android:left="1dp"
        android:right="1dp"
        android:bottom="1dp">
        <bitmap
            android:gravity="center"
            android:src="@drawable/zx_comm_icon_xuanze_xuanzhong" />
    </item>
</layer-list>

```

2. 然后定义zc_selector_cbx.xml:

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/zc_cbx_oncheck" android:state_checked="true" />
    <item android:state_checked="false">
        <shape android:shape="oval">
            <stroke android:width="1dp" android:color="#d3d7da" />
            <size android:width="18dp" android:height="18dp" />
        </shape>
    </item>

</selector>
```

3. 使用资源

```xml
            <CheckBox
                android:id="@+id/cb_check_follow"
                android:layout_width="18dp"
                android:layout_height="18dp"
                android:layout_marginEnd="20dp"
                android:button="@drawable/zc_selector_cbx"
                android:checked="false"/>

```

4. 上面的设置有个问题，点击区域过小，扩大点击区域有两个方式
- 一个是给背景图片添加透明的padding，不太灵活
   - 第二个方法比较推荐，在xml中这样设置`android:button="@null"`
- [CheckBox自定义样式和扩大点击区域【Android】](http://www.ibooker.cc/article/18/detail)有展开描述

```
         <CheckBox
                android:id="@+id/cb_check_follow"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginEnd="20dp"
                android:button="@null"
                android:checked="false"
                android:drawableStart="@drawable/zc_selector_cbx"
                android:padding="10dp"
                ..../>
               
```

