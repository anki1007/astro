/* Theme layer — remaps the original dark palette to Navy (#003366, default) or Light (#FFF5EE).
   Runs before any other script: rewrites stylesheet values, inline styles, SVG paint and canvas colours.
   Add data-src-light on the <script> tag for pages whose source palette is light. */
(function(){
 "use strict";
 var KEY="pt.theme",d=document,w=window,cur=d.currentScript,SRC_LIGHT=!!(cur&&cur.hasAttribute("data-src-light"));
 var mode;try{mode=localStorage.getItem(KEY)}catch(e){}
 if(mode!=="light")mode="navy";
 w.PT_THEME=mode;
 d.documentElement.setAttribute("data-pt-theme",mode);

 function clamp(v,a,b){return v<a?a:v>b?b:v}
 function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,h=0,s=0,dd=M-m;
  if(dd){s=l>.5?dd/(2-M-m):dd/(M+m);h=M===r?(g-b)/dd+(g<b?6:0):M===g?(b-r)/dd+2:(r-g)/dd+4;h*=60}return[h,s,l]}
 function hsl2rgb(h,s,l){function f(n){var k=(n+h/30)%12,a=s*Math.min(l,1-l);return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))}return[f(0),f(8),f(4)]}

 /* core mapping: [r,g,b] -> [r,g,b] */
 function mapRGB(r,g,b){
  var t=rgb2hsl(r,g,b),h=t[0],s=t[1],l=t[2],neutral=s<.35||l<.14||l>.92;
  if(SRC_LIGHT&&neutral)l=1-l;
  if(neutral){
   if(l<.28){ /* surfaces: page, panels, borders */
    if(mode==="navy")return hsl2rgb(210,l<.12?1:.7,clamp(.20+(l-.05)*.6,.17,.36));
    return hsl2rgb(25,l<.12?1:.55,clamp(.967-(l-.05)*.5,.80,.975));
   }
   /* text and muted text — kept high-contrast against the surface */
   if(mode==="navy")return hsl2rgb(210,.3,clamp(.82+(l-.28)*.35,.82,1));
   return hsl2rgb(215,.45,clamp(.30-(l-.28)*.45,.04,.30));
  }
  /* accents: keep hue, keep them readable on the new surface */
  if(mode==="navy")return hsl2rgb(h,s,Math.max(l,.68));
  return hsl2rgb(h,Math.min(1,s),Math.min(l,.34));
 }

 var cache=new Map();
 function hex2(n){return(n<16?"0":"")+n.toString(16)}
 function mapToken(tok){
  var c=cache.get(tok);if(c!==undefined)return c;
  var r,g,b,a=null,m,low=tok.toLowerCase(),out=tok;
  if(low==="white"){r=g=b=255}else if(low==="black"){r=g=b=0}
  else if(low[0]==="#"){var x=low.slice(1);
   if(x.length===3||x.length===4){r=parseInt(x[0]+x[0],16);g=parseInt(x[1]+x[1],16);b=parseInt(x[2]+x[2],16);if(x.length===4)a=parseInt(x[3]+x[3],16)/255}
   else if(x.length===6||x.length===8){r=parseInt(x.slice(0,2),16);g=parseInt(x.slice(2,4),16);b=parseInt(x.slice(4,6),16);if(x.length===8)a=parseInt(x.slice(6,8),16)/255}}
  else if((m=low.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,\/]+([\d.]+%?))?\s*\)$/))){r=+m[1];g=+m[2];b=+m[3];if(m[4]!=null)a=/%$/.test(m[4])?parseFloat(m[4])/100:+m[4]}
  if(r!=null&&!isNaN(r+g+b)){var o=mapRGB(r,g,b);
   out=a==null?"#"+hex2(o[0])+hex2(o[1])+hex2(o[2]):"rgba("+o[0]+","+o[1]+","+o[2]+","+(+a.toFixed(3))+")"}
  cache.set(tok,out);return out;
 }
 var RE=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|(?<![-\w])(?:white|black)(?![-\w])/g;
 function mapValue(v){if(!v||typeof v!=="string"||v.indexOf("url(")===0)return v;return v.replace(RE,mapToken)}
 w.ptThemeColor=mapValue;

 /* stylesheets via CSSOM — only declaration values, never selectors */
 var done=new WeakSet();
 function fixRules(rules){for(var i=0;i<rules.length;i++){var r=rules[i];
  if(r.style&&!(r.selectorText&&r.selectorText.indexOf(".pt-keep")>=0))for(var j=0;j<r.style.length;j++){var p=r.style[j],v=r.style.getPropertyValue(p),nv=mapValue(v);if(nv!==v)r.style.setProperty(p,nv,r.style.getPropertyPriority(p))}
  if(r.cssRules)fixRules(r.cssRules)}}
 function fixSheet(sh){if(!sh||done.has(sh))return;try{fixRules(sh.cssRules);done.add(sh)}catch(e){}}
 function fixSheets(){for(var i=0;i<d.styleSheets.length;i++)fixSheet(d.styleSheets[i])}

 /* inline style + SVG paint attributes */
 var ATTRS=["fill","stroke","stop-color","flood-color","color","bgcolor"];
 /* remember what we wrote so our own output is never remapped (light mode is not idempotent) */
 var wrote=new WeakMap();
 function fixAttr(el,name){var v=el.getAttribute(name);if(!v)return;var memo=wrote.get(el);if(memo&&memo[name]===v)return;
  var nv=mapValue(v);if(!memo){memo={};wrote.set(el,memo)}memo[name]=nv;if(nv!==v)el.setAttribute(name,nv)}
 function fixEl(el){
  if(el.nodeType!==1||(el.classList&&el.classList.contains("pt-keep")))return;
  fixAttr(el,"style");
  for(var i=0;i<ATTRS.length;i++)fixAttr(el,ATTRS[i]);
  if(el.tagName==="STYLE"&&el.sheet)fixSheet(el.sheet);
 }
 function fixTree(n){if(n.nodeType!==1)return;fixEl(n);var all=n.querySelectorAll("[style],[fill],[stroke],[stop-color],style");for(var i=0;i<all.length;i++)fixEl(all[i])}

 /* canvas: remap colours as they are assigned */
 function wrapProp(proto,prop){var dsc=Object.getOwnPropertyDescriptor(proto,prop);if(!dsc||!dsc.set)return;
  Object.defineProperty(proto,prop,{configurable:true,enumerable:dsc.enumerable,get:dsc.get,set:function(v){dsc.set.call(this,typeof v==="string"?mapValue(v):v)}})}
 if(w.CanvasRenderingContext2D){var P=CanvasRenderingContext2D.prototype;["fillStyle","strokeStyle","shadowColor"].forEach(function(p){wrapProp(P,p)})}
 if(w.CanvasGradient){var acs=CanvasGradient.prototype.addColorStop;CanvasGradient.prototype.addColorStop=function(o,c){return acs.call(this,o,typeof c==="string"?mapValue(c):c)}}

 /* meta tags */
 function fixMeta(){var cs=d.querySelector('meta[name="color-scheme"]');if(cs)cs.content=mode==="light"?"light":"dark";
  var tc=d.querySelector('meta[name="theme-color"]');if(tc)tc.content=mode==="light"?"#FFF5EE":"#003366"}

 /* switcher */
 function setTheme(m){try{localStorage.setItem(KEY,m)}catch(e){}location.reload()}
 w.ptSetTheme=setTheme;
 function addSwitch(){
  if(SRC_LIGHT||d.getElementById("ptTheme"))return;
  var b=d.createElement("button"),ref=d.getElementById("ptWide");
  b.id="ptTheme";b.type="button";b.title="Switch theme";b.setAttribute("aria-label","Switch theme");
  b.textContent=mode==="navy"?"◐ Light":"◑ Navy";
  b.onclick=function(){setTheme(mode==="navy"?"light":"navy")};
  if(ref&&ref.parentNode){b.className=ref.className;ref.parentNode.insertBefore(b,ref)}
  else{b.style.cssText="position:fixed;left:14px;bottom:16px;z-index:260;padding:7px 12px;border-radius:18px;font:12px sans-serif;cursor:pointer;border:1px solid "+(mode==="navy"?"#7fc1ee":"#c9b8aa")+";background:"+(mode==="navy"?"#004a7c":"#fff")+";color:"+(mode==="navy"?"#fff":"#1d2733");d.body.appendChild(b);
   var n=0,t=setInterval(function(){var r=d.getElementById("ptWide");if(r&&r.parentNode){clearInterval(t);b.style.cssText="";b.className=r.className;r.parentNode.insertBefore(b,r)}else if(++n>40)clearInterval(t)},250)}
 }

 new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];
  if(m.type==="attributes")fixEl(m.target);
  else for(var j=0;j<m.addedNodes.length;j++){var n=m.addedNodes[j];if(n.nodeType===1)fixTree(n);else if(n.parentNode&&n.parentNode.tagName==="STYLE")fixSheet(n.parentNode.sheet)}}
  fixSheets()}).observe(d.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["style","fill","stroke","stop-color"]});

 function boot(){fixSheets();fixTree(d.documentElement);fixMeta();addSwitch()}
 if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",boot);else boot();
 w.addEventListener("load",fixSheets);
})();
