---
layout: post
title: "新APP打造之标题栏"
category: other
---



### 方案

一、使用supportActionBar，可以在主题中配置，可以自定义view，但不包括左边的返回按钮和右边的menu

```
 actionBar = getSupportActionBar();
```

二、使用toolbar

BaseActivity的xml中定义标题和右侧按钮

```xml
    <android.support.design.widget.AppBarLayout
        android:id="@+id/appbarlayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:elevation="0dp">

        <android.support.v7.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="?attr/colorPrimary"
            android:fitsSystemWindows="false"
            android:minHeight="?attr/actionBarSize"
            android:theme="@style/Toolbar"
            app:popupTheme="@style/Toolbar.Popup">

            <TextView
                android:id="@+id/toolbar_title_tv"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center"
                android:gravity="center"
                android:textColor="#333333"
                android:textSize="18dp"
                android:textStyle="bold"
                tools:text="title" />

            <TextView
                android:id="@+id/right_menu_tv"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="right"
                android:layout_marginRight="12dp"
                android:gravity="center"
                android:text=""
                android:textColor="@color/text_color_selector_menu"
                android:visibility="gone"
                tools:text="完成" />
        </android.support.v7.widget.Toolbar>

        <View
            android:id="@+id/toolbar_line"
            android:layout_width="match_parent"
            android:layout_height="0.5dp"
            android:background="#F9F9F9" />
    </android.support.design.widget.AppBarLayout>
```

然后onCreate()方法中初始化

```java
 toolbar = (Toolbar) findViewById(R.id.toolbar);
 setSupportActionBar(toolbar);
 actionBar = getSupportActionBar();
 actionBar.setHomeAsUpIndicator(R.drawable.tool_bar_back);
 actionBar.setDisplayHomeAsUpEnabled(true);
```

三、BaseActivity中自定义titlbar

```

```



