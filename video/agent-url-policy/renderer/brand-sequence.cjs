'use strict';
const D=require('../brand/design.js');
function timeline(hold=2.8){if(!Number.isFinite(hold)||hold<0)throw Error('hold must be nonnegative');return {cornerStart:10.2,cornerHoldSeconds:hold,returnStart:10.2+hold,duration:15.2+hold};}
function stateAt(elapsed,width,height,hold=2.8){const T=timeline(hold);const story=elapsed<=10.2?elapsed:elapsed<T.returnStart?10.2:13+elapsed-T.returnStart;const s=D.stateAt(story,width,height,1,0,4,11);s.angle=D.angleAt(elapsed,1,4);s.elapsed=elapsed;s.storyTime=story;return s;}
function transparentFragment(logoOnly=false){
 let f=D.fragment;const edits=[
 ['vec3 color=background;','vec3 color=background;\n float outputAlpha=0.;'],
 ['layered=mix(layered,material,coverage(di));','layered=mix(layered,material,coverage(di));\n outputAlpha=1.-(1.-outputAlpha)*(1.-coverage(di));'],
 ['color=mix(background,ink,coverage(best));','color=mix(background,ink,coverage(best));\n outputAlpha=coverage(best);'],
 ['color=mix(background,ink,logoOpacity);','color=mix(background,ink,logoOpacity);\n outputAlpha=logoOpacity;'],
 ['color=mix(color,textInk,coverage(wd));','color=mix(color,textInk,coverage(wd));\n outputAlpha=1.-(1.-outputAlpha)*(1.-coverage(wd));'],
 ['fragColor=vec4(color,1.);','vec3 straight=outputAlpha>.000001?(color-background*(1.-outputAlpha))/outputAlpha:vec3(0.);\n fragColor=vec4(clamp(straight,0.,1.),outputAlpha);']];
 for(const[a,b]of edits){if(!f.includes(a))throw Error('Shader hook changed: '+a);f=f.replace(a,b);}
 if(logoOnly){const hook='float wd=word(wp)*uWordScale;';if(!f.includes(hook))throw Error('Word hook changed');f=f.replace(hook,'float wd=FAR;');}
 return f;
}
module.exports={stateAt,timeline,vertex:D.vertex,fragment:D.fragment,transparentFragment,design:D};
