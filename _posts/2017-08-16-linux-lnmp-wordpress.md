---
layout: post
title: "Ubuntu下搭建LNMP环境安装wordpress手记"
category: tools
---

## 1.安装nginx ##  

```
#安装
sudo apt-get install nginx 
#启动
sudo service nginx start
```
​     **找到配置文件/etc/nginx/nginx.conf**
 - 把worker_procrsses设置为服务器的CPU核数
 - 在event里增加 use epoll
 - worker_connections的值设置大一些，如果是1G内存，不要大于100000/worker_processes
 - 其他的采用默认值就好
```
#重新加载参数
sudo nginx -s reload
```

## 2.安装MySQL##

```
#安装
sudo apt-get install mysql-server
```
​	安装过程提示设置root帐号密码，安装完成后使用以下命令登陆root帐号
```
mysql -u root -p
```
## 3.安装php

```
#默认安装7.0版本
sudo apt-get install php
#默认安装7.0版本，PHP FastCGI的实现之一
sudo apt-get install php-fpm
#安装php的MySQL驱动
sudo apt-get install php-mysql
#重新启动php
sudo service php7.0-fpm restart
```
​	修改PHP配置文件

```
sudo vim /etc/php/7.0/fpm/pool.d/www.conf

#nginx 和fastcgi通信有2种方式，一种是TCP socket方式，还有种是UNIX domin Socket方式
#默认是UNIX domin Socket方式,服务器都在同一台机器上，推荐使用                          
listen = /run/php/php7.0-fpm.sock

#TCP socket方式
#listen = 127.0.0.1:9000
  
#可以用如下方式检查下配置文件是否有错误
sudo php-fpm7.0 -t 
 
#修改重启下 php-fpm7.0
sudo service php-fpm7.0 restart
```

​	修改nginx配置文件

```
sudo vim /etc/nginx/sites-enabled/default
 
root /var/www;
 
# Add index.php to the list if you are using PHP
index index.php index.html index.htm index.nginx-debian.html;
 
#找到   location ~ \.php$  { 修改里面
 
#socket 方式 必须和上面socket的listen路径一样
fastcgi_pass unix:/run/php/php7.0-fpm.sock;
  
#TCP方式
#fastcgi_pass 127.0.0.1:9000;  
#不管用那种方式，通信方式一定要对应。

#修改重启下 nginx
sudo service nginx restart
 
#nginx 检查配置文件命令是
sudo nginx -t
```
## 4.安装Wordpress 的最新版本

最后一步，一定要使用最新版本，之前参考mactalk的攻略，由于里面是历史版本一直没法正常访问。