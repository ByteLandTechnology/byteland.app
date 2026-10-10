import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useMotionPolicy } from "../hooks/useMotionPolicy";
import { MOTION } from "../lib/motion";

/**
 * A muted, looping Remotion render layered over live SVG fallback art. The
 * fallback remains visible until playback starts or if the media fails.
 */
export default function LoopVideo({
  name,
  children,
  className = "",
  style,
}: {
  /** File name under /videos, without extension. */
  name: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <LoopVideoInstance
      key={name}
      name={name}
      className={className}
      style={style}
    >
      {children}
    </LoopVideoInstance>
  );
}

function LoopVideoInstance({
  name,
  children,
  className,
  style,
}: {
  name: string;
  children: ReactNode;
  className: string;
  style?: CSSProperties;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);
  const [visibilityVersion, setVisibilityVersion] = useState(0);
  const [pageVisible, setPageVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const { reducedMotion, allowMotion } = useMotionPolicy();
  const enabled = !reducedMotion && !failed;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) {
      inViewRef.current = false;
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      inViewRef.current = true;
      return;
    }

    inViewRef.current = false;
    video.pause();
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      // Advance even if isIntersecting matches the last video element's state.
      // A newly mounted video must rerun the playback effect on its first entry.
      setVisibilityVersion((version) => version + 1);
    });
    observer.observe(video);
    return () => {
      inViewRef.current = false;
      observer.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!enabled || !allowMotion || !inViewRef.current || !pageVisible) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // Autoplay can be denied by the browser. Keep the animated SVG fallback.
    });
  }, [allowMotion, enabled, pageVisible, visibilityVersion]);

  // A reduced-motion preference may change while the page is open. If it does,
  // immediately restore the fallback and allow a later preference change to
  // retry the video.
  useEffect(() => {
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(false);
      setFailed(false);
    }
  }, [reducedMotion]);

  const handleError = () => {
    setFailed(true);
    setReady(false);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      data-video={name}
      data-motion-overlay={ready ? "video" : undefined}
    >
      {children}
      {enabled && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onError={handleError}
          onPlaying={() => {
            if (allowMotion && inViewRef.current && pageVisible) {
              setReady(true);
            }
          }}
          style={{
            transitionDuration: `${MOTION.reveal}s`,
            transitionTimingFunction: `cubic-bezier(${MOTION.ease.join(",")})`,
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            ready ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <source src={`/videos/${name}.webm`} type="video/webm" />
          <source
            src={`/videos/${name}.mp4`}
            type="video/mp4"
            onError={handleError}
          />
        </video>
      )}
    </div>
  );
}
