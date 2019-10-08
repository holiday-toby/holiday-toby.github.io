---
layout: post
title: "开发中好用的无状态代码"
category: other
---

一个不需要传参的Activity，一个不需要传参的方法，使用起来是非常舒心的。

一个不调用成员变量Okhttp的intercepter，甚至不需要考虑同步的问题。

这一招简直是简化问题，写出优雅代码的神兵利器。很多时候，我们写出难看的代码，是因为：

- 把各种逻辑杂糅到一起，分层不清晰；
- 或者定义了一堆参数传来传去满天飞，数据结构不合理；
- 或者是一堆if/else或者嵌套的callback。

最近看码农翻身的文章里，有一个无状态的概念，和这里的情形有些出入，但是内部的编程思想实质上是一样的。
#### 无状态方法

 **y=f(x)**

纯函数，就是说一个方法，无论多少次调用，只要入参是一样的，总是可以得到一个相同的结果。
不依赖与外面的状态，就是说方法体中没有用到成员变量，只有局部变量。
或者这个成员变量的方法调用也是无状态的。

函数不保存状态，无论并发（同一时间段）还是并行（同时），都没有问题。

[小白科普：无状态那点事儿](https://mp.weixin.qq.com/s/7KmEOXhefUxv51rR03SarA)

#### ‘**不可变对象**’（Immutable Object）

最出名的不改变对象就是Java里的String类。

‘无状态对象’，一个对象没有实例变量，或者实例变量是final的。更准确的说法就是“不可变对象”。

```java
public final class Complex{
    private final int a;
    private final int b;
    public Complex(int a, int b){
        this.a = a;
        this.b = b;
    }
    public Complex add(Complex other){
        return new Complex(a + other.a, b+other.b);
    }
}
```

调用add方法，不是对现有对象的修改，而是返回了一个新的对象。这样当多个线程调用add 方法时候，都是线程安全的。

不可变对象会使用新的对象来表达变化，类似一本翻页的动画书。

可变性在原有的对象上做修改，摧毁了时间、状态这些概念，类似在原有的图画上不断涂改。

### ThreadLocal
如果确实需要使用共享的成员变量，可以使用ThreadLocal，来保证线程安全。



