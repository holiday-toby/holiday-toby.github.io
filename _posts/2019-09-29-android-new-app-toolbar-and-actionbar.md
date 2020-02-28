---
layout: post
title: "新APP打造之标题栏"
category: other
---



### BaseActivity中实现的几种方案



#### 一、使用supportActionBar，可以在主题中配置，可以自定义view，

在xml中定义样式，包括左边的返回按钮和右边的menu

```
   
   <!--ActionBar样式,定义在application主题中-->
        <item name="actionBarStyle">@style/ActionBarStyle</item>
        <item name="actionMenuTextAppearance">@style/OverflowMenuStyle</item>
        <item name="actionOverflowMenuStyle">@style/OverflowMenuStyle</item>
        <item name="dropDownListViewStyle">@style/DropDownListViewStyle</item>
        <item name="actionBarPopupTheme">@style/ActionMenuStyle</item>
        <item name="android:homeAsUpIndicator">@drawable/big_arrow_dark_gray</item>
        <item name="actionMenuTextColor">@color/DarkBlackColor</item>
        <item name="android:windowContentOverlay">@null</item
        
        
      <style name="ActionBarStyle" parent="@style/Widget.AppCompat.ActionBar">
        <item name="height">48dp</item>
        <item name="background">?attr/colorPrimary</item>
        <item name="titleTextStyle">@style/AppTitleStyle</item>
```

在java代码中定义中间view

```java
 protected void initActionBar() {
        actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);
        setActionBarStyle();
    }

 public void setActionBarStyle() {
        actionBar.setHomeAsUpIndicator(getResources().
                               getDrawable(R.drawable.big_arrow_dark_gray));
        actionBar.setDisplayShowTitleEnabled(false);
        actionBar.setDisplayShowCustomEnabled(true);
        LinearLayout titleLl = new LinearLayout(this);
        titleLl.setOrientation(LinearLayout.HORIZONTAL);
        titleLl.setGravity(Gravity.CENTER);
        titleLl.setPadding(UIParameter.dp2px(this, 3), 0, UIParameter.dp2px(this, 3), 0);
        TypedValue typedValue = new TypedValue();
        getTheme().resolveAttribute(android.R.attr.actionBarItemBackground, typedValue, true);
        titleLl.setBackgroundResource(typedValue.resourceId);
        titleTv = new TextView(this);
        titleTv.setTextColor(getResources().getColor(R.color.AppDarkBlackColor));
        titleTv.setMaxLines(1);
        titleTv.setEllipsize(TextUtils.TruncateAt.END);
        titleTv.setTextSize(TypedValue.COMPLEX_UNIT_PX,   getResources().getDimensionPixelOffset(R.dimen.AppH18Font));
        titleLl.addView(titleTv);
        ActionBar.LayoutParams layoutParams = new ActionBar.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT);
        layoutParams.gravity = Gravity.CENTER;
        actionBar.setCustomView(titleLl, layoutParams);
        titleTv.setText(getTitle());
    }
```

#### 二、使用toolbar，推荐方式

定义标题和右侧按钮，include到BaseActivity的xml中

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

#### 三、BaseActivity中自定义titlbar，然后引入到布局中

