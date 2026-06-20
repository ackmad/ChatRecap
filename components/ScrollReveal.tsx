import React, { useRef } from 'react';
import { motion, useInView, Variant } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    width = "fit-content",
    className = "",
    delay = 0,
    direction = 'up',
    distance = 30
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { y: 15, x: 0 }; // Reduced from 30
            case 'down': return { y: -15, x: 0 };
            case 'left': return { x: 15, y: 0 };
            case 'right': return { x: -15, y: 0 };
            default: return { y: 15, x: 0 };
        }
    };

    const initial = { opacity: 0, ...getInitialPosition() };
    const animate = { opacity: 1, x: 0, y: 0 };

    return (
        <div ref={ref} style={{ width }} className={className}>
            <motion.div
                variants={{
                    hidden: initial,
                    visible: { opacity: 1, x: 0, y: 0 }
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.3, delay: delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};
