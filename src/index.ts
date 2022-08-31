import data from './data';

type Type = 'pinyin' | 'word' | 'number' | 'wordnumber' | 'other';

interface Result {
  result: string;
  type: Type;
}

/**
 * 汉子转换为拼音对象
 */
export function pinyinObj(str: string) {
  if (!str) return [];
  const pinyin: Result[] = [];
  let result: string;
  let word = '';
  let number = '';
  let wordnumber = '';
  for (let i = 0; i <= str.length; i++) {
    let type: Type = 'other';

    const c = str.charCodeAt(i);
    const isNum = c >= 48 && c <= 57; // 48-57[0-9]
    const isAlp = c >= 97 && c <= 122; // 97-122[a-z]
    if (isNum || isAlp) {
      if (isNum) {
        number += str[i];
      }
      else if (isAlp) {
        word += str[i];
      }
      wordnumber += str[i];
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
      result = data[str[i]];
      type = 'pinyin';
    } else if (!result) {
      result = str[i];
      type = 'other';
    }

    result && pinyin.push({
      result,
      type,
    });

    result = '';
  }
  return pinyin;
}

/**
 * 字符串转换为拼音字符串
 * @param str 
 * @returns 
 */
export function pinyin(str: string) {
  return pinyinObj(str).filter(i => i.type !== 'other').map(i => i.result).join(' ');
}

/**
 * 字符提取拼音关键词
 * @param str 
 * @returns 结果是去重的
 */
export function pinyinKeywords(str: string) {
  const res = pinyinObj(str);
  const out = new Set();
  for (let p = 0; p < res.length; p++) {
    // 拼接拼音为词
    if (res[p].type === 'pinyin' && res[p + 1].type === 'pinyin') {
      out.add(res[p].result + res[p+1].result);
    } else if (res[p].type !== 'other' && res[p].type !== 'pinyin') {
      out.add(res[p].result);
    }
  }
  return Array.from(out);
}

// console.log(pinyinKeywords("中华人民共和国abcde0123，hello电梯 维修工，从事维修20年h3c world"))
