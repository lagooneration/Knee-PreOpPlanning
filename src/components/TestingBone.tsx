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

    // Example position on the model where the sphere should be attached
    const spherePosition = new Vector3(2, 3.5, 0);

    const { animate } = useControls('Model', {
        animate: true,
    })

    

    useFrame((_, delta) => {
        if (animate) {
            modelRef.current!.rotation.y += delta / 3
        }
    })



    useEffect(() => {
        if (modelRef.current) {
            // Find the specific mesh or part of the model where you want to attach the sphere
            const bone = scene.getObjectByName('BoneName'); // Replace 'BoneName' with the actual name of the bone part

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

    return (
        <>
            <group ref={modelRef} scale={[0.04, 0.04, 0.04]} rotation={[Math.PI / 2,Math.PI/2,0] }>
                <primitive object={scene} />
            </group>

            <mesh ref={sphereRef} position={spherePosition}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </>
    );
};


useGLTF.preload('/models/Femur.gltf'); // Preload your model if needed

export default GLTFModel;
