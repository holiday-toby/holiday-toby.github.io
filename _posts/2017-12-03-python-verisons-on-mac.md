---
layout: post
title: "mac环境下python版本管理"
category: other
---

mac 下有多个python版本，虽有有pyenv这样的管理软件，但是已安装的python包仍然需要用户来维护与整理。

###  系统自带python位置

这里是系统自带的python，最好不要修改删除，造成系统问题。/usr/bin/python，这里是系统自带python的链接。

```bash
➜  Python.framework pwd
/System/Library/Frameworks/Python.framework
➜  Python.framework la
total 0
lrwxr-xr-x  1 root  wheel    23B Oct 23 17:10 Python -> Versions/Current/Python
lrwxr-xr-x  1 root  wheel    26B Oct 23 17:10 Resources -> Versions/Current/Resources
drwxr-xr-x  7 root  wheel   224B Oct 23 17:14 Versions
➜  Python.framework cd Versions 
➜  Versions la
total 0
lrwxr-xr-x   1 root  wheel     3B Oct 23 17:10 2.3 -> 2.7
lrwxr-xr-x   1 root  wheel     3B Oct 23 17:10 2.5 -> 2.7
lrwxr-xr-x   1 root  wheel     3B Oct 23 17:10 2.6 -> 2.7
drwxr-xr-x  10 root  wheel   320B Dec 27 13:06 2.7
lrwxr-xr-x   1 root  wheel     3B Oct 23 17:10 Current -> 2.7

......

➜  bin pwd
/usr/bin
➜  bin ll python
-rwxr-xr-x  1 root  wheel    65K Nov 30 15:38 python
➜  bin ./python --version
Python 2.7.10  //系统python版本
➜  bin which python
/usr/local/bin/python
➜  bin ll /usr/local/bin/python
lrwxr-xr-x  1 ldh  admin    38B Sep 30 15:27 /usr/local/bin/python -> ../Cellar/python@2/2.7.15_1/bin/python
➜  bin python --version 
Python 2.7.15  //自安装python版本

➜  /etc cat paths
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
#这里可见系统path里/usr/local/bin排在/usr/bin前面，所以默认python为brew安装的python
```

### 通过HomeBrew安装的python管理

通过which命令，查询到当前命令行正在使用的python和python3版本，都是通过homebrew安装在/usr/local/bin/目录下的。

```bash
➜  ~ which python
/usr/local/bin/python
➜  ~ ll /usr/local/bin/python
lrwxr-xr-x  1 ldh  admin    38B Sep 30 15:27 /usr/local/bin/python -> ../Cellar/python@2/2.7.15_1/bin/python
➜  ~ which python3
/usr/local/bin/python3
➜  ~ ll /usr/local/bin/python3
lrwxr-xr-x  1 ldh  admin    36B Feb 15 11:03 /usr/local/bin/python3 -> ../Cellar/python/3.7.2_2/bin/python3
➜  ~ which pip
/usr/local/bin/pip
➜  ~ ll /usr/local/bin/pip
lrwxr-xr-x  1 ldh  admin    35B Sep 30 15:27 /usr/local/bin/pip -> ../Cellar/python@2/2.7.15_1/bin/pip
➜  ~ which pip3
/usr/local/bin/pip3
➜  ~ ll /usr/local/bin/pip3
lrwxr-xr-x  1 ldh  admin    33B Feb 15 11:03 /usr/local/bin/pip3 -> ../Cellar/python/3.7.2_2/bin/pip3
```

**安装与卸载**

<!--这里是注释-->

这里直接通过brew upgrade 升级软件可以自动删除历史版本。

```
#不同版本的python，这里只保留最新的版本，历史版本可以直接删除
➜  Cellar cd python@2 
➜  python@2 la
total 0
drwxr-xr-x  13 ldh  admin   416B Sep 30 15:26 2.7.15_1
➜  python@2 cd ../python 
➜  python la
total 0
drwxr-xr-x  13 ldh  admin   416B Apr 27  2018 3.6.2
drwxr-xr-x  13 ldh  staff   416B Sep 30 14:41 3.7.0
drwxr-xr-x  13 ldh  staff   416B Feb 15 11:03 3.7.2_2
```

```
#查看网络端的python
➜  python brew search python
==> Formulae
app-engine-python   gst-python          python ✔            wxpython
boost-python        ipython             python-markdown     zpython
boost-python3       ipython@5           python-yq
boost-python@1.59   micropython         python@2 ✔

==> Casks
homebrew/cask/awips-python               homebrew/cask/mysql-connector-python
homebrew/cask/kk7ds-python-runtime
#再次安装,会提示已安装
➜  python brew install python3 
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (homebrew/core).
==> New Formulae
libkeccak                  protoc-gen-go              spirv-cross
mage                       sha3sum                    tesseract-lang
==> Updated Formulae
node ✔              haproxy             openconnect         solr
...
Warning: python 3.7.2_2 is already installed and up-to-date
To reinstall 3.7.2_2, run `brew reinstall python`
➜  brew doctor   //查看是否正确安装
```

