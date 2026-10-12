/* BYTELAND: eleven custom analytical SDF alphabets. Coordinates: x right, y down.
 * Cap height 80. No font files, raster masks, textures, or path sampling.
 * Requires the reference shader's box, rect, polygon, capsule, roundbox helpers.
 * All B/D bowls and counters have straight left boundaries. */
(function (scope) {
  'use strict';
  const styles = [
    { id: 0, name: '阔境', english: 'EXPANDED', family: '扩展方圆', description: '横向张力、方圆碗部、平顶 A；开阔而稳定。', widths: [66,72,70,62,60,74,70,72], tracking: 11, capHeight: 80 },
    { id: 1, name: '亲和', english: 'HUMANIST', family: '柔圆人文', description: '圆头笔画、柔和交汇、不对称双碗；轻松而清晰。', widths: [56,62,56,49,48,65,62,64], tracking: 11, capHeight: 80 },
    { id: 2, name: '精密', english: 'CONDENSED', family: '窄体切角', description: '窄长比例、六边形字腔、紧凑折角；秩序感鲜明。', widths: [44,46,44,41,40,50,48,49], tracking: 13, capHeight: 80 },
    { id: 3, name: '书意', english: 'SOFT SLAB', family: '柔角板衬线', description: '平板衬线、悬垂横梁、柔角端点；温暖而有分量。', widths: [64,68,66,59,57,70,70,69], tracking: 10, capHeight: 80 },
    { id: 4, name: '向前', english: 'FORWARD', family: '前倾竞速', description: '前倾直干、斜切横画、非对称切角；方向感与动势。', widths: [67.4,70.4,67.4,63.4,60.4,74.4,71.4,72.4], tracking: 8, capHeight: 80 },
    { id: 5, name: '匀衡', english: 'BALANCED', family: '匀衡几何', description: '更轻的中等字重、开放字腔、微圆方角；清晰而从容。', widths: [59,64,60,53,49,67,64,65], tracking: 9, capHeight: 80 },
    { id: 6, name: '轻圆', english: 'ROUND LIGHT', family: '轻量圆体', description: '轻盈单线条、舒展圆头、更大字腔；留白与呼吸感。', widths: [61,66,62,54,52,68,66,67], tracking: 10, capHeight: 80 },
    { id: 7, name: '流线', english: 'SOFT ITALIC', family: '柔和斜体', description: '较缓前倾、柔圆笔画、宽松字腔；连贯而有方向感。', widths: [69.6,73.6,69.6,63.6,60.6,75.6,74.6,75.6], tracking: 7, capHeight: 80 },
    { id: 8, name: '叶柔', english: 'LEAF SOFT', family: '微叶柔角', description: '以叶片的对角柔角修整字端，保留清晰骨架；克制、圆润、耐看。', widths: [60,64,60,54,51,68,64,67], tracking: 9, capHeight: 80 },
    { id: 9, name: '叶韵', english: 'LEAF ORGANIC', family: '舒叶曲线', description: '叶片弧线进入 B、D 字碗与字腔，横画两端不对称收圆；舒展而自然。', widths: [60,65,61,53,50,68,65,68], tracking: 10, capHeight: 80 },
    { id: 10, name: '叶生', english: 'LEAF BOLD', family: '厚叶字形', description: '更饱满的叶片笔画、长弧字碗与柔尖端点；鲜明而仍易辨认。', widths: [66,72,66,58,56,74,72,74], tracking: 10, capHeight: 80 }
  ].map(s => Object.freeze({ ...s, widths: Object.freeze(s.widths), width: +(s.widths.reduce((a,b)=>a+b,0)+7*s.tracking).toFixed(2), totalWidth: +(s.widths.reduce((a,b)=>a+b,0)+7*s.tracking).toFixed(2) }));
  const glsl = `
  // Rounded corners only on the right: the left outline and stem stay flat.
  float orbitRightBox(vec2 p,vec4 b,float r){
    vec2 c=(b.xy+b.zw)*.5,h=(b.zw-b.xy)*.5;
    float rr=p.x>c.x?min(r,min(h.x,h.y)):0.;
    vec2 q=abs(p-c)-h+rr;
    return length(max(q,0.))+min(max(q.x,q.y),0.)-rr;
  }
  float orbitSoftRect(vec2 p,vec4 b,float r){return roundbox(p,(b.xy+b.zw)*.5,(b.zw-b.xy)*.5,r);}
  // Transform vertices, not sample coordinates: italic polygon distances remain exact.
  float orbitSlantPoly(vec2 p,vec2 a[12],int n){
    vec2 v[12];for(int i=0;i<12;i++){v[i]=vec2(0.);if(i<n)v[i]=a[i]+vec2(.18*(80.-a[i].y),0.);}
    return polygon(p,v,n);
  }
  float orbitSlantRect(vec2 p,vec4 b){
    vec2 v[12];v[0]=b.xy;v[1]=vec2(b.z,b.y);v[2]=b.zw;v[3]=vec2(b.x,b.w);
    return orbitSlantPoly(p,v,4);
  }
  float orbitExpanded(vec2 p,int id){
    vec2 v[12];float d=100000.;
    if(id==0){
      float o=min(orbitRightBox(p,vec4(0.,0.,64.,41.),12.),orbitRightBox(p,vec4(0.,37.,66.,80.),14.));
      float h=min(orbitRightBox(p,vec4(15.,13.,49.,33.),6.),orbitRightBox(p,vec4(15.,47.,51.,67.),6.));
      return max(o,-h);
    }
    if(id==1){
      v[0]=vec2(0.,0.);v[1]=vec2(18.,0.);v[2]=vec2(36.,28.);v[3]=vec2(54.,0.);v[4]=vec2(72.,0.);
      v[5]=vec2(44.,43.);v[6]=vec2(44.,80.);v[7]=vec2(28.,80.);v[8]=vec2(28.,43.);return polygon(p,v,9);
    }
    if(id==2)return min(rect(p,vec4(0.,0.,70.,15.)),rect(p,vec4(27.,0.,43.,80.)));
    if(id==3)return min(min(rect(p,vec4(0.,0.,15.,80.)),rect(p,vec4(0.,0.,62.,14.))),min(rect(p,vec4(0.,33.,53.,47.)),rect(p,vec4(0.,66.,62.,80.))));
    if(id==4)return min(rect(p,vec4(0.,0.,15.,80.)),rect(p,vec4(0.,66.,60.,80.)));
    if(id==5){
      v[0]=vec2(0.,80.);v[1]=vec2(25.,0.);v[2]=vec2(49.,0.);v[3]=vec2(74.,80.);v[4]=vec2(58.,80.);v[5]=vec2(52.,62.);v[6]=vec2(22.,62.);v[7]=vec2(16.,80.);d=polygon(p,v,8);
      v[0]=vec2(25.,49.);v[1]=vec2(49.,49.);v[2]=vec2(37.,17.);return max(d,-polygon(p,v,3));
    }
    if(id==6){
      v[0]=vec2(0.,80.);v[1]=vec2(0.,0.);v[2]=vec2(16.,0.);v[3]=vec2(54.,53.);v[4]=vec2(54.,0.);v[5]=vec2(70.,0.);v[6]=vec2(70.,80.);v[7]=vec2(54.,80.);v[8]=vec2(16.,27.);v[9]=vec2(16.,80.);return polygon(p,v,10);
    }
    return max(orbitRightBox(p,vec4(0.,0.,72.,80.),27.),-orbitRightBox(p,vec4(15.,14.,56.,66.),17.));
  }
  float orbitHumanist(vec2 p,int id){
    if(id==0){
      float o=min(orbitRightBox(p,vec4(0.,0.,54.,40.),19.),orbitRightBox(p,vec4(0.,37.,56.,80.),20.));
      float h=min(orbitRightBox(p,vec4(13.,12.,41.,34.),8.),orbitRightBox(p,vec4(13.,47.,43.,68.),9.));return max(o,-h);
    }
    if(id==1)return min(min(capsule(p,vec2(7.,7.),vec2(31.,40.),7.),capsule(p,vec2(55.,7.),vec2(31.,40.),7.)),capsule(p,vec2(31.,39.),vec2(31.,73.),7.));
    if(id==2)return min(capsule(p,vec2(6.5,6.5),vec2(49.5,6.5),6.5),capsule(p,vec2(28.,6.5),vec2(28.,73.5),6.5));
    if(id==3)return min(min(capsule(p,vec2(6.5,6.5),vec2(6.5,73.5),6.5),capsule(p,vec2(6.5,6.5),vec2(42.5,6.5),6.5)),min(capsule(p,vec2(6.5,39.5),vec2(35.,39.5),6.),capsule(p,vec2(6.5,73.5),vec2(42.5,73.5),6.5)));
    if(id==4)return min(capsule(p,vec2(6.5,6.5),vec2(6.5,73.5),6.5),capsule(p,vec2(6.5,73.5),vec2(41.5,73.5),6.5));
    if(id==5)return min(min(capsule(p,vec2(6.5,73.5),vec2(32.5,6.5),6.5),capsule(p,vec2(32.5,6.5),vec2(58.5,73.5),6.5)),capsule(p,vec2(20.,54.),vec2(45.,54.),5.5));
    if(id==6)return min(min(capsule(p,vec2(7.,73.),vec2(7.,7.),7.),capsule(p,vec2(7.,7.),vec2(55.,73.),7.)),capsule(p,vec2(55.,73.),vec2(55.,7.),7.));
    return max(orbitRightBox(p,vec4(0.,0.,64.,80.),31.),-orbitRightBox(p,vec4(13.,13.,51.,67.),19.));
  }
  float orbitCondensed(vec2 p,int id){
    vec2 v[12];float d=100000.;
    if(id==0){
      v[0]=vec2(0.,0.);v[1]=vec2(34.,0.);v[2]=vec2(44.,10.);v[3]=vec2(44.,29.);v[4]=vec2(36.,38.);v[5]=vec2(44.,47.);v[6]=vec2(44.,70.);v[7]=vec2(34.,80.);v[8]=vec2(0.,80.);d=polygon(p,v,9);
      v[0]=vec2(11.,11.);v[1]=vec2(28.,11.);v[2]=vec2(33.,16.);v[3]=vec2(33.,29.5);v[4]=vec2(28.,34.5);v[5]=vec2(11.,34.5);float h=polygon(p,v,6);
      v[0]=vec2(11.,45.5);v[1]=vec2(28.,45.5);v[2]=vec2(33.,50.5);v[3]=vec2(33.,64.);v[4]=vec2(28.,69.);v[5]=vec2(11.,69.);return max(d,-min(h,polygon(p,v,6)));
    }
    if(id==1){
      v[0]=vec2(0.,0.);v[1]=vec2(11.,0.);v[2]=vec2(23.,28.);v[3]=vec2(35.,0.);v[4]=vec2(46.,0.);v[5]=vec2(28.5,43.);v[6]=vec2(28.5,80.);v[7]=vec2(17.5,80.);v[8]=vec2(17.5,43.);return polygon(p,v,9);
    }
    if(id==2){
      v[0]=vec2(0.,3.);v[1]=vec2(3.,0.);v[2]=vec2(41.,0.);v[3]=vec2(44.,3.);v[4]=vec2(44.,11.);v[5]=vec2(0.,11.);return min(polygon(p,v,6),rect(p,vec4(16.5,0.,27.5,80.)));
    }
    if(id==3){
      v[0]=vec2(0.,0.);v[1]=vec2(38.,0.);v[2]=vec2(41.,3.);v[3]=vec2(41.,11.);v[4]=vec2(0.,11.);d=polygon(p,v,5);
      v[0]=vec2(0.,69.);v[1]=vec2(41.,69.);v[2]=vec2(41.,77.);v[3]=vec2(38.,80.);v[4]=vec2(0.,80.);return min(min(d,polygon(p,v,5)),min(rect(p,vec4(0.,0.,11.,80.)),rect(p,vec4(0.,34.5,32.,45.5))));
    }
    if(id==4){
      v[0]=vec2(0.,69.);v[1]=vec2(40.,69.);v[2]=vec2(40.,77.);v[3]=vec2(37.,80.);v[4]=vec2(0.,80.);return min(rect(p,vec4(0.,0.,11.,80.)),polygon(p,v,5));
    }
    if(id==5){
      v[0]=vec2(0.,80.);v[1]=vec2(17.,0.);v[2]=vec2(33.,0.);v[3]=vec2(50.,80.);v[4]=vec2(38.,80.);v[5]=vec2(34.,59.);v[6]=vec2(16.,59.);v[7]=vec2(12.,80.);d=polygon(p,v,8);
      v[0]=vec2(19.,47.);v[1]=vec2(31.,47.);v[2]=vec2(27.,17.);v[3]=vec2(23.,17.);return max(d,-polygon(p,v,4));
    }
    if(id==6){
      v[0]=vec2(0.,80.);v[1]=vec2(0.,0.);v[2]=vec2(11.,0.);v[3]=vec2(37.,53.);v[4]=vec2(37.,0.);v[5]=vec2(48.,0.);v[6]=vec2(48.,80.);v[7]=vec2(37.,80.);v[8]=vec2(11.,27.);v[9]=vec2(11.,80.);return polygon(p,v,10);
    }
    v[0]=vec2(0.,0.);v[1]=vec2(33.,0.);v[2]=vec2(49.,16.);v[3]=vec2(49.,64.);v[4]=vec2(33.,80.);v[5]=vec2(0.,80.);d=polygon(p,v,6);
    v[0]=vec2(11.,11.);v[1]=vec2(27.,11.);v[2]=vec2(38.,22.);v[3]=vec2(38.,58.);v[4]=vec2(27.,69.);v[5]=vec2(11.,69.);return max(d,-polygon(p,v,6));
  }
  float orbitSlab(vec2 p,int id){
    vec2 v[12];float d=100000.;
    if(id==0){
      float o=min(orbitRightBox(p,vec4(0.,0.,62.,40.),15.),orbitRightBox(p,vec4(0.,36.,64.,80.),17.));
      float h=min(orbitRightBox(p,vec4(14.,11.,48.,34.5),8.),orbitRightBox(p,vec4(14.,45.5,50.,69.),9.));return max(o,-h);
    }
    if(id==1){
      v[0]=vec2(4.,0.);v[1]=vec2(19.,0.);v[2]=vec2(34.,31.);v[3]=vec2(49.,0.);v[4]=vec2(64.,0.);v[5]=vec2(41.,45.);v[6]=vec2(41.,80.);v[7]=vec2(27.,80.);v[8]=vec2(27.,45.);d=polygon(p,v,9);
      d=min(d,min(orbitSoftRect(p,vec4(0.,0.,25.,10.),1.4),orbitSoftRect(p,vec4(43.,0.,68.,10.),1.4)));
      return min(d,orbitSoftRect(p,vec4(17.,70.,51.,80.),1.4));
    }
    if(id==2){
      d=min(orbitSoftRect(p,vec4(0.,0.,66.,11.),1.4),rect(p,vec4(26.,0.,40.,80.)));
      d=min(d,min(orbitSoftRect(p,vec4(0.,0.,10.,22.),1.4),orbitSoftRect(p,vec4(56.,0.,66.,22.),1.4)));
      return min(d,orbitSoftRect(p,vec4(16.,70.,50.,80.),1.4));
    }
    if(id==3){
      d=min(rect(p,vec4(0.,0.,14.,80.)),min(orbitSoftRect(p,vec4(0.,0.,59.,11.),1.4),orbitSoftRect(p,vec4(0.,69.,59.,80.),1.4)));
      d=min(d,min(orbitSoftRect(p,vec4(49.,0.,59.,22.),1.4),orbitSoftRect(p,vec4(49.,58.,59.,80.),1.4)));
      return min(d,min(orbitSoftRect(p,vec4(0.,35.,46.,45.),1.4),orbitSoftRect(p,vec4(37.,29.,46.,51.),1.4)));
    }
    if(id==4){
      d=min(rect(p,vec4(9.,0.,23.,80.)),min(orbitSoftRect(p,vec4(0.,0.,32.,10.),1.4),orbitSoftRect(p,vec4(0.,69.,57.,80.),1.4)));
      return min(d,orbitSoftRect(p,vec4(47.,58.,57.,80.),1.4));
    }
    if(id==5){
      v[0]=vec2(7.,80.);v[1]=vec2(28.,0.);v[2]=vec2(42.,0.);v[3]=vec2(63.,80.);v[4]=vec2(49.,80.);v[5]=vec2(44.,59.);v[6]=vec2(26.,59.);v[7]=vec2(21.,80.);d=polygon(p,v,8);
      v[0]=vec2(29.,47.);v[1]=vec2(41.,47.);v[2]=vec2(35.,21.);d=max(d,-polygon(p,v,3));
      return min(d,min(orbitSoftRect(p,vec4(0.,70.,28.,80.),1.4),orbitSoftRect(p,vec4(42.,70.,70.,80.),1.4)));
    }
    if(id==6){
      d=min(rect(p,vec4(7.,0.,20.,80.)),rect(p,vec4(50.,0.,63.,80.)));
      v[0]=vec2(13.,0.);v[1]=vec2(26.,0.);v[2]=vec2(57.,60.);v[3]=vec2(57.,80.);v[4]=vec2(44.,80.);v[5]=vec2(13.,20.);d=min(d,polygon(p,v,6));
      d=min(d,min(orbitSoftRect(p,vec4(0.,0.,29.,10.),1.4),orbitSoftRect(p,vec4(41.,0.,70.,10.),1.4)));
      return min(d,min(orbitSoftRect(p,vec4(0.,70.,29.,80.),1.4),orbitSoftRect(p,vec4(41.,70.,70.,80.),1.4)));
    }
    return max(orbitRightBox(p,vec4(0.,0.,69.,80.),28.),-orbitRightBox(p,vec4(14.,12.,54.,68.),20.));
  }
  float orbitForward(vec2 p,int id){
    vec2 v[12];float d=100000.;
    if(id==0){
      v[0]=vec2(0.,0.);v[1]=vec2(39.,0.);v[2]=vec2(51.,10.);v[3]=vec2(51.,28.);v[4]=vec2(42.,37.);v[5]=vec2(53.,47.);v[6]=vec2(53.,69.);v[7]=vec2(40.,80.);v[8]=vec2(0.,80.);d=orbitSlantPoly(p,v,9);
      v[0]=vec2(14.,12.);v[1]=vec2(31.,12.);v[2]=vec2(38.,18.);v[3]=vec2(38.,28.);v[4]=vec2(33.,33.);v[5]=vec2(14.,33.);float h=orbitSlantPoly(p,v,6);
      v[0]=vec2(14.,47.);v[1]=vec2(33.,47.);v[2]=vec2(40.,54.);v[3]=vec2(40.,62.);v[4]=vec2(33.,68.);v[5]=vec2(14.,68.);return max(d,-min(h,orbitSlantPoly(p,v,6)));
    }
    if(id==1){
      v[0]=vec2(0.,0.);v[1]=vec2(15.,0.);v[2]=vec2(28.,26.);v[3]=vec2(42.,0.);v[4]=vec2(56.,0.);v[5]=vec2(35.,42.);v[6]=vec2(35.,80.);v[7]=vec2(21.,80.);v[8]=vec2(21.,42.);return orbitSlantPoly(p,v,9);
    }
    if(id==2){
      v[0]=vec2(4.,0.);v[1]=vec2(53.,0.);v[2]=vec2(49.,13.);v[3]=vec2(0.,13.);return min(orbitSlantPoly(p,v,4),orbitSlantRect(p,vec4(20.,0.,34.,80.)));
    }
    if(id==3){
      d=orbitSlantRect(p,vec4(0.,0.,14.,80.));
      v[0]=vec2(0.,0.);v[1]=vec2(49.,0.);v[2]=vec2(44.,13.);v[3]=vec2(0.,13.);d=min(d,orbitSlantPoly(p,v,4));
      v[0]=vec2(0.,35.);v[1]=vec2(41.,35.);v[2]=vec2(36.,47.);v[3]=vec2(0.,47.);d=min(d,orbitSlantPoly(p,v,4));
      v[0]=vec2(0.,66.);v[1]=vec2(49.,66.);v[2]=vec2(44.,80.);v[3]=vec2(0.,80.);return min(d,orbitSlantPoly(p,v,4));
    }
    if(id==4){
      v[0]=vec2(0.,66.);v[1]=vec2(46.,66.);v[2]=vec2(41.,80.);v[3]=vec2(0.,80.);return min(orbitSlantRect(p,vec4(0.,0.,14.,80.)),orbitSlantPoly(p,v,4));
    }
    if(id==5){
      v[0]=vec2(0.,80.);v[1]=vec2(23.,0.);v[2]=vec2(38.,0.);v[3]=vec2(60.,80.);v[4]=vec2(45.,80.);v[5]=vec2(41.,62.);v[6]=vec2(19.,62.);v[7]=vec2(14.,80.);d=orbitSlantPoly(p,v,8);
      v[0]=vec2(22.,49.);v[1]=vec2(38.,49.);v[2]=vec2(30.,22.);return max(d,-orbitSlantPoly(p,v,3));
    }
    if(id==6){
      v[0]=vec2(0.,80.);v[1]=vec2(0.,0.);v[2]=vec2(14.,0.);v[3]=vec2(43.,50.);v[4]=vec2(43.,0.);v[5]=vec2(57.,0.);v[6]=vec2(57.,80.);v[7]=vec2(43.,80.);v[8]=vec2(14.,30.);v[9]=vec2(14.,80.);return orbitSlantPoly(p,v,10);
    }
    v[0]=vec2(0.,0.);v[1]=vec2(37.,0.);v[2]=vec2(58.,18.);v[3]=vec2(58.,62.);v[4]=vec2(37.,80.);v[5]=vec2(0.,80.);d=orbitSlantPoly(p,v,6);
    v[0]=vec2(14.,14.);v[1]=vec2(31.,14.);v[2]=vec2(43.,25.);v[3]=vec2(43.,55.);v[4]=vec2(31.,66.);v[5]=vec2(14.,66.);return max(d,-orbitSlantPoly(p,v,6));
  }

  // New medium-width geometric system. B has a single 12-unit shared crossbar.
  float orbitBalanced(vec2 p,int id){
    vec2 v[12];float d=100000.;
    if(id==0){
      float o=min(orbitRightBox(p,vec4(0.,0.,57.,41.),15.),orbitRightBox(p,vec4(0.,37.,59.,80.),17.));
      float h=min(orbitRightBox(p,vec4(12.,12.,45.,34.),8.),orbitRightBox(p,vec4(12.,46.,47.,68.),9.));return max(o,-h);
    }
    if(id==1){
      v[0]=vec2(0.,0.);v[1]=vec2(14.,0.);v[2]=vec2(32.,30.);v[3]=vec2(50.,0.);v[4]=vec2(64.,0.);v[5]=vec2(38.,43.);v[6]=vec2(38.,80.);v[7]=vec2(26.,80.);v[8]=vec2(26.,43.);return polygon(p,v,9);
    }
    if(id==2)return min(orbitSoftRect(p,vec4(0.,0.,60.,12.),1.5),orbitSoftRect(p,vec4(24.,0.,36.,80.),1.5));
    if(id==3)return min(min(orbitSoftRect(p,vec4(0.,0.,12.,80.),1.5),orbitSoftRect(p,vec4(0.,0.,53.,12.),1.5)),min(orbitSoftRect(p,vec4(0.,34.,45.,46.),1.5),orbitSoftRect(p,vec4(0.,68.,53.,80.),1.5)));
    if(id==4)return min(orbitSoftRect(p,vec4(0.,0.,12.,80.),1.5),orbitSoftRect(p,vec4(0.,68.,49.,80.),1.5));
    if(id==5){
      v[0]=vec2(0.,80.);v[1]=vec2(25.,0.);v[2]=vec2(42.,0.);v[3]=vec2(67.,80.);v[4]=vec2(54.,80.);v[5]=vec2(48.,61.);v[6]=vec2(19.,61.);v[7]=vec2(13.,80.);d=polygon(p,v,8);
      v[0]=vec2(22.5,49.);v[1]=vec2(44.5,49.);v[2]=vec2(33.5,15.);return max(d,-polygon(p,v,3));
    }
    if(id==6){
      v[0]=vec2(0.,80.);v[1]=vec2(0.,0.);v[2]=vec2(12.,0.);v[3]=vec2(52.,58.);v[4]=vec2(52.,0.);v[5]=vec2(64.,0.);v[6]=vec2(64.,80.);v[7]=vec2(52.,80.);v[8]=vec2(12.,22.);v[9]=vec2(12.,80.);return polygon(p,v,10);
    }
    return max(orbitRightBox(p,vec4(0.,0.,65.,80.),26.),-orbitRightBox(p,vec4(12.,12.,53.,68.),19.));
  }
  // Light capsule strokes with deliberately enlarged, flat-left B and D counters.
  float orbitRoundLight(vec2 p,int id){
    float r=4.75;
    if(id==0){
      float o=min(orbitRightBox(p,vec4(0.,0.,59.,41.),20.),orbitRightBox(p,vec4(0.,37.,61.,80.),21.));
      float h=min(orbitRightBox(p,vec4(9.5,9.5,49.5,35.25),11.5),orbitRightBox(p,vec4(9.5,44.75,51.5,70.5),12.));return max(o,-h);
    }
    if(id==1)return min(min(capsule(p,vec2(r,r),vec2(33.,39.5),r),capsule(p,vec2(66.-r,r),vec2(33.,39.5),r)),capsule(p,vec2(33.,39.5),vec2(33.,80.-r),r));
    if(id==2)return min(capsule(p,vec2(r,r),vec2(62.-r,r),r),capsule(p,vec2(31.,r),vec2(31.,80.-r),r));
    if(id==3)return min(min(capsule(p,vec2(r,r),vec2(r,80.-r),r),capsule(p,vec2(r,r),vec2(54.-r,r),r)),min(capsule(p,vec2(r,40.),vec2(44.-r,40.),r),capsule(p,vec2(r,80.-r),vec2(54.-r,80.-r),r)));
    if(id==4)return min(capsule(p,vec2(r,r),vec2(r,80.-r),r),capsule(p,vec2(r,80.-r),vec2(52.-r,80.-r),r));
    if(id==5)return min(min(capsule(p,vec2(r,80.-r),vec2(34.,r),r),capsule(p,vec2(34.,r),vec2(68.-r,80.-r),r)),capsule(p,vec2(18.,54.),vec2(50.,54.),r));
    if(id==6)return min(min(capsule(p,vec2(r,80.-r),vec2(r,r),r),capsule(p,vec2(r,r),vec2(66.-r,80.-r),r)),capsule(p,vec2(66.-r,80.-r),vec2(66.-r,r),r));
    return max(orbitRightBox(p,vec4(0.,0.,67.,80.),33.),-orbitRightBox(p,vec4(9.5,9.5,57.5,70.5),24.));
  }
  vec2 orbitLeanPoint(vec2 p){return p+vec2(.12*(80.-p.y),0.);}
  float orbitLeanCapsule(vec2 p,vec2 a,vec2 b,float r){return capsule(p,orbitLeanPoint(a),orbitLeanPoint(b),r);}
  float orbitLeanPoly(vec2 p,vec2 a[12],int n){
    vec2 v[12];for(int i=0;i<12;i++){v[i]=vec2(0.);if(i<n)v[i]=orbitLeanPoint(a[i]);}return polygon(p,v,n);
  }
  // Softer, less steep italic: circular capsule terminals and slightly softened bowl polygons.
  float orbitSoftItalic(vec2 p,int id){
    vec2 v[12];float r=6.,d=100000.;
    if(id==0){
      v[0]=vec2(1.25,1.25);v[1]=vec2(44.,1.25);v[2]=vec2(57.,12.);v[3]=vec2(57.,29.);v[4]=vec2(48.,39.);v[5]=vec2(59.,49.);v[6]=vec2(59.,67.);v[7]=vec2(45.,78.75);v[8]=vec2(1.25,78.75);d=orbitLeanPoly(p,v,9)-1.25;
      v[0]=vec2(12.,12.);v[1]=vec2(39.,12.);v[2]=vec2(46.,18.);v[3]=vec2(46.,28.);v[4]=vec2(39.,34.);v[5]=vec2(12.,34.);float h=orbitLeanPoly(p,v,6);
      v[0]=vec2(12.,46.);v[1]=vec2(40.,46.);v[2]=vec2(48.,53.);v[3]=vec2(48.,62.);v[4]=vec2(40.,68.);v[5]=vec2(12.,68.);return max(d,-min(h,orbitLeanPoly(p,v,6)));
    }
    if(id==1)return min(min(orbitLeanCapsule(p,vec2(r,r),vec2(32.,40.),r),orbitLeanCapsule(p,vec2(64.-r,r),vec2(32.,40.),r)),orbitLeanCapsule(p,vec2(32.,40.),vec2(32.,80.-r),r));
    if(id==2)return min(orbitLeanCapsule(p,vec2(r,r),vec2(60.-r,r),r),orbitLeanCapsule(p,vec2(30.,r),vec2(30.,80.-r),r));
    if(id==3)return min(min(orbitLeanCapsule(p,vec2(r,r),vec2(r,80.-r),r),orbitLeanCapsule(p,vec2(r,r),vec2(54.-r,r),r)),min(orbitLeanCapsule(p,vec2(r,40.),vec2(44.-r,40.),r),orbitLeanCapsule(p,vec2(r,80.-r),vec2(54.-r,80.-r),r)));
    if(id==4)return min(orbitLeanCapsule(p,vec2(r,r),vec2(r,80.-r),r),orbitLeanCapsule(p,vec2(r,80.-r),vec2(51.-r,80.-r),r));
    if(id==5)return min(min(orbitLeanCapsule(p,vec2(r,80.-r),vec2(33.,r),r),orbitLeanCapsule(p,vec2(33.,r),vec2(66.-r,80.-r),r)),orbitLeanCapsule(p,vec2(19.,54.),vec2(47.,54.),5.5));
    if(id==6)return min(min(orbitLeanCapsule(p,vec2(r,80.-r),vec2(r,r),r),orbitLeanCapsule(p,vec2(r,r),vec2(65.-r,80.-r),r)),orbitLeanCapsule(p,vec2(65.-r,80.-r),vec2(65.-r,r),r));
    v[0]=vec2(1.25,1.25);v[1]=vec2(42.,1.25);v[2]=vec2(57.,9.);v[3]=vec2(65.,24.);v[4]=vec2(65.,56.);v[5]=vec2(57.,71.);v[6]=vec2(42.,78.75);v[7]=vec2(1.25,78.75);d=orbitLeanPoly(p,v,8)-1.25;
    v[0]=vec2(12.,12.);v[1]=vec2(37.,12.);v[2]=vec2(48.,19.);v[3]=vec2(54.,29.);v[4]=vec2(54.,51.);v[5]=vec2(48.,61.);v[6]=vec2(37.,68.);v[7]=vec2(12.,68.);return max(d,-orbitLeanPoly(p,v,8));
  }
  // The source logo uses diagonally opposing soft corners, not four equal caps.
  // Each quarter-plane field is analytical. Their intersection permits radii
  // larger than half a stroke's thickness without quadrant seams.
  float orbitLeafCorner(vec2 q,float r){
    return length(max(q,0.))+min(max(q.x,q.y),0.)-r;
  }
  float orbitLeafBox(vec2 p,vec4 b,vec4 r){
    vec2 size=b.zw-b.xy;
    float fit=min(min(size.x/max(r.x+r.y,.001),size.x/max(r.w+r.z,.001)),min(size.y/max(r.x+r.w,.001),size.y/max(r.y+r.z,.001)));
    r*=min(1.,fit);
    float tl=orbitLeafCorner(vec2(b.x+r.x-p.x,b.y+r.x-p.y),r.x);
    float tr=orbitLeafCorner(vec2(p.x-b.z+r.y,b.y+r.y-p.y),r.y);
    float br=orbitLeafCorner(vec2(p.x-b.z+r.z,p.y-b.w+r.z),r.z);
    float bl=orbitLeafCorner(vec2(b.x+r.w-p.x,p.y-b.w+r.w),r.w);
    return max(max(tl,tr),max(br,bl));
  }
  float orbitLeafTerminal(vec2 p,vec4 b,float strength,float flip){
    float thickness=min(b.z-b.x,b.w-b.y);
    float sharp=mix(2.7,1.3,strength),soft=thickness-sharp;
    vec4 radii=flip>.5?vec4(soft,sharp,soft,sharp):vec4(sharp,soft,sharp,soft);
    return orbitLeafBox(p,b,radii);
  }
  float orbitLeafAttachedBar(vec2 p,vec4 b,float strength){
    float sharp=mix(2.7,1.3,strength),soft=b.w-b.y-sharp;
    // Left corners are buried in a shared spine; rounding there creates seams.
    return orbitLeafBox(p,b,vec4(0.,soft,sharp,0.));
  }
  float orbitLeafStroke(vec2 p,vec2 a,vec2 b,float thickness,float strength,float flip){
    vec2 u=normalize(b-a),n=vec2(-u.y,u.x),q=p-a;
    return orbitLeafTerminal(vec2(dot(q,u),dot(q,n)),vec4(0.,-thickness*.5,length(b-a),thickness*.5),strength,flip);
  }
  float orbitLeafFamilyWidth(int id,int leafStyle){
    const float w[24]=float[24](60.,64.,60.,54.,51.,68.,64.,67.,60.,65.,61.,53.,50.,68.,65.,68.,66.,72.,66.,58.,56.,74.,72.,74.);
    return w[leafStyle*8+id];
  }
  float orbitLeafFamily(vec2 p,int id,int leafStyle){
    float w=orbitLeafFamilyWidth(id,leafStyle);
    float s=leafStyle==2?15.5:(leafStyle==1?11.5:12.);
    float strength=leafStyle==0?.25:(leafStyle==1?.72:1.);
    float d=100000.;
    if(id==0){
      // One shared middle crossbar, with open counters on either side.
      // Both the outside spine and the counters' left walls stay perfectly flat.
      float rt=leafStyle==0?20.:(leafStyle==1?28.:31.);
      float rb=leafStyle==0?22.:(leafStyle==1?30.:34.);
      float small=leafStyle==0?5.:(leafStyle==1?10.:12.);
      float ht=leafStyle==0?11.:(leafStyle==1?18.:18.);
      float hb=leafStyle==0?13.:(leafStyle==1?20.:21.);
      float upper=orbitLeafBox(p,vec4(0.,0.,w,41.),vec4(0.,rt,small,0.));
      float lower=orbitLeafBox(p,vec4(0.,38.,w,80.),vec4(0.,small,rb,0.));
      float o=min(upper,lower);
      if(leafStyle>0){
        // Round the two-bowl junction while retaining a clearly indented B waist.
        // Blend only the right-side waist: the shared crossbar/counters are untouched.
        float blend=2.4,weight=clamp(.5+.5*(lower-upper)/blend,0.,1.);
        float joined=mix(lower,upper,weight)-blend*weight*(1.-weight);
        float local=smoothstep(w*.48,w*.72,p.x)*(1.-smoothstep(7.,13.,abs(p.y-39.5)));
        o=mix(o,joined,local);
      }
      // Leaf11 uses one outer contour: a continuous right-hand stroke instead
      // of two overlapping bowl ends. The two counters and shared bar stay intact.
      if(leafStyle==2)o=orbitLeafBox(p,vec4(0.,0.,w,80.),vec4(0.,rt,rb,0.));
      float h=min(orbitLeafBox(p,vec4(s,s,w-2.-s,40.-s*.5),vec4(0.,ht,1.5,0.)),orbitLeafBox(p,vec4(s,40.+s*.5,w-s,80.-s),vec4(0.,1.5,hb,0.)));
      return max(o,-h);
    }
    if(id==1){
      // The two arms carry the logo's opposite-corner leaf rhythm.
      d=min(orbitLeafStroke(p,vec2(s*.47,s*.26),vec2(w*.5,43.),s,strength,0.),orbitLeafStroke(p,vec2(w-s*.47,s*.26),vec2(w*.5,43.),s,strength,1.));
      return min(d,orbitLeafTerminal(p,vec4((w-s)*.5,35.,(w+s)*.5,80.),strength,0.));
    }
    if(id==2){
      d=orbitLeafTerminal(p,vec4(0.,0.,w,s),strength,0.);
      return min(d,orbitLeafTerminal(p,vec4((w-s)*.5,0.,(w+s)*.5,80.),strength,0.));
    }
    if(id==3){
      // Connected joins stay quiet; the visible free terminals retain the leaf.
      d=orbitLeafBox(p,vec4(0.,0.,s,80.),vec4(1.3));
      d=min(d,orbitLeafAttachedBar(p,vec4(s*.5,0.,w,s),strength));
      d=min(d,orbitLeafAttachedBar(p,vec4(s*.5,40.-s*.46,w*.80,40.+s*.46),strength));
      return min(d,orbitLeafAttachedBar(p,vec4(s*.5,80.-s,w,80.),strength));
    }
    if(id==4){
      float sharp=mix(2.7,1.3,strength);
      d=orbitLeafBox(p,vec4(0.,0.,s,80.),vec4(s-sharp,sharp,0.,sharp));
      return min(d,orbitLeafAttachedBar(p,vec4(s*.5,80.-s,w,80.),strength));
    }
    if(id==5){
      // A remains unmistakable: two connected leaf-derived legs and a full bar.
      float r=s*.5;
      d=min(orbitLeafStroke(p,vec2(r,80.-r*.38),vec2(w*.5,r),s,strength,1.),orbitLeafStroke(p,vec2(w*.5,r),vec2(w-r,80.-r*.38),s,strength,0.));
      d=min(d,length(p-vec2(w*.5,r))-r);
      return min(d,orbitLeafTerminal(p,vec4(w*.235,53.,w*.765,53.+s*.87),strength,0.));
    }
    if(id==6){
      d=min(orbitLeafTerminal(p,vec4(0.,0.,s,80.),strength,1.),orbitLeafTerminal(p,vec4(w-s,0.,w,80.),strength,1.));
      float diagonal=orbitLeafStroke(p,vec2(s*.56,s*.43),vec2(w-s*.56,80.-s*.43),s,strength,0.);
      if(leafStyle==2){
        // Smooth the diagonal-to-stem junctions, constrained by the original
        // opposite-corner leaf envelope so the outside does not swell.
        float k=14.,h=clamp(.5+.5*(diagonal-d)/k,0.,1.);
        float joined=mix(diagonal,d,h)-k*h*(1.-h);
        float envelope=orbitLeafBox(p,vec4(0.,0.,w,80.),vec4(s-1.3,1.3,s-1.3,1.3));
        float clipRadius=8.*h*(1.-h);
        if(clipRadius<.00001)return max(joined,envelope);
        float edge=clamp(.5+.5*(joined-envelope)/clipRadius,0.,1.);
        return mix(envelope,joined,edge)+clipRadius*edge*(1.-edge);
      }
      return min(d,diagonal);
    }
    float ro=leafStyle==0?35.:(leafStyle==1?49.:60.);
    float ri=leafStyle==0?24.:(leafStyle==1?38.:44.);
    float bo=leafStyle==0?14.:(leafStyle==1?9.:10.);
    float bi=leafStyle==0?5.:2.;
    return max(orbitLeafBox(p,vec4(0.,0.,w,80.),vec4(0.,ro,bo,0.)),-orbitLeafBox(p,vec4(s,s,w-s,80.-s),vec4(0.,ri,bi,0.)));
  }
  float orbitGlyph(vec2 p,int id,int style){
    if(style==0)return orbitExpanded(p,id);
    if(style==1)return orbitHumanist(p,id);
    if(style==2)return orbitCondensed(p,id);
    if(style==3)return orbitSlab(p,id);
    if(style==4)return orbitForward(p,id);
    if(style==5)return orbitBalanced(p,id);
    if(style==6)return orbitRoundLight(p,id);
    if(style==7)return orbitSoftItalic(p,id);
    return orbitLeafFamily(p,id,clamp(style-8,0,2));
  }
  const float orbitGlyphWidths[88]=float[88](${styles.flatMap(s=>s.widths).map(n=>Number.isInteger(n)?`${n}.`:`${n}`).join(',')});
  float orbitWidth(int id,int style){return orbitGlyphWidths[clamp(style,0,10)*8+clamp(id,0,7)];}
  float orbitTracking(int style){return style==0?11.:style==1?11.:style==2?13.:style==3?10.:style==4?8.:style==5?9.:style==6?10.:style==7?7.:style==8?9.:10.;}
  float orbitTotalWidth(int style){const float totals[11]=float[11](${styles.map(s=>Number.isInteger(s.width)?`${s.width}.`:`${s.width}`).join(',')});return totals[clamp(style,0,10)];}
  `;
  const critique = Object.freeze([
    'Read all eight letters at both final lockup size and header size; preserve BYTELAND in that order.',
    'B: one shared center crossbar of 14 / 13 / 11 / 11 / 14 / 12 / 9.5 / 12 units; uninterrupted straight spine and two open flat-left counters.',
    'D: uninterrupted straight left spine and flat-left counter; the right contour alone should form the bowl.',
    'Compare silhouettes in monochrome: wide square / round / tall chamfer / slab / slanted cut must differ without relying on color.',
    'Inspect Y junction, A counter and N diagonal at small size; Round Light uses 9.5-unit strokes, so reveal erosion should stay below 4.5 units.',
    'Forward glyphs use transformed polygon vertices. Their straight left spines deliberately lean forward by 10.2 degrees.',
    'Leaf Soft / Leaf Organic / Leaf Bold reuse the original logo’s diagonally opposing soft corners; larger radii are formed with seam-free analytical corner fields.',
    'Leaf families keep flat B/D spines and flat-left counters. Their single B crossbars measure 12 / 11.5 / 15.5 units; the greater curvature deliberately shifts to the right-hand bowls.',
    'Leaf Soft is the restrained everyday wordmark, Leaf Organic makes the logo-to-type relationship most balanced, and Leaf Bold is intended for larger brand moments. Check its strong D shoulder and broad leaf terminals at small sizes.',
    'Only the parent shader supplies color; gradient stops must be #007aff, #34c759, and #ff3b30.'
  ]);
  scope.BytelandWordmarks = Object.freeze({ glsl, styles: Object.freeze(styles), critique, capHeight: 80, letters: 'BYTELAND' });
  if(typeof module!=='undefined')module.exports=scope.BytelandWordmarks;
})(globalThis);
