const fs=require('fs'),path=require('path'),crypto=require('crypto');
fs.mkdirSync(path.join(__dirname,'out'),{recursive:true});
const root=__dirname,modules=path.resolve(root,'node_modules');
require(path.join(modules,'esbuild')).buildSync({entryPoints:[path.join(root,'src/Video.tsx')],outfile:path.join(root,'out/frame.cjs'),bundle:true,platform:'node',format:'cjs',nodePaths:[modules],external:['react','remotion'],jsx:'automatic'});
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {Frame,durationInFrames}=require('./out/frame.cjs');
const dir=path.join(root,'out/frames');fs.mkdirSync(dir,{recursive:true});
const hashes={};for(let frame=0;frame<durationInFrames;frame++){
 const svg=renderToStaticMarkup(React.createElement(Frame,{frame}));

 fs.writeFileSync(path.join(dir,`${String(frame).padStart(4,'0')}.svg`),svg);
 hashes[frame]=crypto.createHash('sha256').update(svg).digest('hex');
}
fs.writeFileSync(path.join(root,'out/frame-manifest.json'),JSON.stringify({durationInFrames,fps:60,width:1600,height:900,hashes},null,2));
console.log(`Saved ${durationInFrames} exact React Frame component SVGs.`);
