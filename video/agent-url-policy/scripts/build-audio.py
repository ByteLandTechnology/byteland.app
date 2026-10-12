from pathlib import Path
import wave,json,hashlib
import numpy as np
P=Path(__file__).resolve().parents[1];A=P/'out';R=P/'audio';A.mkdir(exist_ok=True);(P/'public').mkdir(exist_ok=True);SR=24000;N=1523200
rng=np.random.default_rng(812)
def read(p):
 with wave.open(str(p),'rb') as f:assert f.getframerate()==SR and f.getnchannels()==1;return np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(float)/32768
def write(p,x):
 with wave.open(str(p),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.round(np.clip(x,-1,.999969)*32768).astype('<i2').tobytes())
voice=read(R/'narration.wav');stem=np.zeros(N);stem[4*SR:4*SR+len(voice)]=voice*1.15
fx=np.zeros(N);events=[]
def add(start,x,kind):
 i=round(start*SR);k=min(len(x),N-i);fx[i:i+k]+=x[:k];events.append({'start':start,'duration':k/SR,'kind':kind,'peak_dbfs':float(20*np.log10(max(abs(x))))})
def pop(start,f=880,d=.105,amp=.026):
 t=np.arange(round(SR*d))/SR;phase=2*np.pi*f*(t+.065*.025*(1-np.exp(-t/.025)));env=(1-np.exp(-t/.003))*np.exp(-t/.024)*np.minimum(1,(d-t)/.018);x=amp*env*(np.sin(phase)+.12*np.sin(2*phase))/1.12;add(start,x,'soft rounded pop')
def chime(start,f,d=.21,amp=.025):
 t=np.arange(round(SR*d))/SR;env=(1-np.exp(-t/.004))*np.exp(-t/.060)*np.minimum(1,(d-t)/.035);add(start,amp*env*(np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*f*2*t))/1.16,'short bright mallet')
def swish(start,d=.22,amp=.013):
 k=round(d*SR);noise=rng.normal(0,1,k);freq=np.fft.rfftfreq(k,1/SR);spec=np.fft.rfft(noise);filt=np.exp(-.5*((freq-2300)/1000)**2);filt[freq<450]=0;z=np.fft.irfft(spec*filt,n=k);z/=max(abs(z));env=np.sin(np.pi*np.arange(k)/(k-1))**2;add(start,amp*z*env,'brief airy movement')
# No sustained bed, drone, sub-bass, suspense pad or reverberant tail.
pop(.20,783.99,amp=.054);pop(.43,987.77,amp=.047);pop(.67,1174.66,amp=.042)
chime(1.1,1046.50,.19,.032);swish(2.823529,.25,.022);pop(3.54,1318.51,amp=.026);swish(3.65,.24,.017)
timing=json.loads((P/'src/timing.json').read_text())
for j,start in enumerate(timing['scenes'][1:]):
 swish(start,.15,.009);pop(start+.07,[783.99,987.77,1046.5][j%3],.085,.015)
swish(61.30,.24,.021);chime(61.74,1046.5,.24,.038);chime(61.94,1318.51,.24,.035);chime(62.17,1567.98,.29,.032)
# Smooth narration ducking applies only to FX using interpolated 50 ms RMS windows.
window=1200;levels=np.array([np.sqrt(np.mean(stem[i:i+window]**2)) for i in range(0,N,window)])
env=np.interp(np.arange(N),np.arange(len(levels))*window,levels);duck=1-.65*np.clip(env/.035,0,1);fx*=duck
fx[:4*SR]*=1.5
u=np.clip((np.arange(N)/SR-61.46)/.08,0,1);fx*=1+.5*(u*u*u*(u*(u*6-15)+10))
mix=stem+fx;assert np.isfinite(mix).all() and max(abs(mix))<.85
for name,x in [('narration-stem-v8',stem),('sfx-original',fx),('background-original',np.zeros(N)),('narration-sfx',mix),('narration-mix-final',mix)]:write(A/(name+'.wav'),x)
write(P/'public/narration-sfx.wav',mix)
r={'duration':N/SR,'sample_rate':SR,'narration_start':4,'narration_source_sha256':hashlib.sha256((R/'narration.wav').read_bytes()).hexdigest(),'narration_gain':1.15,'narration_speed_change':False,'narration_samples':len(voice),'background_bed':False,'synth_seed':812,'events':events,'mix_peak_dbfs':float(20*np.log10(max(abs(mix)))),'clipped_samples':int(np.sum(abs(mix)>=1)),'fx_peak_dbfs':float(20*np.log10(max(abs(fx)))),'fx_silent_sample_fraction':float(np.mean(abs(fx)<1e-10)),'listening_performed':False,'listening_limit':'No actual audio listening tool is available; synthesis design and objective analysis only.'}
(A/'audio-design.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
