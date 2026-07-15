// ========================================
// Model Layer: pure data ONLY
// RoadArm = full road (inbound + outbound)
// ========================================
+(function(w){
function RoadArm(j){
  this.id=j.id||'';this.name=j.name||'';
  this.angle=j.angle||0;
  this.inLanes=j.inLanes||j.iL||0;
  this.outLanes=j.outLanes||j.oL||0;
  this.channelization=j.channelization||false;
  this.crosswalk=j.crosswalk!==false;
  this.refugeIsland=j.refugeIsland||j.ri||false;
this.twoStage=j.twoStage!=null?!!j.twoStage:(j.ts!=null?!!j.ts:null);
this.inLaneArrows=j.inLaneArrows||j.iA||[];
}
w.RoadArm=RoadArm;
})(this);
