import React, { useEffect, useRef } from "react";
import "../home.css";

function Home() {

    const fireflyRef = useRef(null);
    const angleRef = useRef(0);

  useEffect(() => {
    const firefly = fireflyRef.current;

    if (!firefly) return;

    firefly.style.position = "absolute";
    firefly.style.transition = "none"

    let angle = 0;
    const speed = 0.01;
    const radius = 100;
    let baseX = window.innerWidth / 2;
    let baseY = window.innerHeight / 2;

    function animate() {
        angle += speed;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle * 1.5) * radius;

        firefly.style.left = `${baseX + offsetX}px`;
        firefly.style.top = `${baseY + offsetY}px`;
        
        requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

//     function moveFirefly() {
//       const maxX = window.innerWidth - firefly.width;
//       const maxY = window.innerHeight - firefly.height;

//       const randomX = Math.random() * maxX;
//       const randomY = Math.random() * maxY;

//       firefly.style.left = `${randomX}px`;
//       firefly.style.top = `${randomY}px`;
//     }

//     const interval = setInterval(moveFirefly, 1000); // move every 3s slowly

//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);

    return (
        <>
            <h1 className="home-title">Firefly Finder</h1>
            <img id="firefly" ref={fireflyRef} src="/firefly-logo.gif" alt="Firefly Logo" style={{ width: "50px", height: "50px", pointerEvents: "none" }}/>
        </>
    )
}

export default Home;
