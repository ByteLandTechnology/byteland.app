import { useEffect, useRef } from "react";
import { useMotionPolicy } from "../hooks/useMotionPolicy";
import {
  LOGO_ANGULAR_SPEED,
  logoFragmentShader,
  logoVertexShader,
} from "../lib/brand/logo-sdf";

/** An actual analytic SDF, with the identical static silhouette available at SSR. */
export default function BrandLogo({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const { reducedMotion } = useMotionPolicy();

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !fallback || reducedMotion) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;
    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    const shaders: WebGLShader[] = [];
    let frame = 0;
    let disposed = false;
    let lost = false;
    let inView = true;
    let last = 0;
    let angle = 0;
    let resolution: WebGLUniformLocation | null = null;
    let rotation: WebGLUniformLocation | null = null;
    const showFallback = () => {
      canvas.style.visibility = "hidden";
      fallback.style.visibility = "visible";
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const draw = (now: number) => {
      frame = 0;
      if (disposed || lost || !inView || document.hidden) return;
      if (last)
        angle += Math.min((now - last) / 1000, 0.1) * LOGO_ANGULAR_SPEED;
      last = now;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(rotation, angle);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.visibility = "visible";
      fallback.style.visibility = "hidden";
      frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      if (!disposed && !lost && inView && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      if (document.hidden) stop();
      else resume();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stop();
      showFallback();
    };
    // Keep the exact static logo if the GPU context is lost. Remounting retries safely.
    canvas.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", visibility);
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (inView) resume();
            else stop();
          })
        : null;
    observer?.observe(canvas);
    try {
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("SDF shader unavailable");
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw new Error("SDF shader compilation failed");
        return shader;
      };
      program = gl.createProgram();
      if (!program) throw new Error("SDF program unavailable");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, logoVertexShader));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, logoFragmentShader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("SDF program linking failed");
      gl.useProgram(program);
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      resolution = gl.getUniformLocation(program, "uResolution");
      rotation = gl.getUniformLocation(program, "uAngle");
      resume();
    } catch {
      lost = true;
      stop();
      showFallback();
    }
    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      showFallback();
      if (vao) gl.deleteVertexArray(vao);
      if (program) gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, [reducedMotion]);

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      role="img"
      aria-label="ByteLand logo"
      data-brand-logo="sdf"
    >
      {/* Analytic outline of the same settled SDF; visible without JavaScript/WebGL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={fallbackRef}
        src="/assets/images/logo.svg"
        alt=""
        width={160}
        height={160}
        className="absolute inset-0 h-full w-full"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ visibility: "hidden" }}
      />
    </span>
  );
}