```java
public class TitleBar extends RelativeLayout {
    /**
     * 标题view
     */
    public TextView mTitleView;
    /**
     * 返回按钮
     */
    public ImageView mBackView;

    public TextView mLeftTextView;

    /**
     * 右边的TextView
     */
    public TextView mRightTextView;
    /**
     * 右边的ImageView
     */
    public ImageView mRightImageView;
    private ImageView mCenterIcon;


    public TitleBar(Context context) {
        super(context);
    }

    public TitleBar(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public TitleBar(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        initView();
    }

    protected void initView() {
        mBackView = findViewById(R.id.left_image_btn);
        mBackView.setVisibility(View.VISIBLE);
        mLeftTextView = findViewById(R.id.left_text);
        mTitleView = findViewById(R.id.center_text);
        mCenterIcon = findViewById(R.id.title_icon);
        mRightTextView = findViewById(R.id.right_text_btn);
        mRightImageView = findViewById(R.id.right_image_view);
    }

    /**
     * 设置返回视图的可见性
     *
     * @param visibility
     */
    public void setBackViewVisibility(int visibility) {
        mBackView.setVisibility(visibility);
    }

    /**
     * 返回事件
     *
     * @param listener
     */
    public void setBackListener(OnClickListener listener) {
        mBackView.setOnClickListener(listener);
    }

    /**
     * 设置标题栏
     *
     * @param title
     */
    public void setTitle(CharSequence title) {
        mTitleView.setText(title);
    }

    /**
     * @param resId 文字的id
     */
    public void setTitle(int resId) {
        setTitle(getResources().getText(resId));
    }


    public void setCenterIcon(int resId) {
        if (resId == 0) {
            mCenterIcon.setVisibility(GONE);
        } else {
            mCenterIcon.setVisibility(VISIBLE);
        }
        mCenterIcon.setImageResource(resId);
    }

    /**
     * 设置右边文字文本,文字为空是控件隐藏
     *
     * @param text
     */
    public void setRightText(CharSequence text) {
        mRightTextView.setVisibility(TextUtils.isEmpty(text) ? View.GONE : View.VISIBLE);
        mRightTextView.setText(text);
    }

    public void setRightTextColor(@ColorInt int color) {
        mRightTextView.setTextColor(color);
    }

    public void setRightTextColor(ColorStateList color) {
        mRightTextView.setTextColor(color);
    }

    /**
     * 设置右边文字按键事件
     *
     * @param listener
     */
    public void setRightTextListener(OnClickListener listener) {
        mRightTextView.setOnClickListener(listener);
    }

    /**
     * @param resId
     */
    public void setRightImageView(int resId) {
        mRightImageView.setVisibility(resId == 0 ? View.GONE : View.VISIBLE);
        mRightImageView.setImageResource(resId);
    }

    public void setRightImageViewListener(OnClickListener listener) {
        mRightImageView.setOnClickListener(listener);
    }

}
```

布局文件

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.lib.widget.TitleBar xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/layout_widget_title_bar"
    android:layout_width="match_parent"
    android:layout_height="@dimen/titlebar_height"
    android:background="@drawable/bg_title_bar">

    <!-- 左侧 -->

    <ImageView
        android:id="@+id/left_image_btn"
        style="@style/style_title_bar_back_btn1"
        android:layout_centerVertical="true"
        android:paddingLeft="15dp"
        android:src="@drawable/comm_list_icon_back"
        android:visibility="gone" />

    <TextView
        android:id="@+id/left_text"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_toEndOf="@id/left_image_btn"
        android:layout_toRightOf="@id/left_image_btn"
        android:gravity="center"
        android:includeFontPadding="false"
        android:text="微聊"
        android:textColor="#333333"
        android:visibility="gone" />

    <!-- 中间 -->

    <TextView
        android:id="@+id/center_text"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_centerInParent="true"
        android:layout_marginLeft="60dp"
        android:layout_marginRight="60dp"
        android:ellipsize="end"
        android:gravity="center"
        android:includeFontPadding="false"
        android:maxLines="1"
        android:singleLine="true"
        android:textColor="@color/title_bar_text_color"
        android:textSize="@dimen/titlebar_text_size"
        tools:text="标题" />

    <ImageView
        android:id="@+id/title_icon"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerVertical="true"
        android:layout_marginStart="-50dp"
        android:layout_marginLeft="-50dp"
        android:layout_toEndOf="@id/center_text"
        android:layout_toRightOf="@id/center_text" />

    <!-- 右侧 -->

    <ImageView
        android:id="@+id/right_image_view"
        android:layout_width="@dimen/titlebar_height"
        android:layout_height="@dimen/titlebar_height"
        android:layout_alignParentEnd="true"
        android:layout_alignParentRight="true"
        android:scaleType="centerInside"
        android:visibility="gone" />

    <TextView
        android:id="@+id/right_text_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentEnd="true"
        android:layout_alignParentRight="true"
        android:layout_centerVertical="true"
        android:layout_marginEnd="8dp"
        android:layout_marginRight="8dp"
        android:layout_toStartOf="@id/right_image_view"
        android:layout_toLeftOf="@id/right_image_view"
        android:gravity="center"
        android:includeFontPadding="false"
        android:minWidth="54dp"
        android:minHeight="30dp"
        android:paddingLeft="11dip"
        android:paddingRight="11dip"
        android:text="确定"
        android:textColor="#1fb081"
        android:textSize="16dp"
        android:visibility="gone"
        tools:visibility="visible" />

</com.lib.widget.TitleBar>
```

#### 参考文章

[**ActionBar详解和toolbar详解**](https://www.imooc.com/article/2844)