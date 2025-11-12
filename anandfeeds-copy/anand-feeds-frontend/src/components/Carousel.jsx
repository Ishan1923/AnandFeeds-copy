'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const images = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];

const Carousel = () => {
    const [imageIndex, setImageIndex] = useState(0);

    // Auto-move the carousel every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="carousel-container flex relative w-[100vw] h-[100vh] bg-black overflow-hidden">
            {images.map((src, index) => (
                <Image
                    key={index}
                    src={src}
                    layout='fill'
                    objectFit='cover'
                    alt='carousel image'
                    className={`absolute transition-all duration-1000 ${
                        index === imageIndex ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-10 z-0"
                    }`}
                />
            ))}

            {/* { Buttons } */}
            <div className='absolute right-3 top-[45%] z-20'>
                <Button 
                    onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                    variant="outline"
                    size="icon"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className='absolute left-3 top-[45%] z-20'>
                <Button 
                    onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
                    variant="outline"
                    size="icon"
                >
                    <ChevronLeft className="h-4 w-4 " />
                </Button>
            </div>

            {/* { Black Overlay } */}
            <div className="overlay w-full h-full absolute bg-black opacity-30 z-10"></div>
        </div>
    );
}

export default Carousel;
