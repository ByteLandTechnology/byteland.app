from pathlib import Path
import sys,json,subprocess,time
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];ASSET=ROOT
sys.path.insert(0,str(ROOT/'renderer'))
from brand_renderer import Renderer
states=json.loads((ASSET/'src/brand-render-data.json').read_text())['states']
r=Renderer(1280,720);start=time.monotonic()
proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','60','-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/'out/video-silent.mp4')],stdin=subprocess.PIPE)
keys=[0,26,84,155,202,214,216,220,226,232,240,248,256,258,300,930,1800,2700,3678,3682,3687,3688,3694,3700,3706,3710,3720,3750,3780,3807,3810,3820,3830,3840,3850,3860,3867]
for i,st in enumerate(states):
 t=i/60;im=Image.new('RGBA',(1280,720),(247,249,252,255))
 body=Image.open(ASSET/'out/frames'/f'{i:04}.png').convert('RGBA');im.alpha_composite(body)
 # One persistent foreground SDF layer; no scene index, parent opacity or chapter mask.
 if 4<=t<61.46:im.alpha_composite(r.render(st,160,160,mode='tile'),(0,0))
 else:im.alpha_composite(r.render(st,1280,720,mode='transparent'))
 im=im.convert('RGB')
 proc.stdin.write(im.tobytes())
 if i in keys:im.save(ROOT/'out'/f'key-{i:04}.png')
 if i%120==0:print('Frame',i,'elapsed',round(time.monotonic()-start,1),flush=True)
proc.stdin.close();assert proc.wait()==0
print('Rendered full film',round(time.monotonic()-start,1),flush=True)
