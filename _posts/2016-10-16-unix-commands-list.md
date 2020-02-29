---
layout: post
title: "常用linux命令记录"
category: tools
---
#### 1.scp与rsync
同步远程文件
```
## 复制mac的文件到虚拟机～目录
scp ~/.vimrctmp ldh@10.211.55.6:~

```
#### 2.link -s
创建软链接 
#### 3.ssh
生成key,连接到远程电脑

#### 3.df
查看文件系统，[linux的光驱位置](https://zhidao.baidu.com/question/620772369094254652.html)  
1、df查看是否已经挂载以及挂载路径  
2、/dev中找光驱设备
```
df
#查找光驱
ls -l cdrom
ls-l sr0
#挂载
sudo mount /dev/sr0 /media
或者/mnt目录下
df
#取消挂载
sudo umount /media
```
#### 4.ssh联机ubuntu虚拟机
1 在虚拟机中的centos的命令模式输入 ifconfig 获取到地址   inet addr 就是地址。

2 然后使用mac的终端 输入 ssh 192.168.xxx.xxx  会出现如下界面，然后输入yes  会叫你输入密码一切ok。

ssh ldh@10.211.55.6
