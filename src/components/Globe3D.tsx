import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Country, ViewState } from '../types';
import { africanCountries } from '../data/countries';

interface CountryMeshProps {
  country: Country;
  isSelected: boolean;
  isOtherSelected: boolean;
  onClick: (country: Country) => void;
}

const CountryMesh: React.FC<CountryMeshProps> = ({ 
  country, 
  isSelected, 
  isOtherSelected, 
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const opacity = isOtherSelected && !isSelected ? 0.3 : 1;
      const scale = hovered ? 1.05 : 1;
      
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = opacity;
        meshRef.current.material.transparent = opacity < 1;
      }
      
      meshRef.current.scale.setScalar(scale);
    }
  });

  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(0.08, 16, 16);
  }, []);

  return (
    <group position={country.position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={(e) => {
          e.stopPropagation();
          onClick(country);
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : hovered ? '#10b981' : '#059669'}
          emissive={isSelected ? '#1e40af' : hovered ? '#047857' : '#065f46'}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.15, 0]} center>
          <div className="country-label">
            {country.name}
          </div>
        </Html>
      )}
    </group>
  );
};

interface GlobeSceneProps {
  viewState: ViewState;
  onCountryClick: (country: Country) => void;
}

const GlobeScene: React.FC<GlobeSceneProps> = ({ viewState, onCountryClick }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  React.useEffect(() => {
    if (controlsRef.current) {
      if (viewState.mode === 'country' && viewState.selectedCountry) {
        const country = viewState.selectedCountry;
        const targetPosition = new THREE.Vector3(...country.position);
        targetPosition.multiplyScalar(2);
        
        camera.position.lerp(targetPosition, 0.1);
        controlsRef.current.target.lerp(new THREE.Vector3(...country.position), 0.1);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.1);
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      }
      controlsRef.current.update();
    }
  }, [viewState, camera]);

  const globeGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      <OrbitControls
        ref={controlsRef}
        enableRotate={false}
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={10}
      />

      {/* Globe principal */}
      <mesh ref={globeRef} geometry={globeGeometry} receiveShadow>
        <meshStandardMaterial
          color="#1e3a8a"
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Continent africain (représentation simplifiée) */}
      <mesh position={[0, 0, 1.01]}>
        <planeGeometry args={[2.5, 3]} />
        <meshStandardMaterial
          color="#065f46"
          roughness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Pays */}
      {africanCountries.map((country) => (
        <CountryMesh
          key={country.id}
          country={country}
          isSelected={viewState.selectedCountry?.id === country.id}
          isOtherSelected={!!viewState.selectedCountry && viewState.selectedCountry.id !== country.id}
          onClick={onCountryClick}
        />
      ))}
    </>
  );
};

interface Globe3DProps {
  viewState: ViewState;
  onCountryClick: (country: Country) => void;
}

export const Globe3D: React.FC<Globe3DProps> = ({ viewState, onCountryClick }) => {
  return (
    <div className="globe-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        shadows
        className="globe-canvas"
      >
        <GlobeScene viewState={viewState} onCountryClick={onCountryClick} />
      </Canvas>
    </div>
  );
};