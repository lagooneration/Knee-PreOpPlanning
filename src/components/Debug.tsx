import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { Cube } from './Cube'
import { Plane } from './Plane'
import { Sphere } from './Sphere'

import GLTFModel from './TestingBone'

function Debug() {




    return (
        <>
            {performance && <Perf position='top-left' />}

            
            <directionalLight
                position={[-2, 2, 3]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024 * 2, 1024 * 2]}
            />

            <ambientLight intensity={0.2} />
            <GLTFModel  path='/models/Femur.gltf' />
            
            
            <Plane />


        </>
    );
};

export { Debug }