import places from '../data/places.json' with { type: 'json' };
export { places };
export const tags = ['nature','history','architecture','food','culture'];
export function distance(a,b) {
 const rad=x=>x*Math.PI/180, dlat=rad(b[0]-a[0]), dlng=rad(b[1]-a[1]);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dlng/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
export function preferences(input={}) {
 const duration=Number(input.duration??180), budget=Number(input.budget??5000);
 const interests=input.interests??['culture','history'];
 const mode=input.mode??'walk';
 const start=input.start??places[0].coordinates;
 if(!Number.isFinite(duration)||duration<30||duration>480||!Number.isFinite(budget)||budget<0||budget>1000000) throw new Error('Укажите длительность 30–480 минут и бюджет 0–1 000 000 ₸.');
 if(!Array.isArray(interests)||!interests.length||interests.some(t=>!tags.includes(t))||!['walk','transport'].includes(mode)) throw new Error('Выберите интересы и способ передвижения.');
 if(!Array.isArray(start)||start.length!==2||start.some(n=>typeof n!=='number'||!Number.isFinite(n))||start[0]<43.1||start[0]>43.4||start[1]<76.7||start[1]>77.15) throw new Error('Старт должен находиться в пределах Алматы (43.1–43.4, 76.7–77.15).');
 return {duration,budget,interests,mode,start};
}
export function plan(input) {
 const p=preferences(input); let current=p.start, used=0, cost=0, km=0;
 const remaining=places.filter(x=>!input.exclude?.includes(x.id)); const stops=[];
 while(remaining.length) {
  const ranked=remaining.map(place=>{
   const legKm=distance(current,place.coordinates)*1.35;
   const travelMinutes=Math.ceil(legKm/(p.mode==='walk'?4.5:18)*60)+(p.mode==='transport'?8:0);
   const legCost=p.mode==='transport'?300:0;
   const matches=place.tags.filter(t=>p.interests.includes(t));
   return {place,legKm,travelMinutes,legCost,matches,score:matches.length*25-travelMinutes};
  }).filter(x=>x.matches.length&&used+x.travelMinutes+x.place.visitMinutes<=p.duration&&cost+x.place.planningCost+x.legCost<=p.budget).sort((a,b)=>b.score-a.score);
  if(!ranked.length) break;
  const x=ranked[0]; used+=x.travelMinutes+x.place.visitMinutes; cost+=x.place.planningCost+x.legCost; km+=x.legKm;
  stops.push({...x.place,travelMinutes:x.travelMinutes,legKm:x.legKm,reasonTags:x.matches});
  current=x.place.coordinates; remaining.splice(remaining.findIndex(r=>r.id===x.place.id),1);
 }
 return {preferences:p,stops,totalMinutes:used,estimatedCost:cost,totalKm:Number(km.toFixed(1)),remainingMinutes:p.duration-used,disclaimer:'Демонстрационный маршрут. Координаты приблизительные, сведения не проверены. Линии соединяют точки и не являются навигацией. Время и расходы — плановые оценки, не тарифы. Возвращение к старту не включено.'};
}
