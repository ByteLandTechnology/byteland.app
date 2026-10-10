import { Component, createRef, type ReactNode } from "react";
import { useMotionPolicy } from "../hooks/useMotionPolicy";

type Props = {
  revision: number;
  children: ReactNode;
  className?: string;
};
type Snapshot = { left: number; top: number } | null;

/** Capture geometry before React changes the DOM, including an interrupted move. */
class CardTransition extends Component<Props & { allowMotion: boolean }> {
  private element = createRef<HTMLDivElement>();
  private animation?: Animation;

  componentDidMount() {
    // Server content stays visible; only newly added filter results fade in.
    if (this.props.allowMotion && this.props.revision > 0) {
      this.animation = this.element.current?.animate(
        [{ opacity: 0.65 }, { opacity: 1 }],
        { duration: 180, easing: "ease-out" },
      );
    }
  }

  getSnapshotBeforeUpdate(
    previous: Readonly<Props & { allowMotion: boolean }>,
  ): Snapshot {
    if (previous.revision === this.props.revision) return null;
    const bounds = this.element.current?.getBoundingClientRect();
    return bounds
      ? { left: bounds.left + window.scrollX, top: bounds.top + window.scrollY }
      : null;
  }

  componentDidUpdate(
    previous: Readonly<Props & { allowMotion: boolean }>,
    _state: unknown,
    snapshot: Snapshot,
  ) {
    if (!this.props.allowMotion) {
      this.animation?.cancel();
      return;
    }
    if (!snapshot || previous.revision === this.props.revision) return;
    this.animation?.cancel();
    const element = this.element.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = snapshot.left - bounds.left - window.scrollX;
    const y = snapshot.top - bounds.top - window.scrollY;
    // Nearby cards follow their previous positions. A result from far down the
    // page appears in place instead of flying through the viewport.
    const limit = Math.min(360, window.innerHeight * 0.5);
    if (Math.hypot(x, y) < 1 || Math.hypot(x, y) > limit) return;
    this.animation = element.animate(
      [
        { transform: `translate(${x}px, ${y}px)` },
        { transform: "translate(0px, 0px)" },
      ],
      { duration: 240, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
  }

  componentWillUnmount() {
    this.animation?.cancel();
  }

  render() {
    return (
      <div ref={this.element} data-filter-card className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

export default function FilterCardMotion(props: Props) {
  const { allowMotion } = useMotionPolicy();
  return <CardTransition {...props} allowMotion={allowMotion} />;
}
