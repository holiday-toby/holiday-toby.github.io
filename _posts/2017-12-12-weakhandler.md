---
layout: post
title: "使用WeakHandler避免内存泄漏"
category: other
---


一个简单的Handler封装
```
import android.os.Handler;
import android.os.Message;
import java.lang.ref.WeakReference;

public class WeakHandler<T extends WeakHandler.IHandler> extends Handler {
    private final WeakReference<T> mHandlerReference;

    public WeakHandler(T owner) {
        mHandlerReference = new WeakReference<>(owner);
    }

    @Override
    public void handleMessage(Message msg) {
        T owner = getOwner();
        if (owner != null) {
            owner.handleMsg(msg);
        }
    }

    public T getOwner() {
        return this.mHandlerReference.get();
    }

    public interface IHandler {
        void handleMsg(Message msg);
    }
}

```

使用，在Activity或者Fragment中，实现IHandler接口

```
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mHandler = new WeakHandler<>(this);
    }
    
    @Override
    public void onResume() {
        super.onResume();
        mHandler.sendEmptyMessageDelayed(1, 100);
    }

    @Override
    public void onStop() {
        super.onStop();
        mHandler.removeMessages(1);
    }    
    
        @Override
    public void handleMsg(Message msg) {
        if (msg.what == 1) {
            doSomething();
            mHandler.sendEmptyMessageDelayed(1, 100);
        }
    }
    
    public void doSomething(){
    	
    }
```

