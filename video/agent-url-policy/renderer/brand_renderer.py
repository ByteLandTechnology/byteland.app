"""Approved E3/B5 SDF renderer. No browser, remote mutation, or raster-keying.
RGBA output is straight alpha. The backing surface defaults to1280x720.
"""
from pathlib import Path
import ctypes as C,json,subprocess,os
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
HELPER=ROOT/'brand-sequence.cjs'
def load_states(times,width=1280,height=720,hold=2.8):
 code="const H=require(process.argv[1]);const ts=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(JSON.stringify(ts.map(t=>H.stateAt(t,+process.argv[2],+process.argv[3],+process.argv[4]))))"
 return json.loads(subprocess.check_output(['node','-e',code,str(HELPER),str(width),str(height),str(hold)],input=json.dumps(list(times)),text=True))
class Renderer:
 def __init__(self,max_width=1280,max_height=720):
  os.environ.setdefault('LIBGL_ALWAYS_SOFTWARE','true');os.environ.setdefault('MESA_SHADER_CACHE_DIR',str(ROOT/'.mesa-cache'));self.W=max_width;self.H=max_height
  E=C.CDLL('libEGL.so.1');self.E=E;ptr=C.c_void_p;I=C.c_int;U=C.c_uint;F=C.c_float;self.ptr=ptr;self.I=I;self.U=U;self.F=F
  def egl(name,ret,args):
   f=getattr(E,name);f.restype=ret;f.argtypes=args;return f
  getproc=egl('eglGetProcAddress',ptr,[C.c_char_p])
  def gl(name,ret,args):
   p=getproc(name.encode());assert p,name+' unavailable';return C.CFUNCTYPE(ret,*args)(p)
  self.gl=gl
  display=C.CFUNCTYPE(ptr,U,ptr,ptr)(getproc(b'eglGetPlatformDisplayEXT'))(0x31DD,None,None);self.display=display
  a,b=I(),I();assert egl('eglInitialize',U,[ptr,C.POINTER(I),C.POINTER(I)])(display,C.byref(a),C.byref(b))
  assert egl('eglBindAPI',U,[U])(0x30A0)
  attrs=(I*13)(0x3024,8,0x3023,8,0x3022,8,0x3033,1,0x3040,0x40,0x3021,8,0x3038);config=ptr();n=I()
  assert egl('eglChooseConfig',U,[ptr,C.POINTER(I),C.POINTER(ptr),I,C.POINTER(I)])(display,attrs,C.byref(config),1,C.byref(n)) and n.value
  self.surface=egl('eglCreatePbufferSurface',ptr,[ptr,ptr,C.POINTER(I)])(display,config,(I*5)(0x3057,max_width,0x3056,max_height,0x3038))
  self.context=egl('eglCreateContext',ptr,[ptr,ptr,ptr,C.POINTER(I)])(display,config,None,(I*3)(0x3098,3,0x3038));assert self.context
  assert egl('eglMakeCurrent',U,[ptr,ptr,ptr,ptr])(display,self.surface,self.surface,self.context)
  self.engine=gl('glGetString',C.c_char_p,[U])(0x1F01).decode()
  self.source=json.loads(subprocess.check_output(['node','-e',"const H=require(process.argv[1]);console.log(JSON.stringify({vertex:H.vertex,opaque:H.fragment,transparent:H.transparentFragment(),tile:H.transparentFragment(true)}))",str(HELPER)],text=True))
  self.create_shader=gl('glCreateShader',U,[U]);self.shader_source=gl('glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)]);self.compile_shader=gl('glCompileShader',None,[U]);self.get_shader=gl('glGetShaderiv',None,[U,U,C.POINTER(I)]);self.get_log=gl('glGetShaderInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
  self.vs=self.shader(0x8B31,self.source['vertex']);self.programs={};self.current=None
  vao=U();gl('glGenVertexArrays',None,[I,C.POINTER(U)])(1,C.byref(vao));gl('glBindVertexArray',None,[U])(vao)
  self.uf=gl('glUniform1f',None,[I,F]);self.u2f=gl('glUniform2f',None,[I,F,F]);self.u3f=gl('glUniform3f',None,[I,F,F,F]);self.viewport=gl('glViewport',None,[I,I,I,I]);self.draw=gl('glDrawArrays',None,[U,I,I]);self.read=gl('glReadPixels',None,[I,I,I,I,U,U,ptr]);self.finish=gl('glFinish',None,[])
 def shader(self,typ,source):
  s=self.create_shader(typ);src=C.c_char_p(source.encode());self.shader_source(s,1,C.byref(src),None);self.compile_shader(s);ok=self.I();self.get_shader(s,0x8B81,C.byref(ok))
  if not ok.value:
   out=C.create_string_buffer(20000);self.get_log(s,20000,None,out);raise RuntimeError(out.value.decode())
  return s
 def use(self,mode='transparent'):
  if self.current==mode:return
  I,U=self.I,self.U;gl=self.gl
  if mode not in self.programs:
   fs=self.shader(0x8B30,self.source[mode]);p=gl('glCreateProgram',U,[])();attach=gl('glAttachShader',None,[U,U]);attach(p,self.vs);attach(p,fs);gl('glLinkProgram',None,[U])(p);ok=I();gl('glGetProgramiv',None,[U,U,C.POINTER(I)])(p,0x8B82,C.byref(ok));assert ok.value,'Link failed'
   names=['uResolution','uDpr','uLogoCenter','uLogoScale','uAngle','uGrowth','uWordOrigin','uWordScale','uReveal','uVariant','uLeafPositions[0]','uLeafPositions[1]','uLeafPositions[2]','uLeafAngles','uLeafFold','uLeafZoom','uFont','uB5Fusion','uB5Crossing','uTitlePull','uTitleWidth'];getloc=gl('glGetUniformLocation',I,[U,C.c_char_p]);loc={name:getloc(p,name.encode())for name in names};self.programs[mode]=(p,loc)
  p,self.loc=self.programs[mode];gl('glUseProgram',None,[U])(p);self.current=mode
 def render(self,s,w=1280,h=720,mode='transparent'):
  assert 0<w<=self.W and 0<h<=self.H,'Increase backing surface at Renderer construction'
  self.use(mode);l=self.loc;self.viewport(0,0,w,h);self.u2f(l['uResolution'],w,h);self.uf(l['uDpr'],1);self.u2f(l['uLogoCenter'],*s['center']);self.uf(l['uLogoScale'],s['logoScale']);self.uf(l['uAngle'],s['angle']);self.u3f(l['uGrowth'],*s['growth']);self.u2f(l['uWordOrigin'],*s['wordOrigin']);self.uf(l['uWordScale'],s['wordScale']);self.uf(l['uReveal'],s['reveal']);self.uf(l['uVariant'],s['variant']);self.u3f(l['uLeafAngles'],*s['turns']);self.u3f(l['uLeafFold'],*s['fold']);self.u3f(l['uLeafZoom'],*s['zooms']);self.uf(l['uFont'],s['font']);self.uf(l['uB5Fusion'],s.get('fusion',0));self.uf(l['uB5Crossing'],s.get('crossFusion',0));self.uf(l['uTitlePull'],1 if s.get('titlePull') else 0);self.uf(l['uTitleWidth'],s.get('titleWidth',0))
  for i in range(3):self.u2f(l[f'uLeafPositions[{i}]'],*s['offsets'][i])
  self.draw(4,0,3);self.finish();out=np.zeros((h,w,4),dtype=np.uint8);self.read(0,0,w,h,0x1908,0x1401,out.ctypes.data_as(self.ptr));return Image.fromarray(out[::-1].copy())
