import HeroArt from "../../src/components/art/HeroArt";
import { Seek } from "./Seek";

/** The home page hero: the site's HeroArt, rendered frame by frame. */
export function HeroReel() {
  return (
    <Seek>
      <HeroArt />
    </Seek>
  );
}
