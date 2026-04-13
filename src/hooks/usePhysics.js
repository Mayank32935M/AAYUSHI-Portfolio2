import { useEffect, useRef, useMemo } from 'react';
import Matter from 'matter-js';
import { motionValue } from 'framer-motion';

/* ── Define painting sizes ── */
export const sizeMap = {
  lg: { w: 260, h: 320 },
  md: { w: 220, h: 280 },
  sm: { w: 180, h: 230 },
};

export function usePhysics(paintings) {
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  
  // Create a map to store motion values for each painting
  const motionValues = useMemo(() => {
    const acc = {};
    paintings.forEach(p => {
      acc[p.id] = {
        x: motionValue(window.innerWidth / 2),
        y: motionValue(window.innerHeight + 500),
        rotate: motionValue(0)
      };
    });
    return acc;
  }, [paintings]);

  // Expose body refs so we can manipulate them if needed
  const bodyMap = useRef({});

  useEffect(() => {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events;

    const engine = Engine.create({
      // Set very low gravity for the "zero gravity" space feel
      gravity: { x: 0, y: -0.015, scale: 0.0005 }
    });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // We do NOT attach child canvas to the DOM since React handles visuals.
    // However, for MouseConstraint to work well, we can bind it directly to document.body
    
    // Create Walls (Bounciness: restitution = 0.8)
    const wallOptions = { isStatic: true, restitution: 0.8, render: { visible: false } };
    const thickness = 100;
    
    const walls = [
      Bodies.rectangle(width / 2, -thickness / 2, width * 3, thickness, wallOptions), // Top
      Bodies.rectangle(width / 2, height + thickness / 2 + 100, width * 3, thickness, wallOptions), // Bottom (slightly lower so they can start off-screen)
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 3, wallOptions), // Left
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 3, wallOptions) // Right
    ];
    
    Composite.add(engine.world, walls);

    // Create Painting Bodies
    const bodies = paintings.map((p, i) => {
      const dim = sizeMap[p.size];
      
      // Start them spread out horizontally grouped near the bottom of the visible screen
      const startX = (width * 0.1) + (Math.random() * (width * 0.8));
      // Give them a staggered Y spawn INSIDE the physics bounds (above the bottom floor)
      const startY = height - 150 - (i * 120) - Math.random() * 200;
      
      const body = Bodies.rectangle(startX, startY, dim.w, dim.h, {
        restitution: 0.6,    // Bounce
        friction: 0.01,
        frictionAir: 0.02,   // Floating resistance
        density: 0.005,
        render: { visible: false }
      });
      
      bodyMap.current[p.id] = body;
      
      // Apply initial random gentle spin and upward force
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
      
      return body;
    });

    Composite.add(engine.world, bodies);

    // Add Mouse Constraint for dragging
    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    
    let mConstraint = null;
    if (!isMobile) {
      const mouse = Mouse.create(document.body);
      mConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false }
        }
      });
      Composite.add(engine.world, mConstraint);
      
      // Detach scroll interactions so overlays can scroll freely natively!
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      mouse.element.removeEventListener("touchmove", mouse.mousemove);
    }

    // Gentle random drifting forces on every tick
    Events.on(engine, 'beforeUpdate', () => {
      bodies.forEach((body) => {
        // Stop moving if it's currently held by the mouse
        if (mConstraint && mConstraint.body === body) return;
        
        // Apply very tiny random forces to simulate drifting in zero-g
        if (Math.random() < 0.02) {
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015
          });
        }
      });
    });

    // Run the engine manually or using Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Update React Framer Motion values on every engine tick
    Events.on(engine, 'afterUpdate', () => {
      paintings.forEach(p => {
        const body = bodyMap.current[p.id];
        if (body) {
          const vals = motionValues[p.id];
          vals.x.set(body.position.x);
          vals.y.set(body.position.y);
          vals.rotate.set(body.angle * (180 / Math.PI)); // Convert radians to degrees
        }
      });
    });

    return () => {
      try {
        if (runner) Matter.Runner.stop(runner);
        if (engine) Matter.Engine.clear(engine);
        if (engineRef.current) Matter.Composite.clear(engineRef.current.world);
      } catch (err) {
        console.error("Physics cleanup ignored:", err);
      }
    };
  }, [paintings, motionValues]);

  return { motionValues, bodyMap, engine: engineRef.current };
}
