import React,{useLayoutEffect,useRef} from 'react';
import data from './brand-render-data.json';
export function BrandCanvas({time}:{time:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 const ctx=useRef<{gl:WebGL2RenderingContext;program:WebGLProgram}|null>(null);
 useLayoutEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  if(!ctx.current){
   const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:false,antialias:true,preserveDrawingBuffer:true});if(!gl)throw Error('WebGL2 required for brand SDF');
   const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'Compile error');return s;};
   const program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,data.vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,data.fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Link error');gl.useProgram(program);gl.bindVertexArray(gl.createVertexArray());ctx.current={gl,program};
  }
  const {gl,program}=ctx.current;const s=data.states[Math.min(data.states.length-1,Math.max(0,Math.round(time*60)))];gl.viewport(0,0,1280,720);
  const set=(name:string,v:number|number[])=>{const l=gl.getUniformLocation(program,name);if(Array.isArray(v)){if(v.length===2)gl.uniform2f(l,v[0],v[1]);else gl.uniform3f(l,v[0],v[1],v[2]);}else gl.uniform1f(l,v);};
  set('uResolution',[1280,720]);set('uDpr',1);set('uLogoCenter',s.center);set('uLogoScale',s.logoScale);set('uAngle',s.angle);set('uGrowth',s.growth);set('uWordOrigin',s.wordOrigin);set('uWordScale',s.wordScale);set('uReveal',s.reveal);set('uVariant',s.variant);set('uLeafAngles',s.turns);set('uLeafFold',s.fold);set('uLeafZoom',s.zooms);set('uFont',s.font);set('uB5Fusion',s.fusion||0);set('uB5Crossing',s.crossFusion||0);set('uTitlePull',s.titlePull?1:0);set('uTitleWidth',s.titleWidth||0);s.offsets.forEach((v:number[],i:number)=>set(`uLeafPositions[${i}]`,v));gl.drawArrays(gl.TRIANGLES,0,3);
 },[time]);
 return <canvas ref={ref} width={1280} height={720} style={{width:'100%',height:'100%',position:'absolute',zIndex:2,opacity:1,pointerEvents:'none'}}/>;
}
