import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const fieldVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fieldFragmentShader = `
uniform float uTime;
uniform float uPulse;
uniform float uMotion;
uniform vec2 uMouse;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p + 13.1;
    a *= 0.5;
  }
  return v;
}

mat2 rotate2D(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= 1.2;

  vec3 bgA = vec3(0.0118, 0.0118, 0.0118); // #030303
  vec3 bgB = vec3(0.0314, 0.0314, 0.0314); // #080808
  vec3 bgC = vec3(0.0627, 0.0627, 0.0627); // #101010
  vec3 accentCyan = vec3(0.2706, 0.2706, 0.2706); // #454545
  vec3 accentBlue = vec3(0.5255, 0.5255, 0.5255); // #868686

  float t = uTime * (0.08 + 0.06 * uMotion);
  vec2 flowUv = rotate2D(0.34) * p * 1.35;
  flowUv += vec2(t, -t * 0.72);
  flowUv += uMouse * 0.09;

  float flow = fbm(flowUv);
  float flowDetail = fbm(flowUv * 2.4 + vec2(-t * 1.3, t * 1.05));
  float scan = sin((p.y + flow * 0.1) * 220.0 + t * 18.0) * 0.5 + 0.5;
  float interference = sin((p.x * 42.0 - p.y * 50.0) + t * 8.0 + flowDetail * 3.2);

  float centerDistance = length((uv - 0.5) * vec2(1.2, 0.95));
  float edgeMask = smoothstep(0.18, 0.85, centerDistance);
  float calmCenter = 1.0 - smoothstep(0.0, 0.35, centerDistance);

  float pulseRing = smoothstep(0.08, 0.0, abs(centerDistance - (0.33 + uPulse * 0.05)));
  float pulse = pulseRing * edgeMask;

  vec3 base = mix(bgA, bgB, uv.y);
  base = mix(base, bgC, smoothstep(0.2, 1.0, flow));

  float techTexture = flow * 0.58 + flowDetail * 0.28 + scan * 0.14;
  base += accentCyan * techTexture * 0.12 * edgeMask;
  base += accentBlue * (interference * 0.5 + 0.5) * 0.05 * edgeMask;
  base += accentBlue * pulse * 0.45;

  // Keep hero text area calmer and darker for readability.
  base = mix(base, mix(bgA, bgB, 0.55), calmCenter * 0.6);

  float vignette = smoothstep(1.05, 0.2, length(p * vec2(1.0, 0.9)));
  base *= 0.74 + 0.26 * vignette;

  gl_FragColor = vec4(base, 1.0);
}
`;

const terrainVertexShader = `
uniform float uTime;
uniform float uPulse;
uniform float uMotion;

varying vec2 vUv;
varying float vHeight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p + 13.1;
    a *= 0.5;
  }
  return v;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float t = uTime * (0.04 + 0.11 * uMotion);
  float macro = fbm(pos.xz * 0.18 + vec2(t * 0.62, -t * 0.45));
  float micro = noise(pos.xz * 0.95 + vec2(-t * 1.3, t * 0.9));
  float ridge = sin((pos.x * 0.24 + pos.z * 0.18) - uTime * 0.42) * 0.5 + 0.5;
  float pulse = uPulse * smoothstep(0.12, 0.88, ridge);

  float displacement = (macro * 0.9 + micro * 0.35 + pulse * 0.6) * mix(0.22, 1.0, uMotion);

  // Slightly flatten center to keep text legible above the horizon line.
  float centerFlatten = smoothstep(0.0, 28.0, length(pos.xz * vec2(0.58, 0.4)));
  displacement *= mix(0.5, 1.0, centerFlatten);

  pos.y += displacement * 7.8;
  vHeight = displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const terrainFragmentShader = `
uniform float uPulse;

varying vec2 vUv;
varying float vHeight;

float gridLine(vec2 uv, float scale, float thickness) {
  vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
  float line = min(g.x, g.y);
  return 1.0 - smoothstep(0.0, thickness, line);
}

void main() {
  vec3 bgA = vec3(0.0118, 0.0118, 0.0118); // #030303
  vec3 bgB = vec3(0.0314, 0.0314, 0.0314); // #080808
  vec3 accentCyan = vec3(0.2471, 0.2471, 0.2471); // #3F3F3F
  vec3 accentBlue = vec3(0.5216, 0.5216, 0.5216); // #858585

  float fineGrid = gridLine(vUv, 90.0, 1.6);
  float majorGrid = gridLine(vUv, 18.0, 1.1);

  vec3 base = mix(bgA, bgB, vUv.y * 0.85 + vHeight * 0.18);
  vec3 color = base;

  color += accentCyan * fineGrid * 0.18;
  color += accentBlue * majorGrid * 0.28;
  color += accentCyan * (0.22 + 0.78 * majorGrid) * uPulse * 0.3;

  float centerDistance = length((vUv - 0.5) * vec2(1.3, 0.9));
  float edgeMask = smoothstep(0.2, 0.95, centerDistance);
  color = mix(base, color, edgeMask);

  gl_FragColor = vec4(color, 0.96);
}
`;

const wireFragmentShader = `
uniform float uPulse;
varying float vHeight;

