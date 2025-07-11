import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/Logo-SKEMA-Couleur.png';
import { useChatSession } from '../../context/ChatSessionContext';

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const { resetSession } = useChatSession();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleReset = () => {
        resetSession();
    };

    return (
        <div className={styles.navbar}>
            <img
                src={logo}
                alt="SKEMA Logo"
                className={styles.logo}
                onClick={handleReset}
                style={{ cursor: 'pointer' }}
            />
            <button className={styles.newButton} onClick={handleReset}>
                {isMobile ? '+' : 'New Conversation'}
            </button>
        </div>
    );
};

export default Navbar;
