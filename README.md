# 汉子拼音转换

## 特点
轻量级，满足大部分场景需求

## 诞生原因
npm仓库中已经存在大量拼音转换库，为何还要再造一个轮子？
我们在尝试过几个排名较高的库之后发现，他们做的都太重了，并且无法满足关键词**断句**组合功能。(MySQL全文搜索有效关键词提取)

## 安装
```sh
$ npm i @feiye/pinyin
```

## 引入
```ts
import { pinyin, pinyinInitial, pinyinKeywords } from '@feiye/pinyin';
```

### 典型应用

汉子句子转换为拼音
```ts
pinyin("中华人民共和国 Peoples Republic of China");
// output: "zhong hua ren min gong he guo Peoples Republic of China"
```

首字母索引
```ts
pinyinInitial("中");
// output: "Z"
```

MySQL 数据库的原生全文搜索
```ts
pinyinKeywords("中华人民共和国abcde0123，hello电梯 维修工，从事T22维修20年h3c world");
// output:
[
  'zhonghua',
  'huaren',
  'renmin',
  'mingong',
  'gonghe',
  'heguo',
  'abcde0123',
  'hello',
  'dianti',
  'weixiu',
  'xiugong',
  'congshi',
  'T22',
  '20',
  'h3c',
  'world',
]
```
