import React,{useState,useRef,useEffect} from 'react';
export default function PhotoGallery({photos=[],name}){
 const [index,setIndex]=useState(0);const dialog=useRef();
 useEffect(()=>{setIndex(0);dialog.current?.close();},[photos]);
 if(!photos.length)return null;
 const photo=photos[index];
 function move(delta){setIndex(i=>(i+delta+photos.length)%photos.length);}
 return <section className="object-gallery" aria-label={'Фотографии: '+name}>
 <h4>Фотографии · {photos.length}</h4><div className="photo-thumbnails">{photos.map((p,i)=><button type="button" key={p.src} onClick={()=>{setIndex(i);dialog.current.showModal();}} aria-label={'Открыть фото '+(i+1)+' из '+photos.length+': '+name}><img src={p.src} alt={p.alt} loading="lazy" width="160" height="110"/></button>)}</div>
 <dialog className="photo-dialog" ref={dialog} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}} aria-label={'Просмотр фотографий: '+name}><div className="photo-dialog-head"><span>{name} · {index+1} / {photos.length}</span><button type="button" onClick={()=>dialog.current.close()} aria-label="Закрыть фото">✕</button></div><img src={photo.src} alt={photo.alt}/><div className="photo-controls"><button type="button" onClick={()=>move(-1)} aria-label="Предыдущее фото">← Назад</button><button type="button" onClick={()=>move(1)} aria-label="Следующее фото">Далее →</button></div></dialog></section>;
}
