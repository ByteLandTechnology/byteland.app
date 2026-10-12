/** Settled E3/B5 logo field from video/agent-url-policy/brand/design.js.
 * Same leafWithSpread field at growth=spread=1, positions=0, fold=zoom=1.
 * The website does not need the video wordmark or formation shader branches.
 */
export const LOGO_ANGULAR_SPEED = 0.8; // radians/second, clockwise in screen space
export const logoVertexShader = `#version 300 es
precision highp float;
const vec2 points[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
void main(){gl_Position=vec4(points[gl_VertexID],0.,1.);}`;
export const logoFragmentShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uAngle;
float leafWithSpread(vec2 p,float g,float spread){
  vec2 b=mix(vec2(3.3),vec2(40.,16.),g);
  p-=vec2(-21.63,26.78)*spread;
  float r=mix(3.3,p.x*p.y>0.?3.:16.,g);
  r=min(r,min(b.x,b.y));
  vec2 q=abs(p)-b+r;
  return min(max(q.x,q.y),0.)+length(max(q,0.))-r;
}
vec2 rotateBack(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x+s*p.y,-s*p.x+c*p.y);}
void main(){
  float scale=min(uResolution.x,uResolution.y)/160.;
  vec2 p=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);
  vec2 local=rotateBack((p-uResolution*.5)/scale,uAngle);
  vec4 result=vec4(0.);
  // Same back-to-front order as the video: red, green, blue.
  for(int j=0;j<3;j++){
    int i=j==0?0:(j==1?2:1);
    float a=(41.+float(i)*120.)*.017453292519943;
    float d=leafWithSpread(rotateBack(local,a),1.,1.)*scale;
    float aa=max(fwidth(d),.7);
    float alpha=1.-smoothstep(-aa*.5,aa*.5,d);
    vec3 ink=i==0?vec3(255.,59.,48.)/255.:(i==1?vec3(0.,122.,255.)/255.:vec3(52.,199.,89.)/255.);
    result=vec4(ink*alpha+result.rgb*(1.-alpha),alpha+result.a*(1.-alpha));
  }
  fragColor=result;
}`;
