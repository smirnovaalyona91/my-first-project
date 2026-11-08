import test from 'node:test';
import assert from 'node:assert/strict';
import {questStops,isCorrect,cleanProgress,score} from '../src/quest.js';
test('ответы нормализуют регистр, пробелы и ё, но не принимают неверный ответ',()=>{
 assert(isCorrect(questStops[2],'  ЗЕЛЕНЫЙ! '));
 assert(!isCorrect(questStops[0],'29'));
});
test('восстановление не открывает пропущенные этапы',()=>{
 assert.deepEqual(cleanProgress({completed:['cathedral']}),{started:false,completed:[],hints:[]});
 assert.equal(cleanProgress({completed:['panfilov','arbat']}).completed.length,1);
});
test('подсказки снижают баллы только за завершенные задания',()=>{
 assert.equal(score(cleanProgress({completed:questStops.map(s=>s.id),hints:['bazaar']})),370);
 assert.equal(score(cleanProgress({completed:['panfilov'],hints:['bazaar']})),100);
});
