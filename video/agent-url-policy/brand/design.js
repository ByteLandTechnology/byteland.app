/* ByteLand / analytical signed-distance-field identity. No image/font textures. */
(function (scope) {
  'use strict';
  const DURATION = 7.2;
  const clamp = (v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const smoother=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
  const ramp=(t,a,b)=>smoother((t-a)/(b-a));
  const mix=(a,b,u)=>a+(b-a)*u;
  const integratedRamp=(t,start,duration)=>{const x=t-start;if(x<=0)return 0;if(x>=duration)return x-duration/2;const u=x/duration;return duration*(2.5*u**4-3*u**5+u**6)};
  const angleAt=(t,v=0)=>v===0?.22*t+17.78*integratedRamp(t,.5,1.15)-17.2*integratedRamp(t,1.95,1.8):v===1?1.9*integratedRamp(t,.25,2.1)+(.24-1.9)*integratedRamp(t,2.65,2.1):.72*integratedRamp(t,1.0,2.2)+(.20-.72)*integratedRamp(t,3.65,2.0);
  const speedAt=(t,v=0)=>v===0?.22+17.78*ramp(t,.5,1.65)-17.2*ramp(t,1.95,3.75):v===1?1.9*ramp(t,.25,2.35)+(.24-1.9)*ramp(t,2.65,4.75):.72*ramp(t,1.0,3.2)+(.20-.72)*ramp(t,3.65,5.65);
  const WIDTHS=[56,62,58,53,50,68,63,64];
  const STYLES=[{name:'融生',english:'MORPH',type:'经典几何 · 蓝—青渐变',description:'由慢到疾速，三叶边伸长边分离，再明显减速回到轻转。',tracking:10,stretch:1,width:544},{name:'环聚',english:'ORBIT',type:'宽体几何 · 蓝—紫—珊瑚渐变',description:'三叶沿弧线环绕归位，一束笔触带出宽体字标。',tracking:18,stretch:1.18,width:685.32},{name:'舒展',english:'UNFOLD',type:'柔圆字形 · 绿—蓝渐变',description:'叶片折展与侧滑汇合，圆润字标从中间向两侧舒展。',tracking:9,stretch:1,width:537}];
  function stateAt(t,width,height,variant=0,dock=0){
    const v=variant,sty=STYLES[v],small=width<600;
    const join=ramp(t,v===0?3.0:2.5,v===0?5.1:5.0);
    const group=Math.min(width*(small?.87:.70),v===1?730:690);
    const unit=group/(134+26+sty.width);
    const ls=unit*(v===2?1.01:1),ws=unit;
    const groupLeft=(width-group)/2;
    const finalCenter=[groupLeft+67*unit,height*.47];
    const startScale=Math.min(width*.0037,height*.0050,2.45);
    let logoScale=mix(startScale,ls,join);
    let center=[mix(width/2,finalCenter[0],join),mix(height*.45,finalCenter[1],join)];
    let wordScale=ws,wordOrigin=[groupLeft+160*unit,finalCenter[1]-40*unit];
    const dockScale=small?.53:.59;
    const dockUnit=Math.min(dockScale,(width-48)/(160+sty.width));
    logoScale=mix(logoScale,dockUnit,dock);center=[mix(center[0],24+67*dockUnit,dock),mix(center[1],small?48:58,dock)];
    wordScale=mix(ws,dockUnit,dock);wordOrigin=[mix(wordOrigin[0],24+160*dockUnit,dock),mix(wordOrigin[1],(small?48:58)-40*dockUnit,dock)];
    const sharedMorph=ramp(t,0,3.2);
    const growth=v===0?[sharedMorph,sharedMorph,sharedMorph]:v===1?[ramp(t,.43,1.48),ramp(t,.05,1.1),ramp(t,.24,1.29)]:[ramp(t,.75,2.2),ramp(t,.12,1.6),ramp(t,.42,1.9)];
    const offsets=[],turns=[],fold=[];
    for(let i=0;i<3;i++){
      const a=(41+i*120)*Math.PI/180;
      if(v===1){const u=ramp(t,.08+i*.12,3.3+i*.12),r=41*Math.sin(Math.PI*u);const o=a+2.9*(1-u);offsets.push([Math.cos(o)*r,Math.sin(o)*r]);turns.push(1.5*(1-u)*Math.sin(Math.PI*u));fold.push(1);}
      else if(v===2){const u=ramp(t,.1+i*.18,3.0+i*.18),r=25*Math.sin(Math.PI*u);offsets.push([Math.cos(a)*r,Math.sin(a)*r*.6]);turns.push(-.8*(1-u)*Math.sin(Math.PI*u));fold.push(mix(1,.20,Math.sin(Math.PI*u)));}
      else{offsets.push([0,0]);turns.push(0);fold.push(1);}
    }
    const reveal=ramp(t,v===0?3.6:v===1?3.0:3.1,v===0?6.8:6.8);
    return {t,variant:v,dock,join,logoScale,center,wordScale,wordOrigin,growth,offsets,turns,fold,reveal,angle:angleAt(t,v),wordWidth:sty.width};
  }
  function phaseAt(t,direction=1,v=0){if(direction<0)return t<=.01?'回到一点':t>3.0?'字标收回 · 回到中心':'叶片合拢';if(t<.1)return '由一点开始';if(t<(v===0?3.2:2.8))return ['融合旋转 · 三叶同时舒展','三叶环绕归位','叶片折展汇合'][v];if(t<6.8)return ['轮廓展开 · 逐字成形','笔触延伸 · 宽体成形','从中心舒展 · 柔圆成形'][v];return '品牌组合 · 持续轻转';}
  const vertex=`#version 300 es
  precision highp float;
  const vec2 points[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
  void main(){gl_Position=vec4(points[gl_VertexID],0.,1.);}`;
  const fragment=`#version 300 es
  precision highp float;
  out vec4 fragColor;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform vec2 uLogoCenter;
  uniform float uLogoScale;
  uniform float uAngle;
  uniform vec3 uGrowth;
  uniform vec2 uWordOrigin;
  uniform float uWordScale;
  uniform float uReveal;
  uniform float uVariant;
  uniform vec2 uLeafPositions[3];
  uniform vec3 uLeafAngles;
  uniform vec3 uLeafFold;
  const float FAR=100000.;
  float box(vec2 p,vec2 b){vec2 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,q.y),0.);}
  float rect(vec2 p,vec4 b){return box(p-(b.xy+b.zw)*.5,(b.zw-b.xy)*.5);}
  float circle(vec2 p,vec2 c,float r){return length(p-c)-r;}
  float leafWithSpread(vec2 p,float g,float spread){
    vec2 b=mix(vec2(3.3),vec2(40.,16.),g);
    p-=vec2(-21.63,26.78)*spread;
    float r=mix(3.3,p.x*p.y>0.?3.:16.,g);
    r=min(r,min(b.x,b.y));
    vec2 q=abs(p)-b+r;
    return min(max(q.x,q.y),0.)+length(max(q,0.))-r;
  }
  float leaf(vec2 p,float g){return leafWithSpread(p,g,g);}
  vec2 rotateBack(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x+s*p.y,-s*p.x+c*p.y);}
  float polygon(vec2 p,vec2 v[12],int count){
    float d=dot(p-v[0],p-v[0]);float s=1.;
    for(int i=0;i<12;i++){
      if(i>=count)break;
      int j=(i+count-1)%count;
      vec2 e=v[j]-v[i],w=p-v[i];
      vec2 b=w-e*clamp(dot(w,e)/dot(e,e),0.,1.);
      d=min(d,dot(b,b));
      bvec3 c=bvec3(p.y>=v[i].y,p.y<v[j].y,e.x*w.y>e.y*w.x);
      if(all(c)||all(not(c)))s=-s;
    }
    return s*sqrt(d);
  }
  // Each glyph is its own analytical field, with Boolean counters. Cap height 80.
  float glyph(vec2 p,int id){
    vec2 v[12];float d=FAR;
    if(id==0){ // B: two circular bowls, precise open counters.
      float a=min(rect(p,vec4(0.,0.,32.,40.)),circle(p,vec2(32.,20.),20.));
      float b=min(rect(p,vec4(0.,38.,35.,80.)),circle(p,vec2(35.,59.),21.));
      d=min(a,b);
      float ha=min(rect(p,vec4(14.,13.,31.,27.)),circle(p,vec2(31.,20.),7.));
      float hb=min(rect(p,vec4(14.,51.,33.,67.)),circle(p,vec2(33.,59.),8.));
      d=max(d,-min(ha,hb));
    }else if(id==1){ // Y
      v[0]=vec2(0.,0.);v[1]=vec2(16.,0.);v[2]=vec2(31.,27.);v[3]=vec2(46.,0.);
      v[4]=vec2(62.,0.);v[5]=vec2(38.,42.);v[6]=vec2(38.,80.);v[7]=vec2(24.,80.);v[8]=vec2(24.,42.);
      d=polygon(p,v,9);
    }else if(id==2){ // T
      d=min(rect(p,vec4(0.,0.,58.,14.)),rect(p,vec4(22.,0.,36.,80.)));
    }else if(id==3){ // E
      d=min(min(rect(p,vec4(0.,0.,14.,80.)),rect(p,vec4(0.,0.,53.,14.))),min(rect(p,vec4(0.,33.,47.,47.)),rect(p,vec4(0.,66.,53.,80.))));
    }else if(id==4){ // L
      d=min(rect(p,vec4(0.,0.,14.,80.)),rect(p,vec4(0.,66.,50.,80.)));
    }else if(id==5){ // A, a wide triangular counter.
      v[0]=vec2(0.,80.);v[1]=vec2(26.,0.);v[2]=vec2(42.,0.);v[3]=vec2(68.,80.);
      v[4]=vec2(53.,80.);v[5]=vec2(47.,61.);v[6]=vec2(21.,61.);v[7]=vec2(15.,80.);
      d=polygon(p,v,8);
      v[0]=vec2(25.,48.);v[1]=vec2(43.,48.);v[2]=vec2(34.,19.);
      d=max(d,-polygon(p,v,3));
    }else if(id==6){ // N
      v[0]=vec2(0.,80.);v[1]=vec2(0.,0.);v[2]=vec2(14.,0.);v[3]=vec2(49.,53.);
      v[4]=vec2(49.,0.);v[5]=vec2(63.,0.);v[6]=vec2(63.,80.);v[7]=vec2(49.,80.);v[8]=vec2(14.,27.);v[9]=vec2(14.,80.);
      d=polygon(p,v,10);
    }else{ // D
      float outer=max(min(rect(p,vec4(0.,0.,24.,80.)),circle(p,vec2(24.,40.),40.)),-p.x);
      float inner=max(min(rect(p,vec4(14.,14.,25.,66.)),circle(p,vec2(25.,40.),26.)),14.-p.x);
      d=max(outer,-inner);
    }
    return d-.35;
  }
  float ease(float x){x=clamp(x,0.,1.);return x*x*x*(x*(x*6.-15.)+10.);}
  float capsule(vec2 p,vec2 a,vec2 b,float r){vec2 v=p-a,w=b-a;return length(v-w*clamp(dot(v,w)/dot(w,w),0.,1.))-r;}
  float roundbox(vec2 p,vec2 c,vec2 b,float r){return box(p-c,b-r)-r;}
  float softGlyph(vec2 p,int id){
    float d=FAR,r=7.3;
    if(id==0){float outer=min(roundbox(p,vec2(25.,21.),vec2(25.,21.),16.),roundbox(p,vec2(26.5,58.5),vec2(26.5,21.5),17.));float inner=min(roundbox(p,vec2(25.5,21.),vec2(11.5,7.5),5.5),roundbox(p,vec2(27.,58.5),vec2(13.,8.),6.));d=max(min(outer,roundbox(p,vec2(6.5,40.),vec2(6.5,40.),3.5)),-inner);}
    else if(id==1){d=min(min(capsule(p,vec2(7.,7.),vec2(31.,40.),r),capsule(p,vec2(55.,7.),vec2(31.,40.),r)),capsule(p,vec2(31.,39.),vec2(31.,73.),r));}
    else if(id==2){d=min(capsule(p,vec2(7.,7.),vec2(51.,7.),r),capsule(p,vec2(29.,7.),vec2(29.,73.),r));}
    else if(id==3){d=min(min(capsule(p,vec2(7.,7.),vec2(7.,73.),r),capsule(p,vec2(7.,7.),vec2(46.,7.),r)),min(capsule(p,vec2(7.,40.),vec2(40.,40.),r),capsule(p,vec2(7.,73.),vec2(46.,73.),r)));}
    else if(id==4){d=min(capsule(p,vec2(7.,7.),vec2(7.,73.),r),capsule(p,vec2(7.,73.),vec2(43.,73.),r));}
    else if(id==5){d=min(min(capsule(p,vec2(7.,73.),vec2(34.,7.),r),capsule(p,vec2(34.,7.),vec2(61.,73.),r)),capsule(p,vec2(20.,53.),vec2(48.,53.),r));}
    else if(id==6){d=min(min(capsule(p,vec2(7.,73.),vec2(7.,7.),r),capsule(p,vec2(7.,7.),vec2(56.,73.),r)),capsule(p,vec2(56.,73.),vec2(56.,7.),r));}
    else{float outer=roundbox(p,vec2(32.,40.),vec2(32.,40.),30.);outer=min(outer,roundbox(p,vec2(9.,40.),vec2(9.,40.),5.));float inner=roundbox(p,vec2(31.5,40.),vec2(17.5,26.),17.);d=max(outer,-inner);}
    return d;
  }
  float chamfer(vec2 p,vec2 c,vec2 b,float k){vec2 q=abs(p-c);return max(box(p-c,b),(q.x+q.y-b.x-b.y+k)*.70710678);}
  float techGlyph(vec2 p,int id){
    vec2 v[12];
    if(id==0){
      // A continuous 16-unit left spine; only the right bowls are chamfered.
      v[0]=vec2(0.,0.);v[1]=vec2(40.,0.);v[2]=vec2(54.,13.);v[3]=vec2(54.,28.);v[4]=vec2(45.,38.);v[5]=vec2(56.,49.);v[6]=vec2(56.,67.);v[7]=vec2(42.,80.);v[8]=vec2(0.,80.);
      float outer=polygon(p,v,9);
      v[0]=vec2(16.,13.);v[1]=vec2(34.,13.);v[2]=vec2(40.,18.);v[3]=vec2(40.,24.);v[4]=vec2(34.,29.);v[5]=vec2(16.,29.);
      float top=polygon(p,v,6);
      v[0]=vec2(16.,49.);v[1]=vec2(35.,49.);v[2]=vec2(42.,55.);v[3]=vec2(42.,61.);v[4]=vec2(35.,67.);v[5]=vec2(16.,67.);
      return max(outer,-min(top,polygon(p,v,6)));
    }
    if(id==3)return min(min(rect(p,vec4(0.,0.,12.,80.)),chamfer(p,vec2(26.5,6.),vec2(26.5,6.),2.)),min(rect(p,vec4(0.,34.,39.,46.)),chamfer(p,vec2(26.5,74.),vec2(26.5,6.),2.)));
    if(id==7){
      // Flat left outside AND counter; diagonal corners exist only on the right.
      v[0]=vec2(0.,0.);v[1]=vec2(43.,0.);v[2]=vec2(64.,19.);v[3]=vec2(64.,61.);v[4]=vec2(43.,80.);v[5]=vec2(0.,80.);
      float outer=polygon(p,v,6);
      v[0]=vec2(16.,14.);v[1]=vec2(36.,14.);v[2]=vec2(49.,27.);v[3]=vec2(49.,53.);v[4]=vec2(36.,66.);v[5]=vec2(16.,66.);
      return max(outer,-polygon(p,v,6));
    }
    return glyph(p,id)+1.25;
  }
  float word(vec2 p){
    const float widths[8]=float[8](56.,62.,58.,53.,50.,68.,63.,64.);
    float x=0.,d=FAR;float stretch=uVariant<.5?1.:(uVariant<1.5?1.18:1.);float track=uVariant<.5?10.:(uVariant<1.5?18.:9.);
    for(int i=0;i<8;i++){
      float stagger=uVariant<.5?float(i)*.052:uVariant<1.5?float(i)*.050:abs(float(i)-3.5)*.064;
      float g=ease((uReveal-stagger)/.60);
      if(g>.00001){
        vec2 q=(p-vec2(x,0.))/vec2(stretch,1.);
        float field=uVariant>1.5?softGlyph(q,i):(uVariant>.5?techGlyph(q,i):glyph(q,i));
        float erosion=(uVariant>1.5?8.5:10.)*(1.-g);
        float di=field+erosion;
        if(uVariant<1.5)di=max(di,q.x-widths[i]*g);else di=max(di,abs(q.y-40.)-43.*g);
        d=min(d,di);
      }
      x+=widths[i]*stretch+track;
    }
    return d;
  }
  vec3 wordInk(vec2 p){
    float width=uVariant<.5?544.:(uVariant<1.5?685.32:537.);
    float f=clamp(p.x/width*.87+p.y/80.*.13,0.,1.);
    if(uVariant<.5)return mix(vec3(0.,104.,240.)/255.,vec3(0.,145.,153.)/255.,smoothstep(0.,1.,f));
    if(uVariant<1.5){vec3 a=vec3(0.,109.,249.)/255.,b=vec3(111.,76.,203.)/255.,c=vec3(240.,78.,80.)/255.;return f<.52?mix(a,b,smoothstep(0.,.52,f)):mix(b,c,smoothstep(.52,1.,f));}
    return mix(vec3(16.,146.,86.)/255.,vec3(0.,115.,242.)/255.,smoothstep(0.,1.,f));
  }
  float coverage(float d){float aa=max(fwidth(d),.7/uDpr);return 1.-smoothstep(-aa*.5,aa*.5,d);}
  void main(){
    vec2 p=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y)/uDpr;
    vec3 background=vec3(247.,249.,252.)/255.;
    vec3 color=background;
    vec2 local=rotateBack((p-uLogoCenter)/uLogoScale,uAngle);
    float best=FAR;vec3 fields=vec3(FAR);vec3 ink=vec3(0.,122.,255.)/255.;
    // All coincident seeds are the live leaf geometry; no extra center dot.
    for(int i=0;i<3;i++){
      float g=uGrowth[i];
      float a=(41.+float(i)*120.)*.017453292519943;
      vec2 q=rotateBack(local-uLeafPositions[i],a+uLeafAngles[i]);
      q.x/=uLeafFold[i];
      float spread=uVariant<.5?g+.065*sin(3.14159265358979*g):g;
      float d=leafWithSpread(q,g,spread)*uLogoScale*min(1.,uLeafFold[i]);
      fields[i]=d/uLogoScale;
      if(d<best){best=d;ink=i==0?vec3(255.,59.,48.)/255.:(i==1?vec3(0.,122.,255.)/255.:vec3(52.,199.,89.)/255.);}
    }
    // A is a single symmetric liquid field, never three staggered seed objects.
    // Shared growth evolves three lobes; log-sum-exp creates organic necks that
    // continuously thin to zero, returning the exact original three leaf fields.
    if(uVariant<.5){
      float g=uGrowth.x;
      float k=15.*pow(1.-g,5.);
      if(k>.0001){
        float m=min(fields.x,min(fields.y,fields.z));
        vec3 weights=exp((vec3(m)-fields)/k);
        float fused=m-k*log(weights.x+weights.y+weights.z);
        fused+=k*1.09861228866811*(1.-g)*(1.-g);
        best=fused*uLogoScale;
        vec3 materialWeights=exp((vec3(m)-fields)/max(k*.28,.3));
        vec3 blended=(materialWeights.x*vec3(255.,59.,48.)+materialWeights.y*vec3(0.,122.,255.)+materialWeights.z*vec3(52.,199.,89.))/(255.*(materialWeights.x+materialWeights.y+materialWeights.z));
        ink=mix(vec3(0.,122.,255.)/255.,blended,smoothstep(.08,.30,g));
      }
    }
    // Orbit/fold use identical red, green, blue compositing in GPU and fallback.
    if(uVariant>.5){
      vec3 layered=background;
      for(int j=0;j<3;j++){
        int i=j==0?0:(j==1?2:1);float a=(41.+float(i)*120.)*.017453292519943;
        vec2 q=rotateBack(local-uLeafPositions[i],a+uLeafAngles[i]);q.x/=uLeafFold[i];
        float di=leaf(q,uGrowth[i])*uLogoScale*min(1.,uLeafFold[i]);
        vec3 material=i==0?vec3(255.,59.,48.)/255.:(i==1?vec3(0.,122.,255.)/255.:vec3(52.,199.,89.)/255.);
        layered=mix(layered,material,coverage(di));
      }
      color=layered;
    }
    // The coincident point is blue; it is absorbed as the same fields expand.
    float started=max(uGrowth.x,max(uGrowth.y,uGrowth.z));
    if(started<.00001)ink=vec3(0.,122.,255.)/255.;
    if(uVariant<.5)color=mix(color,ink,coverage(best));
    vec2 wp=(p-uWordOrigin)/uWordScale;
    float wd=word(wp)*uWordScale;
    vec3 textInk=wordInk(wp);
    if(uVariant>.5&&uVariant<1.5&&uReveal>0.&&uReveal<.99){
      float front=uReveal*780.;float amp=sin(3.14159265*uReveal);
      float line=box(wp-vec2(front*.5,42.),vec2(front*.5,1.25));
      color=mix(color,wordInk(wp),coverage(line*uWordScale)*amp*.25);
    }
    color=mix(color,textInk,coverage(wd));
    fragColor=vec4(color,1.);
  }`;
  scope.ByteLandDesign={DURATION,STYLES,WIDTHS,clamp,smoother,ramp,integratedRamp,angleAt,speedAt,stateAt,phaseAt,vertex,fragment};
  if(typeof module!=='undefined')module.exports=scope.ByteLandDesign;
})(globalThis);

(function(scope){
'use strict';
const D=scope.ByteLandDesign;
const Motion=(scope.ByteLandOrbitMotion||(typeof require==='function'?require('./orbit-motion.js'):null)).create(D);
const Fonts=scope.BytelandWordmarks||(typeof require==='function'?require('./wordmark-styles.js'):null);
const Exo=scope.ByteLandExo||(typeof require==='function'?require('./exo-wordmark.js'):null);
const oldState=D.stateAt,oldAngle=D.angleAt,oldPhase=D.phaseAt;
D.ORBITS=Motion.styles;D.FONTS=Object.freeze([...Fonts.styles,Exo.style]);D.ORBIT_RADII=Motion.radii;
D.angleAt=(t,v=0,m=0)=>v===1?Motion.angle(t,m):oldAngle(t,v);
D.stateAt=function(t,width,height,variant=0,dock=0,motion=0,font=0){
 const s=oldState(t,width,height,variant,dock);s.zooms=[1,1,1];s.motion=motion;s.font=font;
 if(variant!==1)return s;
 const sty=D.FONTS[font],fw=sty.width??sty.totalWidth,small=width<600,titleU=D.clamp((t-3.6)/2.65),join=motion===4?titleU**3*(20+titleU*(-45+titleU*(36-10*titleU))):D.ramp(t,3.05,5.2);
 const group=Math.min(width*(small?.87:.72),730),unit=group/(160+fw),left=(width-group)/2;
 const envelope=Motion.radii[motion],safeStart=Math.min(width*.5-36,height*.45-36,height*.55-36)/envelope;
 const startScale=Math.min(width*.0030,height*.0036,1.85,Math.max(.08,safeStart)),lastCenter=[left+67*unit,height*(motion===4?.5:.47)];
 const dockUnit=Math.min(small?.53:.59,(width-48)/(160+fw));
 const dockSafe=Math.min(dockUnit,((small?48:58)-12)/envelope,(24+67*dockUnit-12)/envelope),dockGrowth=motion===4?D.ramp(t,3.2,3.85):D.ramp(t,2.65,3.4);
 const dockLogo=dockSafe+(dockUnit-dockSafe)*dockGrowth;
 s.join=join;s.logoScale=(startScale+(unit-startScale)*join)*(1-dock)+dockLogo*dock;
 const center=[width/2+(lastCenter[0]-width/2)*join,height*(motion===4?.5:.45)+(lastCenter[1]-height*(motion===4?.5:.45))*join];
 s.center=[center[0]*(1-dock)+(24+67*dockUnit)*dock,center[1]*(1-dock)+(small?48:58)*dock];
 s.wordScale=unit*(1-dock)+dockUnit*dock;
 s.wordOrigin=[(left+160*unit)*(1-dock)+(24+160*dockUnit)*dock,(lastCenter[1]-40*unit)*(1-dock)+((small?48:58)-40*dockUnit)*dock];
 Object.assign(s,Motion.pose(t,motion));s.reveal=D.ramp(t,3.55,6.9);s.wordWidth=fw;
 if(motion===4){s.crossFusion=D.ramp(t,2.25,2.5)*(1-D.ramp(t,3.05,3.35));s.titlePull=true;s.titleWidth=fw*join;s.reveal=1;s.wordOrigin=[s.center[0]+93*s.logoScale,s.center[1]-40*s.wordScale];}
 return s;
};
D.phaseAt=(t,dir=1,v=0,m=0)=>v!==1?oldPhase(t,dir,v):m===4?(dir<0?(t>3.6?'标题收回 · 回到中央':t>.01?'三叶收拢 · 回到圆点':'回到一点'):(t<.1?'圆点放大':t<3.6?'中央展开 · 三叶环聚':t<6.25?'持续旋转 · 向左拉开标题':'品牌组合 · 持续轻转')):dir<0?(t<=.01?(m===4?'回到一点':'回到三点'):t>3.5?'字标收回 · 轨道展开':'沿轨道合拢'):t<.1?(m===4?'圆点放大':'三点分开启程'):t<3.85?Motion.styles[m].name+' · 三叶环行':t<6.9?'归位 · 字标成形':'品牌组合 · 持续轻转';
let fragment=D.fragment;
fragment=fragment.replace('uniform float uVariant;','uniform float uVariant;\n  uniform float uFont;\n  uniform vec3 uLeafZoom;\n  uniform float uB5Fusion;\n  uniform float uB5Crossing;\n  uniform float uTitlePull;\n  uniform float uTitleWidth;');
fragment=fragment.replace('q.x/=uLeafFold[i];','q/=uLeafZoom[i];\n      q.x/=uLeafFold[i];');
fragment=fragment.replace('leafWithSpread(q,g,spread)*uLogoScale*min(1.,uLeafFold[i])','leafWithSpread(q,g,spread)*uLogoScale*uLeafZoom[i]*min(1.,uLeafFold[i])');
fragment=fragment.replace('q.x/=uLeafFold[i];\n        float di=leaf(q,uGrowth[i])*uLogoScale*min(1.,uLeafFold[i]);','q/=uLeafZoom[i];q.x/=uLeafFold[i];\n        float di=leaf(q,uGrowth[i])*uLogoScale*uLeafZoom[i]*min(1.,uLeafFold[i]);');
fragment=fragment.replace('    // The coincident point is blue; it is absorbed as the same fields expand.',`
    // B5 grows one circle into the same three live leaf fields. No overlay or swap.
    if(uVariant>.5&&uVariant<1.5&&uB5Fusion>.000001){
      float k=uB5Fusion,g=uGrowth.x,m=min(fields.x,min(fields.y,fields.z));
      vec3 weights=exp((vec3(m)-fields)/k);
      best=(m-k*log(weights.x+weights.y+weights.z)+k*1.09861228866811*(1.-g)*(1.-g))*uLogoScale;
      vec3 materialWeights=exp((vec3(m)-fields)/max(k*.28,.3));
      vec3 blended=(materialWeights.x*vec3(255.,59.,48.)+materialWeights.y*vec3(0.,122.,255.)+materialWeights.z*vec3(52.,199.,89.))/(255.*(materialWeights.x+materialWeights.y+materialWeights.z));
      // The seed already contains three materials, oriented toward their future leaves.
      // Narrow soft seams preserve distinct brand colors rather than averaging the dot.
      vec3 seedScores;
      for(int i=0;i<3;i++){
        float a=(41.+float(i)*120.)*.017453292519943;
        vec2 leafDirection=vec2(cos(a)*(-21.63)-sin(a)*26.78,sin(a)*(-21.63)+cos(a)*26.78);
        vec2 movingCenter=uLeafPositions[i]+leafDirection*g*uLeafZoom[i];
        vec2 direction=normalize(normalize(leafDirection)*.3+movingCenter);
        seedScores[i]=dot(local,direction)/.4;
      }
      vec3 seedWeights=exp(seedScores-max(seedScores.x,max(seedScores.y,seedScores.z)));
      vec3 seedInk=(seedWeights.x*vec3(255.,59.,48.)+seedWeights.y*vec3(0.,122.,255.)+seedWeights.z*vec3(52.,199.,89.))/(255.*(seedWeights.x+seedWeights.y+seedWeights.z));
      ink=mix(seedInk,blended,ease(g/.28));
      color=mix(background,ink,coverage(best));
    }
    // A local liquid junction during gathering. Path and global rotation are untouched.
    // The envelope is C2 at both ends; only neighboring SDF fields soften each other.
    float logoOpacity=coverage(best);
    if(uVariant>.5&&uVariant<1.5&&uB5Crossing>.000001){
      // The envelope changes the field's neck radius, never image opacity.
      // One opaque surface stretches/thins/breaks; AA applies only at its boundary.
      float k=5.5*uB5Crossing,m=min(fields.x,min(fields.y,fields.z));
      vec3 weights=exp((vec3(m)-fields)/k);
      float liquid=(m-k*log(weights.x+weights.y+weights.z))*uLogoScale;
      vec3 mw=exp((vec3(m)-fields)/max(1.7*uB5Crossing,.00001));
      vec3 material=(mw.x*vec3(255.,59.,48.)+mw.y*vec3(0.,122.,255.)+mw.z*vec3(52.,199.,89.))/(255.*(mw.x+mw.y+mw.z));
      best=liquid;ink=material;logoOpacity=coverage(best);
      color=mix(background,ink,logoOpacity);
    }
    // The coincident point is blue; it is absorbed as the same fields expand.`);
fragment=fragment.replace('if(started<.00001)ink=vec3(0.,122.,255.)/255.;','if(started<.00001&&!(uVariant>.5&&uVariant<1.5&&uB5Fusion>.000001))ink=vec3(0.,122.,255.)/255.;');
const metadata=Fonts.styles;
const selector=(field,values)=>`float ${field}(int style){${values.map((v,i)=>`if(style==${i})return ${Number(v).toFixed(5)};`).join('')}return ${Number(values[0]).toFixed(5)};}`;
const glyphs=Fonts.glsl.replace('float orbitTotalWidth(int style){','float orbitTotalWidth(int style){if(style==11)return 672.;')+Exo.glsl+`
 float orbitWord(vec2 p){
  int style=int(floor(uFont+.5));if(style==11)return exoWord(p);float x=0.,d=FAR;
  for(int i=0;i<8;i++){
   float w=orbitWidth(i,style),g=ease((uReveal-float(i)*.048)/.62);
   if(g>.00001){vec2 q=p-vec2(x,0.);float erosion=(style==2||style==6?3.0:6.5)*(1.-g);float di=max(orbitGlyph(q,i,style)+erosion,q.x-w*g);d=min(d,di);}
   x+=w+orbitTracking(style);
  }return d;
 }
`;
fragment=fragment.replace('  float word(vec2 p){',glyphs+'\n  float word(vec2 p){\n    if(uVariant>.5&&uVariant<1.5)return orbitWord(p);');
const cstart=fragment.indexOf('  vec3 wordInk(vec2 p)'),cend=fragment.indexOf('  float coverage',cstart);
fragment=fragment.slice(0,cstart)+`  vec3 wordInk(vec2 p){
    int style=uVariant<.5?0:(uVariant<1.5?int(floor(uFont+.5)):1);
    float width=uVariant<.5?544.:(uVariant<1.5?orbitTotalWidth(style):537.);
    vec2 q=clamp(p/vec2(width,80.),0.,1.);float f=q.x;
    vec3 blue=vec3(0.,122.,255.)/255.,green=vec3(52.,199.,89.)/255.,red=vec3(255.,59.,48.)/255.;
    vec3 a=blue,b=green,c=red;
    if(style==1){f=q.x*.78+q.y*.22;a=green;b=blue;c=red;}
    else if(style==2){a=red;b=blue;c=green;}
    else if(style==3){f=q.y;a=blue;b=green;c=red;}
    else if(style==4){f=q.x*.82+(1.-q.y)*.18;a=red;b=green;c=blue;}
    return f<.5?mix(a,b,smoothstep(0.,.5,f)):mix(b,c,smoothstep(.5,1.,f));
  }
`+fragment.slice(cend);
fragment=fragment.replace(/    if\(uVariant>\.5&&uVariant<1\.5&&uReveal>0\.&&uReveal<\.99\)\{[\s\S]*?\n    \}/,'');
fragment=fragment.replace('float wd=word(wp)*uWordScale;', 'float wd=word(wp)*uWordScale;\n    if(uTitlePull>.5)wd=uTitleWidth>.00001?max(wd,(wp.x-uTitleWidth)*uWordScale):FAR;');
D.fragment=fragment;
if(typeof module!=='undefined')module.exports=D;
})(globalThis);

// The browser loads the final layout sequence as a separate script.
if(typeof module!=="undefined")require("./final-sequence.js");
