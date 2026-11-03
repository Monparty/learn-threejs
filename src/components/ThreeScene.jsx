import { useEffect, useRef } from "react";
import * as THREE from "three";

function ThreeScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        // 1. Scene: พื้นที่ที่ใส่ทุกอย่าง
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#1e1e2a");

        // 2. Camera: มุมมองที่เรามองเห็น
        const camera = new THREE.PerspectiveCamera(
            75, // field of view (องศา)
            mount.clientWidth / mount.clientHeight, // aspect ratio
            0.1, // near
            1000, // far
        );
        camera.position.z = 5;

        // 3. Renderer: วาดภาพลง <canvas>
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        // 4. Mesh = Geometry (รูปร่าง) + Material (สีและผิว)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: "#aa3bff" });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 5. Light: MeshStandardMaterial ต้องมีแสงถึงจะเห็นสี
        const sun = new THREE.DirectionalLight(0xffffff, 2);
        sun.position.set(3, 4, 5);
        scene.add(sun, new THREE.AmbientLight(0xffffff, 0.4));

        // 6. Render loop: วาดซ้ำทุกเฟรม
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener("resize", onResize);

        // คืนทรัพยากรเมื่อออกจากหน้านี้
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", onResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100%", height: "400px" }} />;
}

export default ThreeScene;
