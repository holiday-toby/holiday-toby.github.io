---
layout: post
title: "Android Databinding使用手册"
category: android
---

## 1.开启Databinding与基本使用
```groovy
//module的build文件中
   dataBinding {
        enabled = true
    }
```
​        activity_demo.xml文件中添加

```xml
<layout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <data>
        <import type="android.view.View" />

        <import type="android.text.TextUtils" />
		
        <variable
           	name="user"
            type="com.ldh.User"/>
    </data>

	<LinearLayout     
		android:layout_width="match_parent"
        android:layout_height="match_parent">
        <!--布局信息。。。-->
      
       <com.xxx.nmymodule.widget.MyTabItemView
                android:id="@+id/wode_discount_coupon_item"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:onClick="@{()->presenter.onCouponClick()}"
                app:itemImage="@drawable/my_my_icon_yhq"
                app:itemName="优惠券"
                app:itemState="@{TextUtils.equals(`0`,benefit.coupon.num)?``:benefit.coupon.num+`张优惠券`}" />

    </LinearLayout>
</layout
```
​	替换Activity 的setContentView方法

```Java
ActivityDemoBinding binding = DataBindingUtil.setContentView(this, R.layout.activity_demo);
//数据关联 
binding.setUser(new User());
//或者 binding.setVariable(BR.user,new User());

//在fragment 中使用
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_mine, container, false);
        return binding.getRoot();
    }

//Data binding在activity中或者fragment加载其他布局怎么办呢？比如 //popupwindow之类的
ItemMapInfoBinding infoBinding = ItemMapInfoBinding.inflate(getLayoutInflater());
View popupView = infoBinding.getRoot();
PopupWindow mPopupWindow = new PopupWindow(mContext);
mPopupWindow.setContentView(popupView);
```
```xml
<!--bind UI-->
android:text="@{user.name}"
<!--view事件绑定 1.方法引用,要求有一个方法声明和View原来的listener方法完全一致  -->
android:onClick ="@{presenter::onClick}" 
<!--事件绑定 2.监听器绑定，任意方法声明，可以回传参数，使用lamda表达式-->
android:onClick = "@{()->presenter.onClickBinding(user)}"
```
## 2.原理

- android.binding   ==>生成的binding文件
- BR  ==> binding resources
- XxxBinding   ==>
- 开始编译=>处理Layout文件=> 解析表达式=>java编译=》解析依赖=>找到setter
- 0反射
- findViewById多次遍历view group
- 使用位标记来检验是否更新
- 数据改变在下一次批量更新时才会触发操作
- 缓存表达式
## 3.可用表达式
- 二元 & | ^    &&   ||
- 一元 + -！～
- 移位 >> >>> <<  
- 比较 == > < >= <=
- instanceof
- grouping()
- 文字 character ,String ,numeric,null
- cast
- 方法调用::
- firld访问
- Array 访问 []
- 三元运算符 a?c:b
```
#表达式-缺省
 - this ，super，new ,显示泛型调用 =》 以上暂不支持
#表达式-空合并运算符  
 - android:text ="@{user.displayName??uset.lastName}"
 Margin @dimen+@dimen
#结合ViewModel使用
#保持表达式简单直观
```
## 4.Null检查

```
#自动空指针检查，user为空也不会crash
{user.name}->null
{user.age}->0
#数组越界没油适配，需要自己注意
```

## 5.include与viewstub

```xml
<include layout="@layout/name" bind:user="@{user}"/>
<include
         layout="@layout/layout_databinding"
         bind:presenter="@{presenter}"
         bind:video="@{video}" />
#尚不支持direct child ,如root为merger
<ViewStub
          android:id="@+id/viewstub"
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:layout="@layout/widget" />
 if (binding.viewstub.getViewStub() != null) {
     //viewstub在以下方法调用的时候inflate，且只可以inflate一次     
     binding.viewstub.getViewStub().inflate();
 } 
```

## 6.Observable

 -  数据实现BaseObservable接口，get函数添加@Bindable注解，修改set函数，调用notifyPropertyChanged(com.xxx.xxx.BR.lastName)自动刷新对应属性。或者调用notityChanged()刷新所有属性

```Xml
<import type="android.view.View"/>
android:visibility="@employee.isFired?    View.GONE:View.VISIBLE"/>
```

 -  Observable Fields 无需继承以上接口，针对单个属性，需要通过get与set来操作，无法直接赋值 ,如ObservableBoolean、

```
#定义
ObservableBoolean isFired;
#初始化
isFired.set(false);
#使用
employee.setFired(!employee.getIsFired().get())
```

-   ObservableArrayList 与ObservableArrayMap 

```
#声明
public ObservableArrayMap<String,String> user = new Observa...
user.put("hello","world")
user.put("hi","world")
#xml中使用
employee.user["hi"]
```

## 7.高级绑定

 -  动态变量 RecyclerView
 ```
 RecyclerView#onBindViewHolder
 final T item = mItems.get(position);
 holder.getBinding().setVariable(BR.item,item);
 #重用的View需要立即刷新
 holder.getBinding().executePendingBindings();
 ```

 -  刷新 立即刷新同上

 -  后台线程 data binding 会本地化变量/值域，以避免同步问题（对collection不行）

 -  Binding生成  

```
下划线分割，大写开头 如
contact_item.xml -> ContactItemBinding
#自定义class
<data class = "ContactItem">
...
</data>
```

## 8.双向绑定
- android:text="@={postBody.mobile}"
- model继承BaseObservable
```
public class RegisterBody extends BaseObservable {
	private String mobile;      //手机号码
    private String password;    //密码
    @Bindable
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
        notifyPropertyChanged(BR.mobile);
    }
    ...
}
```

 - Android:text ="@{@string/welcome(model.name)}"