void main() {
  vec3 accentCyan = vec3(0.2471, 0.2471, 0.2471); // #3F3F3F
  vec3 accentBlue = vec3(0.5216, 0.5216, 0.5216); // #858585
  vec3 color = mix(accentBlue, accentCyan, clamp(vHeight * 0.95, 0.0, 1.0));
  float pulseGlow = 0.58 + uPulse * 0.42;
  gl_FragColor = vec4(color * pulseGlow, 0.5);
}
`;

const particleVertexShader = `
uniform float uTime;
uniform float uPulse;
uniform float uMotion;
uniform vec2 uMouse;

attribute float aSeed;
attribute float aScale;

varying float vAlpha;

void main() {
  vec3 p = position;
  float t = uTime * (0.14 + 0.22 * uMotion);

  float driftX = sin(t + aSeed * 6.2831) * (1.1 + aSeed * 1.5);
  float driftY = cos(t * 0.82 + aSeed * 12.0) * (0.8 + aSeed * 1.2);
  float driftZ = sin(t * 0.62 + aSeed * 18.0) * (1.4 + aSeed * 1.3);

  p.x += driftX * uMotion + uMouse.x * (2.4 + aSeed * 1.8);
  p.y += driftY * uMotion + uPulse * (0.18 + aSeed * 0.24);
  p.z += driftZ * uMotion + uMouse.y * (2.1 + aSeed * 1.3);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float pulseScale = 1.0 + uPulse * (0.35 + aSeed * 0.65);
  gl_PointSize = aScale * pulseScale * (320.0 / -mv.z);

  vAlpha = smoothstep(-70.0, -8.0, mv.z) * (0.35 + aSeed * 0.65);
}
`;

const particleFragmentShader = `
uniform float uPulse;
varying float vAlpha;

