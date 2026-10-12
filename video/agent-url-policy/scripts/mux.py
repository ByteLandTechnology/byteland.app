"""Mux reconstructed PCM mix; keep the final video second intentionally silent."""
from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1]
t=json.loads((root/'src/timing.json').read_text());duration=t['durationInFrames']/t['fps']
subprocess.run(['ffmpeg','-v','error','-y','-i',str(root/'out/video-silent.mp4'),'-i',str(root/'public/narration-sfx.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','128k','-af','apad','-t',str(duration),'-movflags','+faststart',str(root/'out/agent-url-policy.mp4')],check=True)
