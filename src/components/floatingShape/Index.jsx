'use client';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import Model from './Model';
import { Environment } from '@react-three/drei'
import { useMotionValue, useSpring } from "framer-motion"
import * as THREE from 'three'

// Enhanced Camera controller with smooth mouse following
function CameraController({ mouse, targetObject }) {
  const { camera, gl, raycaster } = useThree()
  const isUserInteracting = useRef(false)
  const mouseDown = useRef({ x: 0, y: 0 })
  const spherical = useRef(new THREE.Spherical(15, Math.PI / 2, 0))
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const targetRadius = useRef(15)
  const mousePosition = useRef({ x: 0, y: 0 })
  const lastMouseMove = useRef(Date.now())

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event) => {
      event.preventDefault()
      isUserInteracting.current = true
      mouseDown.current.x = event.clientX
      mouseDown.current.y = event.clientY
    }

    const handleMouseMove = (event) => {
      // Update mouse position for camera following
      const rect = canvas.getBoundingClientRect()
      mousePosition.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mousePosition.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      lastMouseMove.current = Date.now()

      if (!isUserInteracting.current) return
      event.preventDefault()

      const deltaX = event.clientX - mouseDown.current.x
      const deltaY = event.clientY - mouseDown.current.y

      // Enhanced rotation sensitivity for smoother control
      spherical.current.theta -= deltaX * 0.008
      spherical.current.phi += deltaY * 0.008

      // Allow full vertical rotation with smooth limits
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi))

      mouseDown.current.x = event.clientX
      mouseDown.current.y = event.clientY
    }

    const handleMouseUp = (event) => {
      event.preventDefault()
      isUserInteracting.current = false
    }

    const handleClick = (event) => {
      if (isUserInteracting.current) return // Don't trigger click if we were dragging
      
      // Get mouse position in normalized device coordinates
      const rect = canvas.getBoundingClientRect()
      const mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Trigger click event that will be handled by the Model component
      const clickEvent = new CustomEvent('objectClick', { 
        detail: { mouse, camera, raycaster } 
      })
      window.dispatchEvent(clickEvent)
    }

    const handleWheel = (event) => {
      event.preventDefault()
      event.stopPropagation()
      
      // Dynamic zoom speed based on current distance and context
      const currentRadius = spherical.current.radius
      const baseZoomSpeed = 0.002
      const contextMultiplier = targetObject ? 0.5 : 1.0 // Slower zoom when focused
      const zoomSpeed = baseZoomSpeed * Math.max(0.3, currentRadius / 15) * contextMultiplier
      
      const delta = event.deltaY * zoomSpeed
      
      targetRadius.current += delta
      
      // Dynamic zoom limits based on context
      const minZoom = targetObject ? 0.8 : 3
      const maxZoom = targetObject ? 25 : 80
      
      targetRadius.current = Math.max(minZoom, Math.min(maxZoom, targetRadius.current))
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown, { passive: false })
    canvas.addEventListener('mousemove', handleMouseMove, { passive: false })
    canvas.addEventListener('mouseup', handleMouseUp, { passive: false })
    canvas.addEventListener('click', handleClick, { passive: false })
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('wheel', handleWheel)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [gl, raycaster, targetObject])

  // Handle target object changes with smooth transitions
  useEffect(() => {
    if (targetObject) {
      const targetPos = targetObject.position.clone()
      const optimalDistance = Math.max(3, Math.min(12, targetObject.distance * 0.8))
      targetRadius.current = optimalDistance
      
      // Smooth target transition
      const currentTarget = target.current.clone()
      let progress = 0
      const animateTarget = () => {
        progress += 0.04
        if (progress < 1) {
          target.current.lerpVectors(currentTarget, targetPos, progress)
          requestAnimationFrame(animateTarget)
        } else {
          target.current.copy(targetPos)
        }
      }
      animateTarget()
      
    } else {
      // Return to center
      const centerPos = new THREE.Vector3(0, 0, 0)
      targetRadius.current = 15
      
      const currentTarget = target.current.clone()
      let progress = 0
      const animateToCenter = () => {
        progress += 0.025
        if (progress < 1) {
          target.current.lerpVectors(currentTarget, centerPos, progress)
          requestAnimationFrame(animateToCenter)
        } else {
          target.current.copy(centerPos)
        }
      }
      animateToCenter()
    }
  }, [targetObject])

  useFrame(() => {
    // Enhanced mouse following behavior when not manually controlling
    if (!isUserInteracting.current) {
      const timeSinceMouseMove = Date.now() - lastMouseMove.current
      const mouseInfluence = Math.max(0, 1 - timeSinceMouseMove / 3000) // Fade over 3 seconds
      
      if (mouseInfluence > 0) {
        // More responsive mouse following
        const mouseTheta = mousePosition.current.x * 0.5 * mouseInfluence
        const mousePhi = mousePosition.current.y * 0.3 * mouseInfluence
        
        // Smoothly adjust camera based on mouse position
        const targetTheta = spherical.current.theta + mouseTheta * 0.15
        const targetPhi = spherical.current.phi + mousePhi * 0.1
        
        // Apply smooth interpolation with higher responsiveness
        spherical.current.theta += (targetTheta - spherical.current.theta) * 0.05
        spherical.current.phi += (targetPhi - spherical.current.phi) * 0.04
        
        // Keep phi in bounds
        spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi))
      }
    }

    // Smooth radius interpolation with adaptive speed
    const radiusDiff = targetRadius.current - spherical.current.radius
    const easeSpeed = Math.abs(radiusDiff) > 8 ? 0.08 : 0.04
    spherical.current.radius += radiusDiff * easeSpeed

    // Update camera position
    const position = new THREE.Vector3()
    position.setFromSpherical(spherical.current)
    position.add(target.current)
    
    camera.position.copy(position)
    camera.lookAt(target.current)
    camera.updateMatrixWorld()
  })

  return null
}

export default function Index() {
  const [targetObject, setTargetObject] = useState(null)

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  }

  // More responsive mouse tracking for better following
  const smoothMouse = {
    x: useSpring(mouse.x, {stiffness: 150, damping: 60, mass: 1.5}),
    y: useSpring(mouse.y, {stiffness: 150, damping: 60, mass: 1.5})
  }

  const manageMouse = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    const { clientX, clientY } = e;
    const x = clientX / innerWidth
    const y = clientY / innerHeight
    mouse.x.set(x);
    mouse.y.set(y);
  }, [mouse.x, mouse.y])

  useEffect( () => {
    window.addEventListener("mousemove", manageMouse)
    return () => window.removeEventListener("mousemove", manageMouse)
  }, [manageMouse])

  // Handle object interaction events
  useEffect(() => {
    const handleObjectClick = (event) => {
      setTargetObject(event.detail.clickedObject)
    }

    const handleEmptyClick = () => {
      setTargetObject(null)
    }

    window.addEventListener('objectClicked', handleObjectClick)
    window.addEventListener('emptySpaceClicked', handleEmptyClick)
    
    return () => {
      window.removeEventListener('objectClicked', handleObjectClick)
      window.removeEventListener('emptySpaceClicked', handleEmptyClick)
    }
  }, [])

  return (
    <Canvas 
      style={{background: "#e0e0e2"}} 
      camera={{
        position: [0, 0, 15],
        fov: 50, // Slightly wider FOV for better exploration
        near: 0.1,
        far: 1000
      }}
    >
        <CameraController mouse={smoothMouse} targetObject={targetObject} />
        <Model mouse={smoothMouse} onObjectClick={setTargetObject} />
        <Environment preset="studio"/>
    </Canvas>
  )
}