import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PosterLighting from './PosterLighting';
import PosterWall from './PosterWall';
import PosterParticles from './PosterParticles';
import PosterFallback from './PosterFallback';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function CinemaPosterScene({
  scrollProgress = 0,
  onSelectPoster,
  compact = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const [webglReady] = useState(() => detectWebGL());
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportTier, setViewportTier] = useState('desktop');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const updateTier = () => {
      const w = window.innerWidth;
      if (w < 640) setViewportTier('mobile');
      else if (w < 1024) setViewportTier('tablet');
      else setViewportTier('desktop');
    };
    updateTier();
    window.addEventListener('resize', updateTier);
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fallbackNode = <PosterFallback onSelectPoster={onSelectPoster} />;

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {!webglReady ? (
        fallbackNode
      ) : (
        <WebGLErrorBoundary fallback={fallbackNode}>
          <Suspense fallback={fallbackNode}>
            <Canvas
              dpr={viewportTier === 'mobile' ? [1, 1.35] : [1, 1.75]}
              camera={{ position: [0, 0, compact ? 7.8 : 7.4], fov: 46, near: 0.1, far: 40 }}
              frameloop={isVisible ? 'always' : 'demand'}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
              }}
            >
              <fog attach="fog" args={['#F4EDE1', 8.5, 19]} />
              <PosterLighting />
              <PosterWall
                viewportTier={compact ? 'tablet' : viewportTier}
                scrollProgress={scrollProgress}
                reducedMotion={reducedMotion}
                onSelectPoster={onSelectPoster}
              />
              {viewportTier !== 'mobile' && (
                <PosterParticles count={compact ? 50 : 95} reducedMotion={reducedMotion} />
              )}
            </Canvas>
          </Suspense>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}

