import React, { useEffect, useState, useRef } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useTransform } from 'framer-motion';
import { motion } from 'framer-motion-3d';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Model({mouse, onObjectClick}) {
  const [activeShape, setActiveShape] = useState(1);
  const meshRefs = useRef([]);

  useEffect( () => {
    setTimeout( () => {
      if(activeShape == 11){
        setActiveShape(1)
      }
      else{
        setActiveShape(activeShape + 1)
      }
    }, 2000)
  }, [activeShape])

  const { nodes } = useGLTF("/medias/floating_shapes4.glb");
  
  // Enhanced spacing for better exploration - objects spread across larger area
  const positions = [
    [0, 0, 0],          // Center object
    [30, 20, -18],      // Far right, high, back
    [-25, 15, 35],      // Far left, up, far front
    [18, -30, 22],      // Right, far down, front
    [-35, 8, -25],      // Far left, center, back
    [28, 40, 30],       // Right, very high, front
    [-12, -35, -30],    // Left, far low, far back
    [-22, 35, -28],     // Left, very high, back
    [40, -15, 12],      // Very far right, low, center
    [-30, -25, 35],     // Far left, low, far front
    [22, 18, -22]       // Right, up, back
  ];

  // Individual speed and movement settings for each object
  const objectSettings = [
    { speed: 1.2, rotationIntensity: 0.8, floatIntensity: 1.0, floatingRange: [-0.2, 0.2] },
    { speed: 2.1, rotationIntensity: 1.5, floatIntensity: 1.8, floatingRange: [-0.3, 0.3] },
    { speed: 0.8, rotationIntensity: 0.5, floatIntensity: 0.7, floatingRange: [-0.15, 0.15] },
    { speed: 1.7, rotationIntensity: 1.2, floatIntensity: 1.4, floatingRange: [-0.25, 0.25] },
    { speed: 1.0, rotationIntensity: 0.9, floatIntensity: 1.1, floatingRange: [-0.18, 0.18] },
    { speed: 2.5, rotationIntensity: 2.0, floatIntensity: 2.2, floatingRange: [-0.35, 0.35] },
    { speed: 1.4, rotationIntensity: 1.0, floatIntensity: 1.3, floatingRange: [-0.22, 0.22] },
    { speed: 1.9, rotationIntensity: 1.6, floatIntensity: 1.7, floatingRange: [-0.28, 0.28] },
    { speed: 0.6, rotationIntensity: 0.4, floatIntensity: 0.5, floatingRange: [-0.12, 0.12] },
    { speed: 2.3, rotationIntensity: 1.8, floatIntensity: 2.0, floatingRange: [-0.32, 0.32] },
    { speed: 1.6, rotationIntensity: 1.3, floatIntensity: 1.5, floatingRange: [-0.26, 0.26] }
  ];

  // Enhanced click detection with empty space handling
  useEffect(() => {
    const handleObjectClick = (event) => {
      const { mouse, camera, raycaster } = event.detail;
      
      // Set up raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Get all mesh objects that are currently rendered
      const meshes = meshRefs.current.filter(ref => ref.current);
      const objects = meshes.map(ref => ref.current);
      
      // Check for intersections with objects
      const intersects = raycaster.intersectObjects(objects, true); // recursive = true for nested objects
      
      if (intersects.length > 0) {
        // Object was clicked
        const clickedObject = intersects[0].object;
        
        // Find the position of the clicked object
        const worldPosition = new THREE.Vector3();
        clickedObject.getWorldPosition(worldPosition);
        
        // Create enhanced object info
        const objectInfo = {
          position: worldPosition,
          distance: intersects[0].distance,
          object: clickedObject,
          point: intersects[0].point
        };
        
        // Notify parent component
        if (onObjectClick) {
          onObjectClick(objectInfo);
        }
        
        // Dispatch event for camera controller
        const objectClickedEvent = new CustomEvent('objectClicked', {
          detail: { clickedObject: objectInfo }
        });
        window.dispatchEvent(objectClickedEvent);
        
        console.log('Object clicked at:', worldPosition, 'Distance:', intersects[0].distance);
        
      } else {
        // Empty space was clicked - return to overview
        console.log('Empty space clicked - returning to center view');
        
        // Notify parent component
        if (onObjectClick) {
          onObjectClick(null);
        }
        
        // Dispatch event for camera controller
        const emptyClickEvent = new CustomEvent('emptySpaceClicked');
        window.dispatchEvent(emptyClickEvent);
      }
    };

    window.addEventListener('objectClick', handleObjectClick);
    return () => window.removeEventListener('objectClick', handleObjectClick);
  }, [onObjectClick]);

  return (
    <group>
      <Mesh ref={el => meshRefs.current[0] = el} node={nodes.Sphere001} multiplier={2.4} mouse={mouse} isActive={activeShape == 1} position={positions[0]} settings={objectSettings[0]}/>
      <Mesh ref={el => meshRefs.current[1] = el} node={nodes.Sphere002} multiplier={2.4} mouse={mouse} isActive={activeShape == 2} position={positions[1]} settings={objectSettings[1]}/>
      <Mesh ref={el => meshRefs.current[2] = el} node={nodes.Cylinder002} multiplier={1.2} mouse={mouse} isActive={activeShape == 3} position={positions[2]} settings={objectSettings[2]}/>
      <Mesh ref={el => meshRefs.current[3] = el} node={nodes.Sphere003} multiplier={1} mouse={mouse} isActive={activeShape == 4} position={positions[3]} settings={objectSettings[3]}/>
      <Mesh ref={el => meshRefs.current[4] = el} node={nodes.Cylinder003} multiplier={1.8} mouse={mouse} isActive={activeShape == 5} position={positions[4]} settings={objectSettings[4]}/>
      <Mesh ref={el => meshRefs.current[5] = el} node={nodes.Cylinder005} multiplier={1.8} mouse={mouse} isActive={activeShape == 6} position={positions[5]} settings={objectSettings[5]}/>
      <Mesh ref={el => meshRefs.current[6] = el} node={nodes.Cube002} multiplier={2} mouse={mouse} isActive={activeShape == 7} position={positions[6]} settings={objectSettings[6]}/>
      <Mesh ref={el => meshRefs.current[7] = el} node={nodes.Cylinder006} multiplier={1.2} mouse={mouse} isActive={activeShape == 8} position={positions[7]} settings={objectSettings[7]}/>
      <Mesh ref={el => meshRefs.current[8] = el} node={nodes.Cylinder007} multiplier={1.6} mouse={mouse} isActive={activeShape == 9} position={positions[8]} settings={objectSettings[8]}/>
      <Mesh ref={el => meshRefs.current[9] = el} node={nodes.Cylinder009} multiplier={1.8} mouse={mouse} isActive={activeShape == 10} position={positions[9]} settings={objectSettings[9]}/>
      <Mesh ref={el => meshRefs.current[10] = el} node={nodes.Sphere} multiplier={1.5} mouse={mouse} isActive={activeShape == 11} position={positions[10]} settings={objectSettings[10]}/>
    </group>
  );
}

