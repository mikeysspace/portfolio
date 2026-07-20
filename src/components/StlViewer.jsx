import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { asset } from "../lib/asset.js";

// A self-contained STL turntable. The part is centred and framed, then spun
// about a chosen axis (default Z — the normal to the CAD top plane) so it reads
// like a model on a turntable. Users can also drag to orbit and scroll to zoom.
//
// three.js is heavy, so this component is imported lazily by ProjectDetail;
// Vite splits it (and three) into a chunk that only loads on a CAD project page.
const UP = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };

export default function StlViewer({ src, upAxis = "z", alt }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Bail cleanly if the browser has no WebGL — the caller shows a fallback.
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
      setStatus("error");
      return;
    }

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const up = new THREE.Vector3(...UP[upAxis]);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 5000);
    camera.up.copy(up); // vertical on screen == the chosen model axis

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("role", "img");
    if (alt) renderer.domElement.setAttribute("aria-label", alt);

    // Neutral studio lighting so a matte grey part reads clearly in either theme.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1, 1.2, 1.6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(-1.4, -0.6, -1);
    scene.add(fill);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = !reduceMotion; // spin about camera.up == chosen axis
    controls.autoRotateSpeed = 1.6;

    let mesh = null;
    let raf = 0;
    let disposed = false;

    function fit(geometry) {
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z); // pivot at origin
      geometry.computeVertexNormals();

      const sphere = new THREE.Sphere();
      geometry.boundingBox.getBoundingSphere(sphere);
      const r = sphere.radius || 1;

      // Frame the part, viewed from an elevated 3/4 angle about the up axis.
      const dist = (r / Math.sin((camera.fov * Math.PI) / 180 / 2)) * 1.15;
      const flat = new THREE.Vector3(...UP[upAxis === "y" ? "x" : "y"]);
      const dir = new THREE.Vector3()
        .addScaledVector(flat, 1)
        .addScaledVector(up, 0.55)
        .normalize();
      camera.position.copy(dir.multiplyScalar(dist));
      camera.near = dist / 100;
      camera.far = dist * 100;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.update();
    }

    function resize() {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    new STLLoader().load(
      asset(src),
      (geometry) => {
        if (disposed) {
          geometry.dispose();
          return;
        }
        const material = new THREE.MeshStandardMaterial({
          color: 0xb9bec6,
          metalness: 0.25,
          roughness: 0.55,
          flatShading: false,
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        resize();
        fit(geometry);
        setStatus("ready");

        const tick = () => {
          raf = requestAnimationFrame(tick);
          controls.update();
          renderer.render(scene, camera);
        };
        tick();
      },
      undefined,
      () => !disposed && setStatus("error")
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [src, upAxis, alt]);

  return (
    <div className="stl-viewer">
      <div className="stl-canvas" ref={mountRef} />
      {status === "loading" && (
        <div className="stl-overlay">Loading 3D model…</div>
      )}
      {status === "error" && (
        <div className="stl-overlay">3D preview unavailable</div>
      )}
      {status === "ready" && (
        <span className="stl-hint">Drag to rotate · scroll to zoom</span>
      )}
    </div>
  );
}
