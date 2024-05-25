function Plane() {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
      scale={[10, 10, 10]}
      receiveShadow
      >
          <planeGeometry args={[2,2,12,12]} />
          <meshStandardMaterial color='grey' wireframe />
    </mesh>
  )
}

export { Plane }
