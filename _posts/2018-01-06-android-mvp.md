---
layout: post
title: "Android开发中的MVP模式"
category: other
---

### 背景

对于逻辑复杂，页面状态较多的页面，使用MVP方式开发是一种解耦合的思路。当然复杂单页也可以选择多模块的方式来开发。MVP的优点如下：

- 其一、只要定义好了层级间接口，可以多个程序员并行开发一个复杂功能。
- 其二、也可以让代码逻辑更加清晰，方便后期的维护与功能升级。例子，视频上传页面，复杂商品单页。
- 其三、P层，M层可以单独拿出来测试，方便编写单元测试

官方提供的MVP框架定义了较多的接口，这里提供一种简易的MVP框架供参考。实现了分层功能，但是对P层并没有定义对应的接口，因为实际业务逻辑中P层的代码复用度并不高。所以这里通过继承来实现P层，通过泛型来持有P层的引用。

#### 一、业务XXXActivity需要继承BaseMvpActivity，并实现View层接口，只负责展示逻辑。

```
public abstract class BaseMvpActivity<V, T extends BasePresenter<V>> extends BaseActivity {
    protected T mPresenter;  //Presenter对象

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mPresenter = createPresenter();  //创建Presenter
        mPresenter.attachView((V) this); //View与Presenter建立关联
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mPresenter.detachView();
    }

    protected abstract T createPresenter();
}
```

#### 二、 View层接口可以选择继承BaseView，

```
public interface BaseView<T> {

    void showLoading(boolean isloading);

    void showContent(T data);

    void showError(ErrorInfo info);

    void showNonet();
}
```



#### 三、 P层继承BasePresenter，持有V层的接口引用，以及M层的引用，获取数据并交给View层来展示

```
public abstract class BasePresenter<T> {

    protected Reference<T> mViewRef;

    public void attachView(T view) {
        mViewRef = new WeakReference<T>(view);
    }

    protected T getView() {
        return mViewRef.get();
    }

    public boolean isViewAttached() {
        return mViewRef != null && mViewRef.get() != null;
    }

    public void detachView() {
        if (mViewRef != null) {
            mViewRef.clear();
            mViewRef = null;
        }
    }
}
```


