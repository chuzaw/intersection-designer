(function(w){
function render(out){
var sc=60,pp=out.allPoints(),mnX=1e9,mxX=-1e9,mnY=1e9,mxY=-1e9;
for(var i=0;i<pp.length;i++){var p=pp[i];if(p.x<mnX)mnX=p.x;if(p.x>mxX)mxX=p.x;if(p.y<mnY)mnY=p.y;if(p.y>mxY)mxY=p.y}
var m=30,sw=(mxX-mnX)*sc+2*m,sh=(mxY-mnY)*sc+2*m,cx=m-mnX*sc,cy=m+mxY*sc;
function sx(x){return(cx+x*sc).toFixed(2)}function sy(y){return(cy-y*sc).toFixed(2)}
function pt(v){return sx(v.x)+","+sy(v.y)}function pts(a){var q="";for(var i=0;i<a.length;i++){q+=(i?" ":"")+pt(a[i])}return q}
function roundPath(a,r){if(a.length<3)return"M "+pts(a)+" Z";var bi=[],af=[];for(var i=0;i<a.length;i++){var p=a[(i-1+a.length)%a.length],c=a[i],n=a[(i+1)%a.length],v1x=p.x-c.x,v1y=p.y-c.y,v2x=n.x-c.x,v2y=n.y-c.y,l1=Math.sqrt(v1x*v1x+v1y*v1y),l2=Math.sqrt(v2x*v2x+v2y*v2y),co=(v1x*v2x+v1y*v2y)/(l1*l2);co=Math.max(-1,Math.min(1,co));var th=Math.acos(co),cut=r/Math.max(.15,Math.tan(th/2));cut=Math.min(cut,l1*.18,l2*.18);bi.push({x:c.x+v1x/l1*cut,y:c.y+v1y/l1*cut});af.push({x:c.x+v2x/l2*cut,y:c.y+v2y/l2*cut})}var d="M "+pt(af[0]);for(var i=0;i<a.length;i++){var j=(i+1)%a.length;d+=" L "+pt(bi[j])+" Q "+pt(a[j])+" "+pt(af[j])}return d+" Z"}
function surfacePath(roads,r,sm){var n=roads.length,cn=[];for(var i=0;i<n;i++){var j=(i+1)%n,a=roads[i].pts[3],b=roads[j].pts[0];if(sm&&sm.from==i&&sm.to==j){cn.push({type:"curve",before:a,after:b,c1:sm.c1,c2:sm.c2});continue}var dx=a.x-b.x,dy=a.y-b.y;if(Math.sqrt(dx*dx+dy*dy)>.01){cn.push({type:"line",before:a,after:b});continue}var v={x:(a.x+b.x)/2,y:(a.y+b.y)/2},pi=roads[i].pts[2],po=roads[j].pts[1],x1=pi.x-v.x,y1=pi.y-v.y,x2=po.x-v.x,y2=po.y-v.y,l1=Math.sqrt(x1*x1+y1*y1),l2=Math.sqrt(x2*x2+y2*y2),co=(x1*x2+y1*y2)/(l1*l2);co=Math.max(-1,Math.min(1,co));var th=Math.acos(co),cut=r/Math.max(.15,Math.tan(th/2));cut=Math.min(cut,l1*.18,l2*.18);cn.push({type:"round",v:v,before:{x:v.x+x1/l1*cut,y:v.y+y1/l1*cut},after:{x:v.x+x2/l2*cut,y:v.y+y2/l2*cut}})}var d="M "+pt(cn[n-1].after);for(var i=0;i<n;i++){var c=cn[i],p=roads[i].pts;d+=" L "+pt(p[1])+" L "+pt(p[2])+" L "+pt(c.before);if(c.type=="round")d+=" Q "+pt(c.v)+" "+pt(c.after);else if(c.type=="curve")d+=" C "+pt(c.c1)+" "+pt(c.c2)+" "+pt(c.after);else d+=" L "+pt(c.after)}return d+" Z"}
function seg(a,b){return" x1=\""+sx(a.x)+"\" y1=\""+sy(a.y)+"\" x2=\""+sx(b.x)+"\" y2=\""+sy(b.y)+"\""}
var o="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 "+sw.toFixed(1)+" "+sh.toFixed(1)+"\">";
o+="<style>.rd{fill:#6b7280;stroke:#4b5563;stroke-width:1.5}.ct{fill:#6b7280;stroke:none}.ln{stroke:#e5e7eb;stroke-width:1.8;stroke-linecap:round}.dy{stroke:#fbbf24;stroke-width:2.5}.stk{stroke:#fff;stroke-width:4}.cr{fill:#e5e7eb;stroke:#d1d5db;stroke-width:.8}.ri{fill:#fbbf24;stroke:#d99a0b;stroke-width:1.2}.lb{font:14px system-ui;font-weight:600;fill:#f8f9fa;text-anchor:middle;dominant-baseline:central}</style>";
o+="<path class=\"rd\" d=\""+surfacePath(out.roads,1.2,out.smoothConnection)+"\"/>"
;for(var i=0;i<out.divs.length;i++){var d=out.divs[i];o+="<line class=\"ln\" stroke-dasharray=\"6 6\""+seg(d.start,d.end)+"/>"}
for(var i=0;i<out.medians.length;i++){var d=out.medians[i];o+="<line class=\"dy\""+seg(d.start,d.end)+"/>"}
for(var i=0;i<out.xings.length;i++){var x=out.xings[i];o+="<polygon class=\"cr\" points=\""+pt(x.p1)+" "+pt(x.p2)+" "+pt(x.p3)+" "+pt(x.p4)+"\"/>"}
for(var i=0;i<out.islands.length;i++){var s=out.islands[i];if(s.type=="gap"){o+="<polygon class=\"rd\" points=\""+pts(s.pts)+"\"/>"}else{o+="<polygon class=\"ri\" points=\""+pts(s.pts)+"\"/>"}}
for(var i=0;i<out.stops.length;i++){var s=out.stops[i];o+="<line class=\"stk\""+seg(s.start,s.end)+"/>"}
for(var i=0;i<out.arrows.length;i++){var ar=out.arrows[i];var iw=3.25*0.5,ih=iw*3,iws=iw*sc,ihs=ih*sc;var scx=cx+ar.cx*sc,scy=cy-ar.cy*sc;var fn="images/"+ar.type+".gif";if(ar.type=="左右")fn="images/左右.png";o+="<image href=\""+fn+"\" x=\""+(scx-iws/2).toFixed(2)+"\" y=\""+(scy-ihs/2).toFixed(2)+"\" width=\""+iws.toFixed(2)+"\" height=\""+ihs.toFixed(2)+"\" transform=\"rotate("+ar.angle.toFixed(2)+" "+scx.toFixed(2)+" "+scy.toFixed(2)+")\"/>"}
for(var i=0;i<out.labels.length;i++){var l=out.labels[i];o+="<text class=\"lb\" x=\""+sx(l.x)+"\" y=\""+sy(l.y)+"\">"+l.text+"</text>"}
o+="</svg>";return o}
w.render=render;
})(this);
