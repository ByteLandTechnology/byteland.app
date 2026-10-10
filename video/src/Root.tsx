import { Composition } from "remotion";
import { projects } from "../../src/config/projects";
import { FPS, LOOP_FRAMES } from "./brand";
import { HeroReel } from "./HeroReel";
import { ProjectReel } from "./ProjectReel";

// Composition ids double as file names: public/videos/<id>.{webm,mp4}.
// The site plays /videos/hero on Home and /videos/<project id> on each
// project page (see LoopVideo).
export const Root = () => (
  <>
    <Composition
      id="hero"
      component={HeroReel}
      durationInFrames={LOOP_FRAMES}
      fps={FPS}
      width={960}
      height={788}
    />
    {projects.map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={ProjectReel}
        defaultProps={{ id: p.id }}
        durationInFrames={LOOP_FRAMES}
        fps={FPS}
        width={960}
        height={600}
      />
    ))}
  </>
);
