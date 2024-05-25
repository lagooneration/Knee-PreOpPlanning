import { OrbitControls } from '@react-three/drei'


import GLTFModel from './components/TestingBone'



function Scene() {
    

    return (
        <>
            

            <OrbitControls makeDefault />

            <directionalLight
                position={[-2, 2, 3]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024 * 2, 1024 * 2]}
            />
            <ambientLight intensity={0.2} />
            
            
            
        </>
    );
};

export { Scene }
