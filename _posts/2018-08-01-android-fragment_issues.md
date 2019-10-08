---
layout: post
title: "fragment使用issues"
category: other
---

Fragment作为一个有生命周期的view组件，是google在3.0的时候推出的，可以有效降低内存使用，提高流畅度。使用的过程遇到了很多坑，这里总结一下。

[踩坑，Fragment使用遇到那些坑](https://blog.csdn.net/xiaoxiaocaizi123/article/details/79074501)

#### 避免Activity恢复时，onCreate()中动态添加fragment重复创建
这个问题是原来的代码通过静态加载改为动态加载后，getActivity()方法报了空指针异常发现的。onCreate()方法当Activity从内存中恢复的时候也会调用，这个时候旧的fragment还是依附在Activity上的。onCreate()中需要加入判断。

方法一：判断Activity不是从内存中恢复回来，则新增

```
//防止重复添加fragment
if (savedInstanceState == null) {
	            getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, fragment).commit();

}
```

方法二：判断activity从内存中恢复时，去掉之前的Fragment

```
   @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState != null) {
            Fragment f = getSupportFragmentManager().findFragmentByTag(TAG);
            if (f != null && f.isAdded()) {
                getSupportFragmentManager().beginTransaction().remove(f).commitAllowingStateLoss();
            }
        }
        getSupportFragmentManager().beginTransaction().add(android.R.id.content, fragment, TAG).commit();
    }
```

方法三：在xml中静态添加fragment，安全无副作用

```xml
<fragment
          android:id="@+id/fragment_primary"
          android:name="com.common.fragment.ImagesFragment"
          android:layout_width="match_parent"
          android:layout_height="wrap_content"
          tools:layout="@layout/fragment_approval_invite_upload_images" />
```

google官方demo:

```
 com.google.samples.apps.iosched.ui.SimpleSinglePaneActivity

@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getContentViewResId());
 
        if (getIntent().hasExtra(Intent.EXTRA_TITLE)) {
            setTitle(getIntent().getStringExtra(Intent.EXTRA_TITLE));
        }
 
        final String customTitle = getIntent().getStringExtra(Intent.EXTRA_TITLE);
        setTitle(customTitle != null ? customTitle : getTitle());
 
        if (savedInstanceState == null) {
            mFragment = onCreatePane();
            mFragment.setArguments(intentToFragmentArguments(getIntent()));
            getFragmentManager().beginTransaction()
                    .add(R.id.root_container, mFragment, "single_pane")
                    .commit();
        } else {
            mFragment = getFragmentManager().findFragmentByTag("single_pane");
        }
```

[activity被回收，fragment恢复处理](https://blog.csdn.net/w958796636/article/details/50617640)