useGLTF.preload("/medias/floating_shapes4.glb");

const Mesh = React.forwardRef(function Mesh({node, multiplier, mouse, isActive, position: customPosition, settings}, ref) {
  const { geometry, material, position, scale, rotation } = node;
  const { camera } = useThree();
  const meshRef = useRef();
  const [distanceScale, setDistanceScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  // Random movement offsets for each object
  const randomOffset = useRef({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
    rotX: Math.random() * 0.02 - 0.01,
    rotY: Math.random() * 0.02 - 0.01,
    rotZ: Math.random() * 0.02 - 0.01
  });
  
  // Forward the ref
  useEffect(() => {
    if (ref) {
      ref.current = meshRef.current;
    }
  }, [ref]);
  
  // Use custom position if provided, otherwise use original
  const finalPosition = customPosition || position;
  
  // Enhanced mouse influence for more dynamic interaction
  const a = multiplier / 4; // Increased mouse influence
  const rotationX = useTransform(mouse.x, [0,1], [rotation.x - a, rotation.x + a]);
  const rotationY = useTransform(mouse.y, [0,1], [rotation.y - a, rotation.y + a]);
  
  // More responsive mouse influence on position
  const mouseInfluence = 0.8; // Increased from 0.3
  const positionX = useTransform(mouse.x, [0,1], [finalPosition[0] - mouseInfluence, finalPosition[0] + mouseInfluence]);
  const positionY = useTransform(mouse.y, [0,1], [finalPosition[1] + mouseInfluence, finalPosition[1] - mouseInfluence]);

  const getRandomMultiplier = () => {
    return Math.floor(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1)
  }

  // Enhanced continuous movement with more variation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * settings.speed;
      
      // More dynamic random orbital movement
      const randomMovement = {
        x: Math.sin(time + randomOffset.current.x) * 0.8,
        y: Math.cos(time * 0.7 + randomOffset.current.y) * 0.6,
        z: Math.sin(time * 0.5 + randomOffset.current.z) * 0.7
      };
      
      // Apply random movement to the mesh
      meshRef.current.position.x = finalPosition[0] + randomMovement.x;
      meshRef.current.position.y = finalPosition[1] + randomMovement.y;
      meshRef.current.position.z = finalPosition[2] + randomMovement.z;
      
      // Enhanced continuous rotation
      meshRef.current.rotation.x += randomOffset.current.rotX * settings.speed;
      meshRef.current.rotation.y += randomOffset.current.rotY * settings.speed;
      meshRef.current.rotation.z += randomOffset.current.rotZ * settings.speed;
    }
  });

  // Enhanced perspective scaling with smoother transitions
  useFrame(() => {
    if (meshRef.current && camera) {
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);
      const distance = camera.position.distanceTo(worldPosition);
      
      // More dramatic perspective scaling for better depth perception
      const baseDistance = 20;
      const perspectiveScale = baseDistance / Math.max(distance, 0.1);
      
      // Remove hover/active scaling - just use base perspective scaling
      const newScale = Math.max(0.15, Math.min(5, perspectiveScale));
      setDistanceScale(newScale);
    }
  });

  return (
    <Float
      speed={settings.speed}
      rotationIntensity={settings.rotationIntensity}
      floatIntensity={settings.floatIntensity}
      floatingRange={settings.floatingRange}
    >
      <motion.mesh
        ref={meshRef}
        castShadow={true}
        receiveShadow={true}
        geometry={geometry}
        material={material}
        position={[finalPosition[0], finalPosition[1], finalPosition[2]]}
        rotation={rotation}
        scale={[
          scale.x * distanceScale, 
          scale.y * distanceScale, 
          scale.z * distanceScale
        ]}
        rotation-y={rotationX}
        rotation-x={rotationY}
        position-x={positionX}
        position-y={positionY}
        animate={{
          rotateZ: isActive ? rotation.z + getRandomMultiplier() : null,
        }}
        transition={{type: "spring", stiffness: 75, damping: 100, mass: 3}}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      />
    </Float>
  )
});