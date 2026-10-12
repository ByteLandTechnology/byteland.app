/* E3 final film. Layout only: the accepted logo fields, angular phase and intro are unchanged. */
(function(scope){
 'use strict';
 const D=scope.ByteLandDesign;
 const baseState=D.stateAt,basePhase=D.phaseAt;
 const active=(v,m,f)=>v===1&&m===4&&f===11;
 const lerp=(a,b,u)=>a+(b-a)*u;
 const blend=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];
 D.FILM_DURATION=18;
 D.isFinalSequence=active;
 D.durationFor=(v=1,m=4,f=11)=>active(v,m,f)?18:D.DURATION;
 D.stateAt=function(t,width,height,variant=0,dock=0,motion=0,font=0){
  const s=baseState(t,width,height,variant,dock,motion,font);
  if(!active(variant,motion,font)||t<=7.2||dock>0)return s;
  const initial=baseState(7.2,width,height,variant,0,motion,font);
  const small=width<600,cornerScale=Math.min(small?.53:.59,(width-48)/160);
  const corner=[24+67*cornerScale,small?54:62];
  const endScale=Math.min(1.35,width*.004,height*.0031);
  const endCenter=[width*.5,height*.37];
  const endWordScale=Math.min(width*(small?.83:.72),720)/672;
  const endWordOrigin=[(width-672*endWordScale)*.5,endCenter[1]+67*endScale+Math.min(28,height*.055)];
  if(t<13){
   const move=D.ramp(t,7.2,10.2),retract=1-D.ramp(t,7.2,9.3);
   s.center=blend(initial.center,corner,move);s.logoScale=lerp(initial.logoScale,cornerScale,move);
   s.wordScale=initial.wordScale;s.wordOrigin=[s.center[0]+93*s.logoScale,s.center[1]-40*s.wordScale];
   s.titleWidth=672*retract;
  }else{
   const move=D.ramp(t,13,16.2);
   s.center=blend(corner,endCenter,move);s.logoScale=lerp(cornerScale,endScale,move);
   s.wordScale=endWordScale;s.wordOrigin=endWordOrigin;
   s.titleWidth=672*D.ramp(t,15.3,17.4);
  }
  s.titlePull=true;s.reveal=1;s.sequence='final-e3';return s;
 };
 D.phaseAt=(t,dir=1,v=0,m=0,f=0)=>!active(v,m,f)?basePhase(t,dir,v,m):dir<0?(t>13?'标题收起 · 回到角标':t>7.2?'角标返回 · 重现开场':basePhase(t,dir,v,m)):(t<7.2?basePhase(t,dir,v,m):t<10.2?'标题收起 · 移至左上角':t<13?'角标保持 · 持续旋转':t<16.2?'同一标志 · 回到中央':t<17.4?'下方展开 · E3 字标':'最终组合 · 持续轻转');
})(globalThis);
