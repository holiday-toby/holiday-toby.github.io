---
layout: post
title: "Linux下常用文件与文件夹操作命令"
category: linux
---

## 查看文件和文件夹大小du与df

```
#查看分区的文件系统df与du
$df -T  
#易读方式查看系统中文件的可用空间及使用情形
$df -h

#查看当前目录下各个文件及目录占用空间大小
$du -sh *

du -sh 查看当前文件夹大小

du -sh * | sort -n 统计当前文件夹(目录)大小，并按文件大小排序

du -sk filename 查看指定文件大小
```

## Linux 目录结构

- [Linux目录结构及详细介绍](https://blog.csdn.net/m0_38044196/article/details/72844025)
- [Linux 系统目录结构](http://www.runoob.com/linux/linux-system-contents.html)

 > 在linux系统中，有几个目录是比较重要的，平时需要注意不要误删除或者随意更改内部文件。
 >
 >
 >  /etc： 上边也提到了，这个是系统中的配置文件，如果你更改了该目录下的某个文件可能会导致系统不能启动。
 >
 >   /bin, /sbin, /usr/bin, /usr/sbin: 这是系统预设的执行文件的放置目录，比如 ls 就是在/bin/ls 目录下的。值得提出的是，/bin, /usr/bin 是给系统用户使用的指令（除root外的通用户），而/sbin, /usr/sbin 则是给root使用的指令。 
 >
 >  /var： 这是一个非常重要的目录，系统上跑了很多程序，那么每个程序都会有相应的日志产生，而这些日志就被记录到这个目录下，具体在/var/log 目录下，另外mail的预设放置也是在这里。

## 文件移动与改名命令 mv

    $ mv source/  desc/
    souce 与desc不在同一目录下则移动，在同一目录下则改名

## 文件复制命名cp与scp    

- [如何优雅地连接ssh](https://segmentfault.com/a/1190000000585526)
- [SCP命令详解](https://www.cnblogs.com/likui360/p/6011769.html)

 ```
 //远程复制文件夹到本机，默认覆盖
 $scp -r root@117.48.201.36:/backup ~/Linux/  
 //复制本地文件到远程Unix
 $scp my-key-file.pub loginname@yourdomain.com:.
 ```

## 文件夹内容查看命令 ls

    $la  floderName/
## 文件查看命令 cat

    $cat fileName
    $cat my-key-file.pub >> ~/.ssh/authorized_keys

## 文件编辑命令 vim与echo

//将hello world 加到test.md文件的最后一行
$echo "hello world" >> test.md

## 配置文件修改后执行生效命令 source 

    $source ~/.zshrc

## 文件查找 find

    find /home -name "*.txt" 在/home目录下查找以.txt结尾的文件名
    
    find . -iname "*.md"   同上，但忽略大小写
    
    find . -name "*.txt" -o -name "*.pdf" 当前目录及子目录下查找所有以.txt和.pdf结尾的文件
    
    find /usr/ -path "*local*" 匹配文件路径或者文件
    
    find /home ! -name "*.txt"  找出/home下不是以.txt结尾的文件
    
    find . -type 类型参数
          类型参数列表：
- f 普通文件
- l 符号连接
- d 目录
- c 字符设备
- b 块设备
- s 套接字
- p Fifo

## 综合运用-查看文件个数

```
ls -l |grep "^-"|wc -l

或

find ./company -type f | wc -l

查看某文件夹下文件的个数，包括子文件夹里的。

ls -lR|grep "^-"|wc -l

查看某文件夹下文件夹的个数，包括子文件夹里的。

ls -lR|grep "^d"|wc -l

说明：

ls -l

长列表输出该目录下文件信息(注意这里的文件，不同于一般的文件，可能是目录、链接、设备文件等)

grep "^-"

这里将长列表输出信息过滤一部分，只保留一般文件，如果只保留目录就是 ^d

wc -l

统计输出信息的行数，因为已经过滤得只剩一般文件了，所以统计结果就是一般文件信息的行数，又由于

一行信息对应一个文件，所以也就是文件的个数。
```
## 查看Linux系统版本信息

1. 输入"uname -a ",可显示电脑以及操作系统的相关信息。 

2. 输入"cat /proc/version",说明正在运行的内核版本。

3. 输入"cat /etc/issue", 显示的是发行版本信息

4. lsb_release -a (适用于所有的linux，包括Redhat、SuSE、Debian等发行版，但是在debian下要安装lsb)

5. cat /proc/cpuinfo （Linux查看cpu相关信息，包括型号、主频、内核信息等）
