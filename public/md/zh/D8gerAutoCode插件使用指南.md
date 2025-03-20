---
id: "idea-plugin-d8gerautocode"
title: "IDEA-SpringBoot智能插件使用指南"
slug: "idea-plugin-d8gerautocode"
excerpt: "一键智能编码"
tags: ["tutorials"]
author:
  name: "帝八哥"
  avatar: "/images/default.webp"
publishedAt: "2020-09-05"
imageUrl: "/images/default.webp"
featured: false
---

## 🔥🔥🔥解决重复开发, 体验智能代码🔥🔥🔥
🇨🇳重复编码老瞎忙, Always busy with repeated coding on working,  
⚡️写来写去那几行. Same lines again and again like loop writing.  
🌱不知工具在何方? Don't know how to solve and where tools being?  
🍻八哥智能一键帮! Just press these shortcuts for helping!  
 
### Java-Web开发自动生成代码
- 打开配置框设置生成参数 Preference --> Other Settings --> D8gerAutoCode  
- 勾选要生成的文件及生成路径, 指明 author、author、locale, 保存即可
- 一键(alt + shift + cmd/ctrl + D)生成代码

![](http://file.debuggerpowerzcy.top/power/D8King.jpg)

![](http://file.debuggerpowerzcy.top/power/D81-AutoCode.gif)

### SwaggerModel字段顺序自动渲染
- SwaggerModelVo属性字段包含`@ApiModelProperty(`
- 一键(alt + shift + cmd/ctrl + O)渲染
![](http://file.debuggerpowerzcy.top/power/D82-SwaggerAutoRender.gif)

### JSON字符串美化
- 任意文本中的JSON字符串
- 一键(alt + shift + cmd/ctrl + J)美化
![](http://file.debuggerpowerzcy.top/power/D83-JSONFormat.gif)

### MySQL美化
- 在指明驱动情况下, IDEA有提供美化功能(alt + cmd/ctrl + L)
- 但对于任意MySQL文本, 可借助本功能美化
- 一键(alt + shift + cmd/ctrl + L)美化

### 清除空白字符
- 任意文本中的字符串
- 一键(alt + shift + cmd/ctrl + S)清除
![](http://file.debuggerpowerzcy.top/power/D84-Simplify.gif)

### 驼峰下划线大小写相互转换
- 任意文本中选中单词
- 小技巧, 单词被分为4种类型: 没有大写字母, 没有小写字母, 没有下换线首字母大写, 没有下换线首字母小写
- 一键(alt + shift + cmd/ctrl + U)转换, 若不满足, 继续快捷键直到满意为止
![](http://file.debuggerpowerzcy.top/power/D85-CamelUnderlineUL.gif)

### 字符串正则批处理大杂烩
#### 获取自动代码模板
- `d8ger`配置模板, 参见上文
![](http://file.debuggerpowerzcy.top/power/D86-D8gerProperty.gif)

#### NASA批处理字符串
- 输入`nasa`(忽略大小写), 快捷键(alt + shift + cmd/ctrl + N)获取NASA配置模板
- 根据配置文档更改配置, 输入多行字符串数据源, 再次按下快捷键即可
![](http://file.debuggerpowerzcy.top/power/D87-NASA.gif)

### REGEX正则技巧
- 输入`regex`(忽略大小写), 快捷键(alt + shift + cmd/ctrl + N)获取REGEX模板
- 重点提示: 模板中给出了正则表达式的所有基础技巧, 包括IDEA高级使用技巧, 以及[GitHub简化正则表达式项目](https://github.com/caofanCPU/JavaLambdaInternals)
![](http://file.debuggerpowerzcy.top/power/D88-REGEX.gif)


### 总结
- [项目地址](https://github.com/caofanCPU/D8gerAutoCode), 原创不易, 请路过的老铁为我点个🌟, 谢谢
- 视频教程
    - [Youtube](https://www.youtube.com/watch?v=LZfC2_u-8aE)