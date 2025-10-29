'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [FloatingShape, setFloatingShape] = useState(null);

  useEffect(() => {
    // Dynamically import the component only on client side
    import('../components/floatingShape').then((module) => {
      setFloatingShape(() => module.default);
    });
  }, []);

  if (!FloatingShape) {
    return (
      <main className={styles.main}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading 3D Scene...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <FloatingShape />
    </main>
  )
}