import express from 'express';
import {plan,places} from './planner.js';
import {guide} from './guide.js';
const app=express(); app.disable('x-powered-by'); app.use(express.json({limit:'16kb'}));
const requests=new Map();
app.use('/api',(req,res,next)=>{const now=Date.now(),key=req.ip; const entry=requests.get(key);if(requests.size>10000)requests.clear(); const value=entry&&now-entry.time<60000?entry:{time:now,count:0};requests.set(key,value);if(++value.count>40)return res.status(429).json({error:'Слишком много запросов. Попробуйте через минуту.'});next();});
app.get('/api/health',(_,res)=>res.json({ok:true,guideMode:process.env.GUIDE_API_KEY?'ai':'demo'}));
app.get('/api/places',(_,res)=>res.json(places));
app.post('/api/route',(req,res,next)=>{try{if(req.body.exclude!==undefined&&(!Array.isArray(req.body.exclude)||req.body.exclude.some(x=>typeof x!=='string')))throw new Error('Неверный список исключений.');res.json(plan(req.body));}catch(e){next(e);}});
app.post('/api/chat',async(req,res,next)=>{try{res.json(await guide(req.body));}catch(e){next(e);}});
app.use('/api',(_,res)=>res.status(404).json({error:'Неизвестный API-метод.'}));
app.use((err,req,res,next)=>res.status(400).json({error:err.type==='entity.too.large'?'Запрос слишком большой.':err.message||'Некорректный запрос.'}));
if(process.env.NODE_ENV==='production')app.use(express.static('dist'));
else {const {createServer}=await import('vite'); const vite=await createServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
const port=Number(process.env.PORT)||3000;app.listen(port,'0.0.0.0',()=>console.log(`Almaty guide listening on port ${port}`));
