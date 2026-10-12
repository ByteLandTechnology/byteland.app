const fs=require('fs'),path=require('path');
const H=require('./renderer/brand-sequence.cjs');
const D=require('./brand/design.js'),T=require('./src/timing.json');
// Preserve the full 4-second intro and real-time angular phase.
// Only the docking layout clock changes: 1.176470588 -> 0.75 seconds.
// Production quintic smootherstep supplies zero velocity/acceleration at each end.
const DOCK_START=7.2*T.intro/10.2,DOCK_DURATION=.75;
const storyAt=t=>t<=DOCK_START?t*10.2/T.intro:t<T.intro?Math.min(10.2,7.2+(t-DOCK_START)*3/DOCK_DURATION):t<T.outro?10.2:13+(t-T.outro)*2.5;
const dockWord=D.stateAt(7.2,1280,720,1,0,4,11);
const smooth=x=>{const u=Math.max(0,Math.min(1,x));return u*u*u*(u*(u*6-15)+10)};
// Integral of quintic smootherstep: C2 speed ramp, continuous phase.
const integral=x=>x<=0?0:x>=1?x-.5:x**6-3*x**5+2.5*x**4;
const states=Array.from({length:T.durationInFrames},(_,i)=>{const t=i/60,story=storyAt(t);const s=D.stateAt(story,1280,720,1,0,4,11);s.angle=D.angleAt(t,1,4);
 // Change only the corner endpoint. The original C2 layout curves smoothly
 // interpolate this delta, and centered intro/outro geometry stays untouched.
 const w=story<=7.2?0:story<13?D.ramp(story,7.2,10.2):1-D.ramp(story,13,16.2);
 s.center=[s.center[0]+w*(78-63.53),s.center[1]];
 s.logoScale+=w*(.22-.59);
 if(story>7.2&&story<13){s.wordOrigin=[...dockWord.wordOrigin];s.wordScale=dockWord.wordScale;}
 if(t>=63.42){
  const pull=smooth((t-63.42)/.36),collapse=smooth((t-63.62)/.54),travel=smooth((t-63.42)/.74);
  s.angle+=13.2*.28*integral((t-63.42)/.28); // .8 -> 14 rad/s clockwise
  s.center=[640,266.4+(360-266.4)*travel];
  s.growth=[1-collapse,1-collapse,1-collapse];s.fusion=14*smooth(collapse/.75);
  s.offsets=[[0,0],[0,0],[0,0]];s.turns=[0,0,0];s.fold=[1,1,1];s.zooms=[1,1,1];s.crossFusion=0;
  const originalWordY=s.wordOrigin[1],rise=smooth((pull-.65)/.35);
  s.wordScale*=1-.85*pull;s.titleWidth=672*(1-pull);
  s.wordOrigin=[s.center[0]-s.titleWidth*s.wordScale/2,originalWordY+(s.center[1]-originalWordY)*rise];s.reveal=1;
 }

 return s;});
fs.writeFileSync(path.join(__dirname,'src/brand-render-data.json'),JSON.stringify({vertex:D.vertex,fragment:H.transparentFragment(),states}));
