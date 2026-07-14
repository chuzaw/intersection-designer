// ========================================
// Vec2: 2D vector math
// ========================================
(function(w){
function Vec2(x,y){this.x=x;this.y=y}
Vec2.prototype.add=function(v){return new Vec2(this.x+v.x,this.y+v.y)};
Vec2.prototype.sub=function(v){return new Vec2(this.x-v.x,this.y-v.y)};
Vec2.prototype.scale=function(s){return new Vec2(this.x*s,this.y*s)};
Vec2.prototype.cross=function(v){return this.x*v.y-this.y*v.x};
Vec2.prototype.perp=function(){return new Vec2(-this.y,this.x)};
// line-line intersection
function lnI(p1,d1,p2,d2){var dn=d1.cross(d2);if(Math.abs(dn)<1e-10)return null;var t=(p2.sub(p1)).cross(d2)/dn;return{p:p1.add(d1.scale(t)),t:t}}
// segment-line intersection
function lnH(A,B,O,D){var S=B.sub(A);var dn=D.cross(S);if(Math.abs(dn)<1e-10)return null;var t=(A.sub(O)).cross(S)/dn;var s=(A.sub(O)).cross(D)/dn;if(s<-1e-8||s>1+1e-8)return null;return{p:O.add(D.scale(t)),t:t,s:s}}
w.Vec2=Vec2;w.lnI=lnI;w.lnH=lnH;
})(this);
