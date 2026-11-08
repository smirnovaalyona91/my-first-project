export const questStops = [
 {id:'panfilov',title:'Начало расследования',riddle:'В названии этого парка спрятано число. Найдите его на указателе. Сколько гвардейцев упомянуто?',answers:['28','двадцать восемь'],hint:'Ищите полное название парка на информационном указателе.',story:'Начните с указателя парка. Оглянитесь, выберите удобную дорожку и найдите ориентир для следующей остановки — Вознесенский собор.'},
 {id:'cathedral',title:'Архитектурный шифр',riddle:'Найдите название собора на информационной табличке. Введите первое слово его названия.',answers:['вознесенский','вознесенский собор'],hint:'Название начинается на «Воз…».',story:'Осмотрите собор снаружи. Рассмотрите цвета фасада, форму окон и детали кровли. Выберите одну деталь, которую раньше не замечали.'},
 {id:'bazaar',title:'Цвет города',riddle:'Следующая остановка — базар. Какой цвет дал ему название?',answers:['зелёный','зеленый'],hint:'Это цвет листвы в тёплое время года.',story:'Вы у Зелёного базара. Прислушайтесь к звукам улицы, рассмотрите вывески и понаблюдайте за городской жизнью. Для выполнения задания заходить внутрь и делать покупки не нужно.'},
 {id:'arbat',title:'Последнее слово',riddle:'Вы на пешеходной улице Жибек Жолы. Какое неофициальное название этой прогулочной части города совпадает с названием известной московской улицы?',answers:['арбат','алматинский арбат'],hint:'Пять букв, первая — «А».',story:'Финальная остановка — Арбат. Найдите интересную деталь улицы: вывеску, рисунок или витрину. Сохраните её на память и завершите своё знакомство с этим маршрутом.'}
];
export const normalizeAnswer = value => value.toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[.,!?«»"']/g,'').trim().replace(/\s+/g,' ');
export function isCorrect(stop, answer){return stop.answers.some(a=>normalizeAnswer(a)===normalizeAnswer(answer));}
export function cleanProgress(value){
 const completed=[],hints=[];
 for(const stop of questStops){if(!value?.completed?.includes(stop.id))break;completed.push(stop.id);}
 for(const stop of questStops)if(value?.hints?.includes(stop.id))hints.push(stop.id);
 return {started:value?.started===true||completed.length>0,completed,hints};
}
export function score(progress){return progress.completed.reduce((sum,id)=>sum+(progress.hints.includes(id)?70:100),0);}
