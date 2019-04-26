---
layout: post
title: "Android开发中动态添加fragment的一些坑"
category: other
---

### 背景

项目中一个业务中使用到了fragment一开始是静态写在xml里的，后续业务升级的时候同事改为了在Activity的onCreate方法中动态add的方式，bugly上忽然报出了这个fragment一个TextView初始化找不到context的crash，而且影响范围挺大。

报错信息

```java
 Caused by:java.lang.NullPointerException:Attempt to invoke virtual method 'android.content.res.Resources android.content.Context.getResources()' on a null object reference
android.view.ViewConfiguration.get(ViewConfiguration.java:432)
android.view.View.<init>(View.java:4627)
android.view.View.<init>(View.java:4776)
android.widget.TextView.<init>(TextView.java:850)
android.widget.TextView.<init>(TextView.java:844)
android.widget.TextView.<init>(TextView.java:840)
android.widget.TextView.<init>(TextView.java:836)
com.xxxx.nmymodule.fragment.AppleListFragment.a(AppleListFragment.java:118)
com.xxxx.nmymodule.fragment.AppleListFragment$1.b(AppleListFragment.java:82) com.xxxx.nmymodule.fragment.AppleListFragment$1.onSuccess(AppleListFragment.java:79)
```
add方式

```java

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_apple_list);
  			.....
  			
        XxxListFragment fragment = new XxxListFragment();
        Bundle bundle = new Bundle();
        bundle.putString(KEY_INFO_TYPE, getIntent().getStringExtra(KEY_INFO_TYPE));
        fragment.setArguments(bundle);
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, fragment, TAG).commit();
    }

```
报错代码是在一个接口回调里， TextView tv = new TextView(getContext());
```java
protected void loadData() {
      .....
      HttpProvider.newInstance(AppleService.class, service -> service.fetchAppleList(postbody))
                      .executeLoadData(new HttpObserver<AppleListEntity>(getActivity()) {
                          @Override
                          public void onSuccess(@NonNull AppleListEntity data) {
                              onDataSuccess(data.getList(), false);
                            //添加Footer
                              listAdapter.removeAllFooterView();
                              TextView tv = new TextView(getContext());
                              tv.setText("已显示最近一个月数据");
                              tv.setTextColor(ContextCompat.getColor(getContext(), R.color.mediumGrayColor));
                              tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f);
                              tv.setGravity(Gravity.CENTER);
                              int padding = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 20, getContext().getResources()
                                      .getDisplayMetrics());
                              tv.setPadding(0, padding, 0, padding);
                              listAdapter.addFooterView(tv);
                          }

                          @Override
                          public void onErrorInfo(@NonNull ErrorInfo ef) {
                              super.onErrorInfo(ef);
                              onDataError(ef);
                          }
                      });
    }
```

###  分析步骤

1. 一开始猜测是多个fragment同时存在的问题，改为如下方式，依然报错
```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

			.....
			
        AppleListFragment fragment = new AppleListFragment();
        if (savedInstanceState != null) {
            Fragment f = getSupportFragmentManager().findFragmentByTag(TAG);
            if (f != null && f.isAdded()) {
                getSupportFragmentManager().beginTransaction().remove(f).commitAllowingStateLoss();
            }
        }
        Bundle bundle = new Bundle();
        bundle.putString(KEY_INFO_TYPE, getIntent().getStringExtra(KEY_INFO_TYPE));
        fragment.setArguments(bundle);
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, fragment, TAG).commit();
    }
```

2. 这个loadData方法是在Fragment的onViewCreated方法中调用的，推测是旧的fragment虽然被替换了，但是替换之前loadData方法已经走过了，所以还是报这个问题。已经添加到Activity的Frament，onViewCreated的调用时机并不确定，应该是早于onCreate方法。
```
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
        initConfigs();
        viewContainer.showLoading();
        loadData();
    }
```
3. 打开开发者模式中的不保留活动，从这个页面到其他页面然后返回，复现了这个问题，发现loadData方法果然调用了两次，被替换的Fragment还是会调用这个方法，然后在处理返回逻辑的时候报错。

### 解决方案

1. 继续通过静态方式使用Fragment，这样Fragment的生命周期和Activity是一致的
2. 在onResume方法中加载数据，应该可以避免这个问题（未尝试）,因为frament的onResume方法除了commit流程，应该只会在Activity的onResume方法中被调用。
3. 个人觉得最好用最简便的方式，可以防止Frament多次无谓的重建，因为Fragment一旦Add到Activity了，和普通View也差不多，没必要一次次重新创建。当Activity由于内存满了临时销毁，返回时候再次重建时，可以不必再次添加fragment。
```
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_apple_list);
        ......
        if (savedInstanceState == null) {
            AppleListFragment fragment = new AppleListFragment();
            Bundle bundle = new Bundle();
            bundle.putString(KEY_INFO_TYPE, getIntent().getStringExtra(KEY_INFO_TYPE));
            fragment.setArguments(bundle);
            getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, fragment).commit();
        }
    }
```

### 结论

Fragment还是一如既往的坑，不过本质上还是一个有生命周期的View，在添加到Activity之后生命周期就和Activity保持一致了。

