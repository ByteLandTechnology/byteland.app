/* Five distinct orbit choreographies. All converge to the approved leaf geometry. */
(function(scope){
const styles=[
 {name:'螺旋入轨',english:'SPIRAL',short:'收束的行星轨迹',description:'三叶沿同心螺旋绕行，半径逐渐收紧，在同一节奏里归位。'},
 {name:'倾斜环绕',english:'ELLIPSE',short:'前后穿行的椭圆',description:'三叶沿倾斜椭圆各自绕行，始终保留间距，再转回平面组合。'},
 {name:'双向交错',english:'COUNTERPOINT',short:'相向交会，错身归位',description:'三叶在独立扇区内相向摆转，错位呼应，再同步收拢。'},
 {name:'合页星环',english:'IRIS',short:'展开、翻转、合拢',description:'三叶如环形合页展开，在轨道上翻身，慢慢合拢成标志。'},
 {name:'彗星回旋',english:'SLINGSHOT',short:'一气绕行，连续收束',description:'圆点放大、自然分出三叶，散开后沿原本的回旋轨迹聚拢，继续轻转。'}
];
function create(D){
 const {ramp,integratedRamp:I}=D;
 function finishProgress(t){const u=Math.max(0,Math.min(1,(t-1.4)/2.2));return u*u*u*(20+u*(-45+u*(36-10*u)));}

 // Add two complete clockwise revolutions with pronounced smooth acceleration
 // and braking, preserving the final orientation from3.6s onward.
 // Compensate early local material/leaf counterturn, then recover the original
 // phase before gathering. C2 endpoints keep the visible rotation clockwise.
 const angle=(t,m)=>m===0?.16*t+1.3*I(t,.25,1.5)-1.18*I(t,2.3,1.6):m===1?.18*t+.35*I(t,.4,1.4)-.25*I(t,2.6,1.5):m===2?.15*t+.45*I(t,.4,1.4)-.32*I(t,2.8,1.5):m===3?.18*t+.8*I(t,.4,1.6)-.7*I(t,2.9,1.4):.2*t+3.4*I(t,.45,1.2)-2.8*I(t,2.65,1.35)+.1*finishProgress(t)+1.25*ramp(t,.05,.90)*(1-ramp(t,1.05,2.25))+(4*Math.PI/1.925)*(I(t,.55,1.0)-I(t,2.35,1.25));
 function pose(t,m){
  if(m===4){
   const offsets=[],turns=[0,0,0],fold=[1,1,1],zooms=[],growth=[];
   // One analytic spiral from scatter through gathering: interweaving is intentional.
   // No collision-response offset or replacement tail changes the trajectory.
   const u=ramp(t,.03,3.60),lift=Math.sin(Math.PI*u),radius=70*lift*(1-.32*u);
   const g=ramp(t,.25,1.25),scatter=ramp(t,.25,.70);
   // Let circle enlargement continue into active leaf growth; no stop/restart handoff.
   const z=1+1.55*ramp(t,0,.40)*(1-ramp(t,.32,.85));
   for(let i=0;i<3;i++){
    const a=(41+i*120)*Math.PI/180,phase=a+4.6*u;
    let x=Math.cos(phase)*radius*scatter,y=Math.sin(phase)*radius*scatter;
    offsets.push([x,y]);growth.push(g);zooms.push(z);
   }
   return {offsets,turns,fold,zooms,growth,angle:angle(t,m),fusion:14*Math.pow(1-ramp(t,.35,1.10),2)};
  }
  const offsets=[],turns=[],fold=[],zooms=[],growth=[];
  const baseRadius=Math.hypot(-21.63,26.78),bearing=Math.atan2(26.78,-21.63);
  // Each leaf owns a separated angular lane. These are authored trajectories,
  // never collision-response corrections: positions and their derivatives stay smooth.
  const ends=[3.65,3.8,3.85,3.85,3.60],u=ramp(t,0,ends[m]),wave=Math.sin(Math.PI*u);
  const g=ramp(t,0,m===3?1.45:1.25),seedRadius=16;
  for(let i=0;i<3;i++){
   const a=(41+i*120)*Math.PI/180,theta=a+bearing;
   let radius=baseRadius*g+seedRadius*(1-g),phase=0,turn=0,fx=1,z=1,ex=1,ey=1;
   if(m===0){
    radius+=48*wave;phase=.48*wave;turn=phase;
   }else if(m===1){
    radius+=58*wave;phase=.40*wave;
    ex=1+.18*wave;ey=1-.22*wave;
    turn=phase-.20*Math.sin(theta)*wave;z=1+.10*Math.sin(theta)*wave;
    fx=1-.42*wave*Math.abs(Math.cos(theta));
   }else if(m===2){
    const sign=i===1?-1:1;
    radius+=58*wave;phase=sign*.35*wave;turn=sign*.62*wave;
    z=1+.07*Math.sin(theta)*wave;
   }else if(m===3){
    radius+=49*wave;phase=.32*wave;turn=2.1*wave;
    fx=1-.72*wave*wave;
   }else{
    radius+=70*wave*(1-.32*u);phase=.28*wave;turn=phase;
   }
   const cx=Math.cos(theta+phase)*radius*ex,cy=Math.sin(theta+phase)*radius*ey;
   // Rotate/fold around the leaf's own centroid, then place it in its lane.
   const localX=-21.63*g*fx*z,localY=26.78*g*z,ca=Math.cos(a+turn),sa=Math.sin(a+turn);
   offsets.push([cx-(ca*localX-sa*localY),cy-(sa*localX+ca*localY)]);
   turns.push(turn);fold.push(fx);zooms.push(z);growth.push(g);
  }
  return {offsets,turns,fold,zooms,growth,angle:angle(t,m)};
 }
 // Conservative rotation-independent radius of each complete orbital envelope.
 // A held/reversed phase may rotate the path, so fit the full radius, not one view.
 const radii=styles.map((_,m)=>{let radius=75;for(let t=0;t<=3.91;t+=.01){const s=pose(t,m);for(let i=0;i<3;i++){const g=s.growth[i],a=(41+i*120)*Math.PI/180+s.turns[i],c=Math.cos(a),sn=Math.sin(a),z=s.zooms[i];for(const xx of [-1,1])for(const yy of [-1,1]){const lx=(-21.63*g+xx*(3.3+36.7*g))*s.fold[i]*z,ly=(26.78*g+yy*(3.3+12.7*g))*z;const x=c*lx-sn*ly+s.offsets[i][0],y=sn*lx+c*ly+s.offsets[i][1];radius=Math.max(radius,Math.hypot(x,y));}}}return radius*1.03;});
 return {styles,angle,pose,radii,finishProgress};
}
scope.ByteLandOrbitMotion={styles,create};if(typeof module!=='undefined')module.exports=scope.ByteLandOrbitMotion;
})(globalThis);
