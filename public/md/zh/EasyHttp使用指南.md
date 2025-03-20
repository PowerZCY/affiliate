---
id: "easyhttp-module"
title: "EasyHttp使用指南"
slug: "easyhttp-module"
excerpt: "并发测试工具，一条命令即可进行并发接口调用"
tags: ["tutorials"]
author:
  name: "帝八哥"
  avatar: "/images/default.webp"
publishedAt: "2020-05-15"
imageUrl: "/images/default.webp"
featured: false
---

## EasyHttp使用指南

1.  easy-http

2.  httpie

3.  http和json测试自定义接口

## easy-http
---------

**下载安装.**
```bash
pip3 install D8gerConcurrent
```

**使用示例.**
```bash
# 获取帮助信息
easy-http [-h|--help]

# 使用默认参数: 1个线程, 连续请求1次
easy-http http://www.huya.com/

# 使用64个线程连续请求20,000次
easy-http http://www.huya.com/ -w 64 -l 20000
```

**构建过程.**
```bash
# 本地安装测试
python3 setup.py install
# 打包
python3 setup.py sdist
# 上传发布
# pip3 install twine
twine upload dist/*

# pip3更新安装
pip3 install --upgrade D8gerConcurrent
```

## httpie
```bash
# 安装httpie
brew install httpie

# 下载文件
http --verify=no --download  下载地址 -o  指定下载后文件名

# 上传文件, 携带Header参数格式 K:V 携带Body参数格式 K=V(字符串) K:=V(数值) 文件参数格式 K文件@V路径
http --verify=no -v -f POST 上传文件地址 HttpHeaderParam:D8GER HttpBodyNumParam:=4 HttpBodyStringParam:=D8GER  file@文件在本机的绝对路径(~/D8ger/good/luck.txt)

# 携带Cookie调用接口
http -v http://localhost:8080/helloWorld HT-app:6 'Cookie:获取的Cookie串'
```

## 1. http和json测试自定义接口
```bash
# 调用登录接口获取Cookie, 在~目录下创建ssoLogin.json文件, 填好信息
login-cookie
# 输出会打印Cookie, 即已拼接好的httpie示例命令信息
```

## 2. 最佳实践
> 利用shell脚本定义函数, 在函数内接受输入参数, 再调用httpie命令执行
> 编辑.zshrc、.bashrc等shell配置文件

```bash
# 将请求JSON参数写入~/Desktop/ssoLogin/requestBody.json, 响应JSON结果写入~/Desktop/ssoLogin/ResponseBody.json
# 示例: https-downLoadResponse http://www.debuggerpowerzcy.top/
function downLoadResponse() {
    echo "执行命令内容: \n    http --verify=no -v --session-read-only=~/session-cookie-read-only.json${1} < ~/Desktop/ssoLogin/requestBody.json -d >>~/Desktop/ssoLogin/ResponseBody.json ${@:2}\n"
    http --verify=no -v --session-read-only=~/session-cookie-read-only.json POST ${1} < ~/Desktop/ssoLogin/requestBody.json -d >>~/Desktop/ssoLogin/ResponseBody.json ${@:2}
}
alias https-downLoadResponse='downLoadResponse'

# 通过下载链接下载文件, 并重命名文件
# 示例: https-downLoadExcel http://www.debuggerpowerzcy.top/power/ANNA.jpg  My.jpg
function downLoadExcel() {
    echo "执行命令内容: \n    http --verify=no -v --download  --session-read-only=~/session-cookie-rey.json POST ${1} < ~/Desktop/ssoLogin/requestBody.json -o ${2}"
    http --verify=no -v --download  --session-read-only=~/session-cookie-read-only.json POST ${1} < ~/Desktop/ssoLogin/requestBody.json -o ${2}
}
alias https-downLoadExcel='downLoadExcel'

# 将请求JSON参数写入~/Desktop/ssoLogin/requestBody.json, 展示完整的请求过程
# 示例: https-show http://www.debuggerpowerzcy.top/
function show() {
    echo "执行命令内容: \n    http --verify=no -v --session-read-only=~/session-cookie-read-only.json${1} < ~/Desktop/ssoLogin/requestBody.json ${@:2}\n"
    http --verify=no -v --session-read-only=~/session-cookie-read-only.json POST ${1} < ~/Desktop/ssoLogin/requestBody.json ${@:2}
}
alias https-show='show'

# MAC OS系统, 简化查询端口调用
# 示例: searchPortOccupy 8080
function searchPortOccupy(){
    lsof -i :${1}
}
alias searchPortOccupy='searchPortOccupy'

# 根据关键词查询进程ID
# 示例: searchPID D8ger.py
function searchPID(){
    ps aux | grep ${1} | grep -v grep | awk '{print $2}'
}
alias searchPID='searchPID'

# 根据关键词关闭(kill -9 X)进程ID
# 示例: killPID D8ger.py
function killPID(){
    pid=`ps aux | grep ${1} | grep -v grep | awk '{print $2}'`
    if [ -n "$pid" ]; then
        kill -9 $pid
        sleep 1
    fi
}
alias killPID='killPID'

# 简化多环境密码登录SHELL
# 安装shhpass工具, 将密码写入/Users/D8GER/Desktop/CAOFAN/sshpass/xxx.txt中
# 通过账户密码登录指定机器, 并在登录完成后跳转到/work/xxx/logs目录下
# 示例: xDev 198 将登录172.16.10.198机器, 并 cd /work/xxx/logs
function xDev() {
    sshpass -f /Users/D8GER/Desktop/CAOFAN/sshpass/xxx.txt  ssh 姓名@172.16.10.${1}  -t  'cd /work/xxx/logs/; exec $SHELL'
}
alias 'xDev=xDev'
```

## 其他
- [项目地址](https://github.com/caofanCPU/D8gerConcurrent), 分享不易, 请老铁赐赞, 谢谢!
