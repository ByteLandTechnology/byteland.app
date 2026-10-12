from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import os,sys,time
P=Path(__file__).parent
os.environ['XDG_CACHE_HOME']=str(P/'out/cache');(P/'out/cache').mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(P/'renderer'));from raster import raster
def one(p):
 raster(p,p.with_suffix('.png'),1280,720,1600,900);return p.name
if __name__=='__main__':
 t=time.monotonic()
 with ProcessPoolExecutor(max_workers=4) as ex:
  for i,name in enumerate(ex.map(one,sorted((P/'out/frames').glob('*.svg')))):
   if i%100==0:print(i,name,round(time.monotonic()-t,1),flush=True)
 print('Rendered all exact component frames.',round(time.monotonic()-t,1),flush=True)
