import * as assert from 'assert';
import { pinyin, pinyinInitial, pinyinKeywords } from '../src/index';

describe('Model', function() {
  it('pinyin', async function() {
    assert.ok(pinyin("中华人民共和国 Peoples Republic of China") === "zhong hua ren min gong he guo Peoples Republic of China");
  });

  it('pinyinInitial', async function() {
    const res = pinyinInitial("中");
    assert.deepEqual(res, "Z");
  });

  it('pinyinKeywords', async function() {
    const res = pinyinKeywords("中华人民共和国abcde0123，hello电梯 维修工，从事T22维修20年h3c world");
    assert.deepEqual(res, [
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
    ]);
  });

  it('pinyinKeywords opt', async function() {
    const res = pinyinKeywords("中华人民 china abcd1234", { limit: 10, wordnumber: false });
    assert.deepEqual(res, [
      'zhonghua',
      'huaren',
      'renmin',
      'china',
    ]);
  });
});
