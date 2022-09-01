import data from './data';

type Type = 'pinyin' | 'word' | 'number' | 'wordnumber' | 'other';

interface Result {
  result: string;
  type: Type;
}

interface Option {
  /**
   * 解析拼音
   * @default true
   */
  pinyin?: boolean;

  /**
   * 解析单词
   * @default true
   */
  word?: boolean;

  /**
   * 解析数字
   * @default true
   */
  number?: boolean;

  /**
   * 解析单词数字的组合
   * @default true
   */
  wordnumber?: boolean;

  /**
   * 保留其他字符
   * @default true
   */
  other?: boolean;

  /**
   * 数量限制
   * @default 0 无限制
   */
  limit?: number;
}

/**
 * 汉子转换为拼音对象
 */
export function pinyinObj(str: string, opt?: Option) {
  if (!str) return [];
  opt = Object.assign({
    pinyin: true,
    word: true,
    number: true,
    wordnumber: true,
    other: true,
  }, opt);
  const pinyin: Result[] = [];

  let word = '';
  let number = '';
  let wordnumber = '';
  for (let i = 0; i <= str.length; i++) {
    let result: string;
    let type: Type = 'other';

    const c = str.charCodeAt(i);
    const isNum = c >= 48 && c <= 57; // 48-57[0-9]
    const isAlp = (c >= 65 && c <= 90) || c >= 97 && c <= 122; // 65-90[A-Z] 97-122[a-z]
    if (isNum || isAlp) {
      if (opt.number && isNum) {
        number += str[i];
      }
      else if (opt.word && isAlp) {
        word += str[i];
      }
      if (opt.wordnumber) {
        wordnumber += str[i];
      }
      continue;
    }

    if (word && number) {
      result = wordnumber;
      type = 'wordnumber';
    }
    else if (word) {
      result = word;
      type = 'word';
    }
    else if (number) {
      result = number;
      type = 'number';
    }

    if (result) {
      pinyin.push({
        result,
        type,
      });
      result = '';
    }

    word = '';
    number = '';
    wordnumber = '';

    if (str[i] in data) {
      if (opt.pinyin) {
        result = data[str[i]];
        type = 'pinyin';
      }
    } else if (opt.other && !result) {
      result = str[i];
      type = 'other';
    }

    result && pinyin.push({
      result,
      type,
    });

    if (opt.limit && pinyin.length >= opt.limit) {
      break;
    }
  }
  return pinyin;
}

/**
 * 字符串转换为拼音字符串
 * @param str 
 * @returns 
 */
export function pinyin(str: string, opt?: Option) {
  return pinyinObj(str, opt).filter(i => i.type !== 'other').map(i => i.result).join(' ');
}

/**
 * 取得首字母
 * 注意：如果参数为字符串也只会返回首字母
 * @param str 字符
 */
export function pinyinInitial(str: string) {
  const res = pinyinObj(str, {
    other: false,
    limit: 1,
  });
  if (res.length) {
    return res[0].result[0].toUpperCase();
  }
  return null;
}

/**
 * 字符提取拼音关键词
 * @param str 
 * @returns 结果是去重的
 */
export function pinyinKeywords(str: string, opt?: Option) {
  const res = pinyinObj(str, opt);
  const out = new Set<string>();
  for (let p = 0; p < res.length; p++) {
    const type = res[p].type;
    // 拼接前后拼音为词
    if (type === 'pinyin' && res[p + 1]?.type === 'pinyin') {
      out.add(res[p].result + res[p+1].result);
    } else if (type === 'word' || type === 'number' || type === 'wordnumber') {
      out.add(res[p].result);
    }
  }
  return Array.from(out);
}

// console.log(pinyinKeywords("中华人民共和国abcde0123，hello电梯 维修工，从事T22维修20年h3c world"))
