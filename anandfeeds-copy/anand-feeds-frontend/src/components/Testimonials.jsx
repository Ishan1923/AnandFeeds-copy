"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"


const Testimonials = () => {
    const [testis, setTestis] = useState([]);

    const getQueryParam = (url, param) => {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(param);
    }

    // const getTestimonials = async () => {
    //     const response = await fetch('https://anandfeeds.abhinandan.me/api/testimonials');
    //     const json = await response.json();
    //     const testimonials = json.data;
    //     let finalURLs = [];
    //     testimonials && testimonials.forEach(testimonial => {
    //         const youtubeUrl = testimonial.attributes.link;
    //         const vParam = getQueryParam(youtubeUrl, 'v');
    //         finalURLs.push({ id: testimonial.id, videoId: vParam });
    //     });
    //     console.log(finalURLs);
    //     setTestis(finalURLs);
    // }

    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    // useEffect(() => {
    //     getTestimonials();
    // }, []);
    
    if (testis.length < 1) {
        return;
    }
  return (
        <div className='testimonials my-12 w-full flex flex-col items-center gap-10' id='testimonials'>
            <h2 className='text-3xl font-bold underline text-center'>Testimonials</h2>
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.play}
            >
                <CarouselContent>
                    {testis && testis.map((testi) => {
                        return (
                            <CarouselItem key={testi.id}>
                                <iframe src={`https://www.youtube.com/embed/${testi.videoId}`} className='w-full h-[150px] md:h-[450px]' title="How to Make an Effective Testimonial Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
  )
}

export default Testimonials;