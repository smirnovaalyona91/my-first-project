import React,{useState} from 'react';
import PhotoGallery from './PhotoGallery';
export default function Places({places}){
 const [selected,setSelected]=useState('republic');const place=places.find(p=>p.id===selected);
 return <section className="places-browser" aria-label="Объекты города"><aside className="panel"><h2>Объекты Алматы</h2><nav aria-label="Выбор объекта">{places.map(p=><button type="button" key={p.id} aria-pressed={selected===p.id} onClick={()=>setSelected(p.id)}>{p.name}{p.photos?.length?' · '+p.photos.length+' фото':''}</button>)}</nav></aside><article className="panel">{place?<><div className="section-kicker">ОБЪЕКТ ГОРОДА</div><h2>{place.name}</h2><p>{place.summary}</p><PhotoGallery photos={place.photos} name={place.name}/><a href={place.source} target="_blank" rel="noreferrer">Показать на карте ↗</a></>:<p role="status">Загружаем объекты…</p>}</article></section>;
}
