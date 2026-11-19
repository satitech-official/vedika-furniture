'use client';
import {useEffect,useRef,useState} from 'react';
// This is an interactive, scale-illustrative 3D room concept, not reconstruction from a single photograph.
export default function Room3D({type='living',finish='walnut'}){
 const ref=useRef(null),[error,setError]=useState('');
 useEffect(()=>{let disposed=false,renderer,scene,camera,frame,resizeObserver;const host=ref.current;
 (async()=>{try{const THREE=await import('three');if(disposed)return;
 const w=Math.max(host.clientWidth,260),h=390;
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
 scene=new THREE.Scene();scene.background=new THREE.Color('#eee7da');
 camera=new THREE.PerspectiveCamera(43,w/h,.1,100);
 const ambient=new THREE.AmbientLight(0xffffff,2.3);scene.add(ambient);
 const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-3,6,7);scene.add(sun);
 function box(x,y,z,sx,sy,sz,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),new THREE.MeshStandardMaterial({color,roughness:.83}));mesh.position.set(x,y,z);scene.add(mesh);return mesh}
 const wood=finish==='sage'?'#879b8b':finish==='oak'?'#be956a':'#795139';const fabric=finish==='sage'?'#bac7bb':'#ded0b8';
 box(0,-.075,0,6,.15,6,'#d6bda1');box(0,1.35,-3,.11,2.8,6,'#f1e9dc');box(-3,1.35,0,6,2.8,.11,'#f1e9dc');
 // Window & art on back wall
 box(1.7,1.8,-2.9,1.4,1.3,.05,'#b7c6c0');box(1.7,1.8,-2.86,1.45,.07,.08,'#f6f1e7');box(1.7,1.8,-2.86,.06,1.35,.08,'#f6f1e7');
 if(type==='bedroom'){
  box(0,.32,-.35,2.55,.45,2.7,fabric);box(0,.32,-1.6,2.65,.8,.22,wood);box(-1.15,.17,-.3,.2,.34,2.3,wood);box(1.15,.17,-.3,.2,.34,2.3,wood);
  box(-1.85,.42,-1.15,.75,.7,.7,wood);box(1.85,.42,-1.15,.75,.7,.7,wood);box(-.6,.59,-1.25,.7,.09,.55,'#f8f1e6');box(.6,.59,-1.25,.7,.09,.55,'#f8f1e6');
 }else if(type==='dining'){
  box(0,.8,0,2.5,.16,1.45,wood);box(-.9,.4,-.52,.14,.8,.14,wood);box(.9,.4,.52,.14,.8,.14,wood);box(-.9,.4,.52,.14,.8,.14,wood);box(.9,.4,-.52,.14,.8,.14,wood);
  for(const [x,z] of [[-1.9,0],[1.9,0],[0,-1.45],[0,1.45]]){box(x,.48,z,.66,.14,.62,fabric);box(x,.82,z-.25,.66,.82,.13,wood);box(x,.23,z,.08,.5,.08,wood)}
 }else{
  box(0,.36,-1.12,2.95,.62,1.15,fabric);box(0,.93,-1.68,3,.85,.27,fabric);box(-1.45,.72,-1.18,.3,.7,1.18,wood);box(1.45,.72,-1.18,.3,.7,1.18,wood);
  box(0,.38,.85,1.35,.15,.8,wood);for(const x of [-.55,.55])for(const z of [.55,1.13])box(x,.18,z,.1,.4,.1,wood);
  box(-2,.6,1.1,.65,.13,.7,fabric);box(-2,.97,.78,.65,.65,.15,wood);
 }
 // Rug and greenery
 box(0,.008,0,3.9,.014,3.5,'#e8dfd0');box(2.35,.28,-1.7,.5,.55,.5,wood);
 const plant=new THREE.Mesh(new THREE.ConeGeometry(.42,1.25,8),new THREE.MeshStandardMaterial({color:'#63775d'}));plant.position.set(2.35,1.1,-1.7);scene.add(plant);
 let az=.8,el=.56,radius=9.5,down=false,px=0,py=0;
 function updateCamera(){camera.position.set(radius*Math.sin(az)*Math.cos(el),radius*Math.sin(el),radius*Math.cos(az)*Math.cos(el));camera.lookAt(0,.7,0)}
 updateCamera();
 const elcanvas=renderer.domElement;elcanvas.style.cssText='width:100%;height:390px;touch-action:none;cursor:grab;border-radius:20px';
 const start=e=>{down=true;px=e.clientX;py=e.clientY;elcanvas.setPointerCapture(e.pointerId);elcanvas.style.cursor='grabbing'};
 const move=e=>{if(!down)return;az+=(e.clientX-px)*.008;el=Math.max(.12,Math.min(1.2,el+(e.clientY-py)*.006));px=e.clientX;py=e.clientY;updateCamera()};
 const end=()=>{down=false;elcanvas.style.cursor='grab'};const wheel=e=>{e.preventDefault();radius=Math.max(6,Math.min(15,radius+e.deltaY*.01));updateCamera()};
 elcanvas.addEventListener('pointerdown',start);elcanvas.addEventListener('pointermove',move);elcanvas.addEventListener('pointerup',end);elcanvas.addEventListener('pointercancel',end);elcanvas.addEventListener('wheel',wheel,{passive:false});
 function tick(){frame=requestAnimationFrame(tick);renderer.render(scene,camera)}tick();
 resizeObserver=new ResizeObserver(()=>{if(!host.isConnected)return;const nw=Math.max(260,host.clientWidth);camera.aspect=nw/h;camera.updateProjectionMatrix();renderer.setSize(nw,h)});resizeObserver.observe(host);
 }catch(e){if(!disposed)setError('Interactive 3D could not load. Please refresh or use a newer browser.')}})();
 return()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver?.disconnect();renderer?.dispose();renderer?.domElement?.remove()};
 },[type,finish]);
 return <div><div ref={ref} className="room3d-canvas" aria-label="Interactive 3D furniture concept; drag to rotate, scroll to zoom"/>{error&&<p role="alert">{error}</p>}<p className="small-note">Drag to rotate · Scroll/pinch to zoom on supported devices. Illustrative 3D furniture only; not a measured replica of your room or actual Vedika product models.</p></div>
}
