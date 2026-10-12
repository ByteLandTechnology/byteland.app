import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Video,durationInFrames} from './Video';
const Root=()=> <Composition id="AgentURLPolicy" component={Video} durationInFrames={durationInFrames} fps={60} width={1280} height={720}/>;
registerRoot(Root);
