import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1050}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('button',{name:'Составить маршрут'}).click();
 await page.getByText('Ваш маленький побег').waitFor();
 assert.ok(await page.locator('.stop').count()>0);const before=await page.locator('.stats strong').first().innerText();
 await page.getByRole('button',{name:'Сделай короче',exact:false}).click();
 await page.getByText('ИЗМЕНЕНИЕ МАРШРУТА',{exact:true}).waitFor();
 assert.ok(Number(await page.locator('.stats strong').first().innerText())<=Number(before));
 await page.getByRole('button',{name:'Бесплатно',exact:false}).click();await page.waitForFunction(()=>document.querySelectorAll('.message.guide').length>=3);
 assert.equal(await page.locator('.stats strong').nth(2).innerText(),'0 ₸');
 await page.locator('.stop-number').first().click();await page.locator('.leaflet-popup').waitFor();
 await page.screenshot({path:'/tmp/almaty-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/almaty-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 const invalid=await page.request.post(base+'/api/route',{data:{start:[0,0]}});assert.equal(invalid.status(),400);
 const health=await page.request.get(base+'/api/health');assert.equal((await health.json()).ok,true);
 assert.deepEqual(errors,[]);console.log('PASS: route, shortening, zero budget, map popup, mobile width, API validation; no browser errors');
}finally{await browser.close();}
