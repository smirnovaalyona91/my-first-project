import React,{useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export default function Map({route,selected,onSelect}){
 const element=useRef(),map=useRef(),layer=useRef();const [error,setError]=useState(false);
 useEffect(()=>{map.current=L.map(element.current,{scrollWheelZoom:false}).setView([43.253,76.947],14);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).on('tileerror',()=>setError(true)).addTo(map.current);
 layer.current=L.layerGroup().addTo(map.current);return()=>{map.current.remove();};},[]);
 useEffect(()=>{if(!map.current||!route)return;layer.current.clearLayers();const points=[route.preferences.start,...route.stops.map(x=>x.coordinates)];
 L.polyline(points,{color:'#237260',weight:4,dashArray:'7 9'}).addTo(layer.current);
 L.circleMarker(points[0],{radius:7,color:'#fff',fillColor:'#283e50',fillOpacity:1}).bindTooltip('Старт').addTo(layer.current);
 route.stops.forEach((p,i)=>{const content=document.createElement('div');const title=document.createElement('strong');title.textContent=p.name;content.append(title,document.createElement('br'),document.createTextNode(`${p.visitMinutes} мин · демонстрационные данные`));
 const marker=L.marker(p.coordinates,{icon:L.divIcon({className:'number-pin'+(selected===p.id?' active':''),html:`<span><b>${i+1}</b></span>`,iconSize:[32,32],iconAnchor:[16,32]})}).bindPopup(content).on('click',()=>onSelect(p.id)).addTo(layer.current);if(selected===p.id)marker.openPopup();});
 if(points.length>1)map.current.fitBounds(L.latLngBounds(points),{padding:[45,45],maxZoom:16});else map.current.setView(points[0],14);
 },[route,selected]);
 return <div className="map-shell"><div ref={element} className="map" aria-label="Интерактивная карта маршрута"/>{error&&<div className="map-error" role="status">Подложка карты недоступна. Точки и список маршрута доступны; повторите загрузку позже.</div>}<div className="map-note">Пунктир — порядок остановок, не пешеходная навигация</div></div>;
}
