import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

interface GLTFModelProps {
    path: string;
}

const GLTFModel: React.FC<GLTFModelProps> = ({ path }) => {
    const { scene } = useGLTF(path);
    const modelRef = useRef<THREE.Group>(null);
    const transformControls = useRef<THREE.TransformControls>(null);
    const { camera, gl, scene: threeScene } = useThree();

    useEffect(() => {
        if (transformControls.current) {
            const controls = transformControls.current;
            const callback = (event: THREE.Event) => {
                gl.domElement.style.cursor = event.value ? 'move' : 'auto';
            };

            controls.addEventListener('dragging-changed', callback);

            return () => {
                controls.removeEventListener('dragging-changed', callback);
            };
        }
    }, [gl.domElement]);

    return (
        <>
            <TransformControls ref={transformControls} object={modelRef.current} mode="translate" />
            <group ref={modelRef} scale={[0.04, 0.04, 0.04]}  >
                <primitive object={scene}  />
            </group>
        </>
    );
};


useGLTF.preload('/models/RightFemur.gltf'); // Preload your model if needed

export default GLTFModel;