void main() {
  vec3 accentCyan = vec3(0.2471, 0.2471, 0.2471); // #3F3F3F
  vec3 accentBlue = vec3(0.6157, 0.6157, 0.6157); // #9D9D9D

  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float softness = smoothstep(0.5, 0.0, d);

  vec3 color = mix(accentBlue, accentCyan, gl_PointCoord.y * 0.7 + uPulse * 0.3);
  gl_FragColor = vec4(color, softness * vAlpha * (0.7 + uPulse * 0.3));
}
`;

function createShaderMaterial(uniformValues, vertexShader, fragmentShader) {
  const baseUniforms = Object.entries(uniformValues).reduce((uniforms, [key, value]) => {
    uniforms[key] = { value };
    return uniforms;
  }, {});

  class CustomShaderMaterial extends THREE.ShaderMaterial {
    constructor(parameters = {}) {
      super({
        uniforms: THREE.UniformsUtils.clone(baseUniforms),
        vertexShader,
        fragmentShader,
        ...parameters
      });
    }
  }

  Object.keys(uniformValues).forEach((key) => {
    Object.defineProperty(CustomShaderMaterial.prototype, key, {
      get() {
        return this.uniforms[key].value;
      },
      set(value) {
        this.uniforms[key].value = value;
      }
    });
  });

  return CustomShaderMaterial;
}

const FieldMaterial = createShaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uMotion: 1,
    uMouse: new THREE.Vector2(0, 0)
  },
  fieldVertexShader,
  fieldFragmentShader
);

const TerrainMaterial = createShaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uMotion: 1
  },
  terrainVertexShader,
  terrainFragmentShader
);

const WireTerrainMaterial = createShaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uMotion: 1
  },
  terrainVertexShader,
  wireFragmentShader
);

const ParticleMaterial = createShaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uMotion: 1,
    uMouse: new THREE.Vector2(0, 0)
  },
  particleVertexShader,
  particleFragmentShader
);

extend({
  FieldMaterial,
  TerrainMaterial,
  WireTerrainMaterial,
  ParticleMaterial
});

const QUALITY_PRESETS = {
  low: {
    dpr: 1.1,
    terrainSegments: 110,
    particles: 700,
    bloomIntensity: 0.11,
    chromaOffset: 0.00015,
    noiseOpacity: 0.01
  },
  medium: {
    dpr: 1.35,
    terrainSegments: 170,
    particles: 1300,
    bloomIntensity: 0.15,
    chromaOffset: 0.0002,
    noiseOpacity: 0.013
  },
  high: {
    dpr: 1.6,
    terrainSegments: 220,
    particles: 2100,
    bloomIntensity: 0.2,
    chromaOffset: 0.00028,
    noiseOpacity: 0.017
  }
};

function useMediaQuery(query, fallback = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(mq.matches);
    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function resolvePreset(quality, isMobile, reducedMotion) {
  const requested = QUALITY_PRESETS[quality] ? quality : "high";
  let preset = QUALITY_PRESETS[requested];

  if (isMobile && requested === "high") preset = QUALITY_PRESETS.medium;
  if (isMobile && requested === "medium") preset = QUALITY_PRESETS.low;

  if (reducedMotion) {
    return {
      ...preset,
      particles: Math.min(360, preset.particles),
      bloomIntensity: preset.bloomIntensity * 0.65,
      chromaOffset: preset.chromaOffset * 0.4,
      noiseOpacity: preset.noiseOpacity * 0.5
    };
  }

  return preset;
}

function createParticleData(count) {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const seed = Math.random();
    seeds[i] = seed;

    positions[i3 + 0] = (Math.random() - 0.5) * 90;
    positions[i3 + 1] = Math.random() * 34 - 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;
    scales[i] = 1.6 + Math.random() * 2.8;
  }

  return { positions, scales, seeds };
}

function SceneContent({ preset, reducedMotion }) {
  const fieldRef = useRef(null);
  const terrainRef = useRef(null);
  const wireRef = useRef(null);
  const particlesRef = useRef(null);
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const pointer = useRef(new THREE.Vector2(0, 0));

  const { camera } = useThree();

  const terrainGeometry = useMemo(
    () => new THREE.PlaneGeometry(120, 86, preset.terrainSegments, preset.terrainSegments),
    [preset.terrainSegments]
  );

  const particleData = useMemo(() => createParticleData(preset.particles), [preset.particles]);

  useEffect(() => () => terrainGeometry.dispose(), [terrainGeometry]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2.0;
      const y = (event.clientY / window.innerHeight - 0.5) * 2.0;
      pointerTarget.current.set(x * 0.28, y * 0.2);
    };

    const handleLeave = () => {
      pointerTarget.current.set(0, 0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    camera.position.set(0, 7.8, 26);
    camera.lookAt(0, 2.4, 0);
  }, [camera]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motion = reducedMotion ? 0.12 : 1.0;

    const loopDuration = reducedMotion ? 20.0 : 11.0;
    const loopPhase = (elapsed % loopDuration) / loopDuration;
    const loopAngle = loopPhase * Math.PI * 2.0;
    const pulse = Math.exp(-Math.pow((loopPhase - 0.55) / 0.11, 2.0));

    pointer.current.lerp(pointerTarget.current, reducedMotion ? 0.03 : 0.07);

    const driftX = Math.sin(loopAngle * 0.42) * (reducedMotion ? 0.25 : 0.9);
    const driftY = Math.cos(loopAngle * 0.31) * (reducedMotion ? 0.16 : 0.5);
    const driftZ = Math.sin(loopAngle * 0.21) * (reducedMotion ? 0.18 : 0.6);

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      driftX + pointer.current.x * 0.95,
      0.04
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      7.8 + driftY - pointer.current.y * 0.55,
      0.04
    );
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 26 + driftZ, 0.04);
    camera.lookAt(0, 2.4, 0);

    if (fieldRef.current) {
      fieldRef.current.uTime = elapsed;
      fieldRef.current.uPulse = pulse;
      fieldRef.current.uMotion = motion;
      fieldRef.current.uMouse.copy(pointer.current);
    }

    if (terrainRef.current) {
      terrainRef.current.uTime = elapsed;
      terrainRef.current.uPulse = pulse;
      terrainRef.current.uMotion = motion;
    }

    if (wireRef.current) {
      wireRef.current.uTime = elapsed;
      wireRef.current.uPulse = pulse;
      wireRef.current.uMotion = motion;
    }

    if (particlesRef.current) {
      particlesRef.current.uTime = elapsed;
      particlesRef.current.uPulse = pulse;
      particlesRef.current.uMotion = motion;
      particlesRef.current.uMouse.copy(pointer.current);
    }
  });

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fogExp2 attach="fog" args={["#030303", reducedMotion ? 0.024 : 0.017]} />

      <mesh position={[0, 14, -38]} scale={[120, 70, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <fieldMaterial ref={fieldRef} transparent={false} />
      </mesh>

      <group position={[0, -8, -6]}>
        <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <terrainMaterial ref={terrainRef} side={THREE.DoubleSide} transparent />
        </mesh>

        <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
          <wireTerrainMaterial
            ref={wireRef}
            wireframe
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[particleData.scales, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[particleData.seeds, 1]} />
        </bufferGeometry>
        <particleMaterial
          ref={particlesRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={preset.bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.55}
        />
        <Noise opacity={preset.noiseOpacity} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette eskil offset={0.24} darkness={0.62} />
      </EffectComposer>
    </>
  );
}

export default function DeveloperBackground3DShader({
  quality = "high",
  className = "background-3d-layer"
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 900px)");

  const preset = useMemo(
    () => resolvePreset(quality, isMobile, reducedMotion),
    [quality, isMobile, reducedMotion]
  );

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, preset.dpr]}
        camera={{ position: [0, 7.8, 26], fov: 42, near: 0.1, far: 260 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneContent preset={preset} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

/*
Quick tuning presets:
- low:    quality="low"    -> light post FX + fewer particles/segments
- medium: quality="medium" -> balanced default for most laptops
- high:   quality="high"   -> richer terrain and particles for stronger GPUs
*/
