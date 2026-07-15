(function(w){
var V=w.Vec2,lnI=w.lnI,lnH=w.lnH,R=w.RoadArm;
var LW=3.25,MW=0.4;
function RG(a){this.arm=a;this.inW=a.inLanes*LW;this.outW=a.outLanes*LW;this.totalW=this.inW+this.outW+MW;
var rad=a.angle*Math.PI/180;this.dir=new V(Math.cos(rad),Math.sin(rad));this.d=this.dir;
this.perp=this.dir.perp();this.lp=this.perp;
this.inLO=this.perp.scale(MW/2);this.inRO=this.perp.scale(MW/2+this.inW);
this.outLO=this.perp.scale(-(this.outW+MW/2));this.outRO=this.perp.scale(-MW/2);}
RG.prototype.pa=function(po,dd){return this.perp.scale(po).add(this.dir.scale(dd))};
RG.prototype.inArrow=function(ad,al,idx,at){var lp=this.inCenter(idx);var ct=this.pa(lp,ad+al*0.5);var ang=Math.atan2(Math.sin(this.arm.angle*Math.PI/180),-Math.cos(this.arm.angle*Math.PI/180))*180/Math.PI+90;return{cx:ct.x,cy:ct.y,angle:ang,type:at}};
RG.prototype.outArrow=function(ad,al,idx){var lp=this.outCenter(idx),ct=this.pa(lp,ad+al*0.5);return{cx:ct.x,cy:ct.y,angle:90-this.arm.angle,type:"直行"}};
RG.prototype.inCenter=function(i){return MW/2+LW/2+i*LW};
RG.prototype.outCenter=function(i){return-(MW/2+LW/2+i*LW)};
RG.prototype.outDiv=function(i){return-(MW/2+(i+1)*LW)};
RG.prototype.inDiv=function(i){return MW/2+(i+1)*LW};
RG.prototype.stopLine=function(sd){return{start:this.inLO.add(this.perp.scale(.1)).add(this.dir.scale(sd)),end:this.inRO.add(this.dir.scale(sd))}};
RG.prototype.xings=function(cd,cw,bw,bg){var s=[],rw=this.totalW,left=-(this.outW+MW/2),n=Math.max(1,Math.floor((rw+bg)/(bw+bg))),span=n*bw+(n-1)*bg,so=left+(rw-span)/2;for(var si=0;si<n;si++){var x=so+si*(bw+bg);s.push({p1:this.pa(x,cd),p2:this.pa(x+bw,cd),p3:this.pa(x+bw,cd+cw),p4:this.pa(x,cd+cw)})}return s};
RG.prototype.refuge=function(cd,cw,rw,over){if(rw<=0)return null;var hw=rw*0.5;return[this.pa(-hw,cd-over),this.pa(hw,cd-over),this.pa(hw,cd+cw+over),this.pa(-hw,cd+cw+over)]};
RG.prototype.twoGap=function(cd,cw,rw,over,clear){var hw=rw*0.5+clear;return[this.pa(-hw,cd-over-clear),this.pa(hw,cd-over-clear),this.pa(hw,cd+cw+over+clear),this.pa(-hw,cd+cw+over+clear)]};
RG.prototype.chan=function(){var cl=LW,hw=MW/2+this.inW;return[this.pa(hw,0),this.pa(hw-LW,LW*0.2),this.pa(hw,cl)]};
RG.prototype.label=function(d){var p=this.pa(this.inW+MW/2+1.8,d),a=-this.arm.angle;while(a<-90)a+=180;while(a>90)a-=180;return{x:p.x,y:p.y,angle:a}};
function IG(rgs){this.rgs=rgs.slice().sort(function(a,b){return a.arm.angle-b.arm.angle})}
IG.prototype.faces=function(){var rgs=this.rgs,n=rgs.length,fs=[];
for(var i=0;i<n;i++){var rg=rgs[i],p=rgs[(i-1+n)%n],nx=rgs[(i+1)%n];
var lr=lnI(p.inRO,p.d,rg.outLO,rg.d);if(!lr){for(var k=2;k<n;k++){var idx=((i-k)%n+n)%n;lr=lnI(rgs[idx].inRO,rgs[idx].d,rg.outLO,rg.d);if(lr)break}}
var rr=lnI(rg.inRO,rg.d,nx.outLO,nx.d);if(!rr){for(var k=2;k<n;k++){var idx=(i+k)%n;rr=lnI(rg.inRO,rg.d,rgs[idx].outLO,rgs[idx].d);if(rr)break}}
if(!lr||!rr)throw"arm "+rg.arm.name+" fail";fs.push({rg:rg,li:lr.p,ri:rr.p})}return fs};
function defA(n){if(n<=0)return[];if(n==1)return[{t:"through",a:"直行"}];if(n==2)return[{t:"left",a:"左转"},{t:"right",a:"右转"}];var a=[{t:"left",a:"左转"}];for(var i=1;i<n-1;i++)a.push({t:"through",a:"直行"});a.push({t:"right",a:"右转"});return a}
IG.prototype.build=function(L,cc){var fs=this.faces(),rgs=this.rgs,n=rgs.length;
var iv=[],tSmooth=null;for(var f=0;f<fs.length;f++){if(!has(iv,fs[f].li))iv.push(fs[f].li);if(!has(iv,fs[f].ri))iv.push(fs[f].ri)}iv.sort(function(a,b){return Math.atan2(a.y,a.x)-Math.atan2(b.y,b.x)});function has(a,p){for(var i=0;i<a.length;i++){if(Math.abs(a[i].x-p.x)<.001&&Math.abs(a[i].y-p.y)<.001)return true}return false}
if(n==3){var gi=0,gg=-1;for(var g=0;g<n;g++){var ga=rgs[g].arm.angle,gb=rgs[(g+1)%n].arm.angle+(g==n-1?360:0),gd=gb-ga;if(gd>gg){gg=gd;gi=g}}if(gg>=150){var gn=(gi+1)%n,oldA=fs[gn].li,oldB=fs[gi].ri,tr=4,pA=rgs[gi].inRO.add(rgs[gi].d.scale(tr)),pB=rgs[gn].outLO.add(rgs[gn].d.scale(tr)),dd=pB.sub(pA),dl=Math.sqrt(dd.x*dd.x+dd.y*dd.y)/3,c1=pA.sub(rgs[gi].d.scale(dl)),c2=pB.sub(rgs[gn].d.scale(dl)),nv=[],ia=-1,ib=-1;tSmooth={from:gi,to:gn,c1:c1,c2:c2};function eq(a,b){return Math.abs(a.x-b.x)<.001&&Math.abs(a.y-b.y)<.001}function bz(t){var u=1-t;return pA.scale(u*u*u).add(c1.scale(3*u*u*t)).add(c2.scale(3*u*t*t)).add(pB.scale(t*t*t))}for(var q=0;q<iv.length;q++){if(eq(iv[q],oldA))ia=q;if(eq(iv[q],oldB))ib=q}if(ia>=0&&ib>=0&&(ia+1)%iv.length==ib){for(var q=(ib+1)%iv.length;q!=ia;q=(q+1)%iv.length)nv.push(iv[q]);nv.push(pA,bz(.2),bz(.4),bz(.6),bz(.8),pB);iv=nv}else if(ia>=0&&ib>=0&&(ib+1)%iv.length==ia){for(var q=(ia+1)%iv.length;q!=ib;q=(q+1)%iv.length)nv.push(iv[q]);nv.push(pB,bz(.8),bz(.6),bz(.4),bz(.2),pA);iv=nv}}}
var cw=3,bw=.45,bg=.45,centerGap=2.5,stopGap=1.5,arrowGap=2,al=4,globalTs=!!(cc&&(cc.twoStage||cc.ts)),refW=1.2,refOver=.3,refClear=.12;
var out={innerPolygon:iv,roads:[],smoothConnection:tSmooth,divs:[],medians:[],stops:[],xings:[],islands:[],arrows:[],labels:[]};
for(var f=0;f<fs.length;f++){
var rg=fs[f].rg,arm=rg.arm,li=fs[f].li,ri=fs[f].ri;
var nX=arm.crosswalk,ts=arm.twoStage==null?(arm.refugeIsland||globalTs):arm.twoStage;
var centerEdge=-1e9;for(var vi=0;vi<iv.length;vi++){var vd=iv[vi].x*rg.d.x+iv[vi].y*rg.d.y;if(vd>centerEdge)centerEdge=vd}
var cd=Math.max(10,centerEdge+centerGap),sd=cd+cw+stopGap,ad=sd+arrowGap;
var roadLi=tSmooth&&f==tSmooth.to?pB:li,roadRi=tSmooth&&f==tSmooth.from?pA:ri;
out.roads.push({pts:[roadLi,rg.outLO.add(rg.d.scale(L)),rg.inRO.add(rg.d.scale(L)),roadRi],arm:arm});
for(var j=0;j<arm.outLanes-1;j++){var o=rg.pa(rg.outDiv(j),sd);out.divs.push({start:o,end:rg.pa(rg.outDiv(j),L),type:"out"})}
for(var j=0;j<arm.inLanes-1;j++){var o=rg.pa(rg.inDiv(j),sd);out.divs.push({start:o,end:rg.pa(rg.inDiv(j),L),type:"in"})}
var mL=rg.pa(-MW/2,L),mR=rg.pa(MW/2,L);
out.medians.push({start:mL,end:rg.pa(-MW/2,sd)},{start:mR,end:rg.pa(MW/2,sd)});
out.stops.push(rg.stopLine(sd));
if(nX){var xs=rg.xings(cd,cw,bw,bg);for(var si=0;si<xs.length;si++)out.xings.push(xs[si]);if(ts){out.islands.push({pts:rg.twoGap(cd,cw,refW,refOver,refClear),type:"gap"});var ri2=rg.refuge(cd,cw,refW,refOver);if(ri2)out.islands.push({pts:ri2,type:"refuge"})}}
for(var li2=0;li2<arm.inLanes;li2++){var at=(arm.inLaneArrows||[])[li2];if(!at){var d=defA(arm.inLanes)[li2];at=d?d.a:""}if(!at||at=="none")continue;out.arrows.push(rg.inArrow(ad,al,li2,at))}
for(var lo2=0;lo2<arm.outLanes;lo2++)out.arrows.push(rg.outArrow(ad,al,lo2));
var lp=rg.label(L*0.68);out.labels.push({x:lp.x,y:lp.y,angle:lp.angle,text:arm.name})}
out.allPoints=function(){var p=[].concat(iv);for(var i=0;i<out.roads.length;i++){for(var j=0;j<out.roads[i].pts.length;j++)p.push(out.roads[i].pts[j])}
for(var i=0;i<out.divs.length;i++){p.push(out.divs[i].start,out.divs[i].end)}for(var i=0;i<out.medians.length;i++){p.push(out.medians[i].start,out.medians[i].end)}
for(var i=0;i<out.xings.length;i++){var x=out.xings[i];p.push(x.p1,x.p2,x.p3,x.p4)}for(var i=0;i<out.islands.length;i++){for(var j=0;j<out.islands[i].pts.length;j++)p.push(out.islands[i].pts[j])}
for(var i=0;i<out.stops.length;i++){p.push(out.stops[i].start,out.stops[i].end)}for(var i=0;i<out.labels.length;i++)p.push(out.labels[i]);return p};
return out};
w.RoadGeometry=RG;w.IntersectionGeometry=IG;
})(this);
