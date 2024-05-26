import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, TransformControls, OrbitControls } from '@react-three/drei';
import { Group, Mesh, SphereGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { Leva } from 'leva';
import { useControls } from 'leva';

interface GLTFModelProps {
    path: string;
}

const GLTFModel: React.FC<GLTFModelProps> = ({ path }) => {
    const { scene } = useGLTF(path);
    const modelRef = useRef<Group>(null);
    const sphereRef = useRef<Mesh>(null);
    const transformControlsRef = useRef<TransformControls>(null);
    const { gl, camera } = useThree();

    const { animate } = useControls('Model', {
        animate: true,
    })



    useFrame((_, delta) => {
        if (animate) {
            modelRef.current!.rotation.y += delta / 3
        }
    })

    useEffect(() => {
        const callback = (event: THREE.Event) => {
            gl.domElement.style.cursor = event.value ? 'move' : 'auto';
        };

        if (transformControlsRef.current) {
            transformControlsRef.current.addEventListener('dragging-changed', callback);

            return () => {
                if (transformControlsRef.current) {
                    transformControlsRef.current.removeEventListener('dragging-changed', callback);
                }
            };
        }
    }, [gl.domElement]);

    // Position at the bottom end of the bone
    const spherePosition = new Vector3(93, 9, 0); // Adjust this position based on your model

    useEffect(() => {
        if (modelRef.current) {
            // Add the sphere as a child of the model
            const bone = modelRef.current;

            if (bone) {
                // Create a group to attach the sphere to the bone
                const attachPoint = new Group();
                attachPoint.position.copy(spherePosition);
                bone.add(attachPoint);

                // Attach the sphere to the attachPoint group
                if (sphereRef.current) {
                    attachPoint.add(sphereRef.current);
                }
            }
        }
    }, [scene]);


    useFrame(() => {
        if (modelRef.current && sphereRef.current) {
            const sphereWorldPosition = new Vector3();
            sphereRef.current.getWorldPosition(sphereWorldPosition);

            const modelWorldPosition = new Vector3();
            modelRef.current.getWorldPosition(modelWorldPosition);

            // Calculate the offset from the model's center to the sphere
            const offset = sphereWorldPosition.sub(modelWorldPosition);

            // Rotate the model based on the offset
            modelRef.current.rotation.x = offset.y * 0.1;
            modelRef.current.rotation.y = offset.x * 0.1;
        }
    });

    return (
        <>
            <TransformControls ref={transformControlsRef} object={sphereRef.current} mode="translate" />

            
            <group ref={modelRef} scale={[0.04, 0.04, 0.04]} rotation={[Math.PI / 2,Math.PI/2,0] }>
                <primitive object={scene} />
            </group>

            <mesh ref={sphereRef} position={spherePosition}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshNormalMaterial />
            </mesh>
        </>
    );
};


useGLTF.preload('/models/Femur.gltf'); // Preload your model if needed

export default GLTFModel;
