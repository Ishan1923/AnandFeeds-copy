"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from "lucide-react"
import axios from "axios"
import Image from "next/image"

const ImageSlideshow = () => {
  const [media, setMedia] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imagesPerView, setImagesPerView] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef(null)
  const autoplayRef = useRef(null)

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_STRAPI_API_URL + "/galleries?populate=*")

        const mediaFiles = response.data.data.flatMap((gallery) => {
          if (gallery.gallery_img) {
            return gallery.gallery_img.map((item) => ({
              url: `${process.env.NEXT_PUBLIC_STRAPI}${item.url}`,
              type: item.mime.startsWith("image") ? "image" : "video",
              videoUrl: item.mime === "video/mp4" ? item.url : null,
              formats: item.formats,
            }))
          } else if (gallery.url && gallery.video_file) {
            return [
              {
                url: gallery.url,
                type: "youtube",
                videoUrl: gallery.url,
              },
            ]
          }
          return []
        })

        setMedia(mediaFiles)
      } catch (error) {
        console.error("Error fetching gallery media:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [])

  useEffect(() => {
    const updateImagesPerView = () => {
      const width = window.innerWidth
      if (width >= 1280) {
        setImagesPerView(3)
      } else if (width >= 1024) {
        setImagesPerView(2)
      } else {
        setImagesPerView(1)
      }
    }

    updateImagesPerView()
    window.addEventListener("resize", updateImagesPerView)
    return () => window.removeEventListener("resize", updateImagesPerView)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1
          return nextIndex >= Math.max(1, media.length - imagesPerView + 1) ? 0 : nextIndex
        })
      }, 5000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [media, imagesPerView, isPlaying])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= Math.max(1, media.length - imagesPerView + 1) ? 0 : nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIdx = prevIndex - 1
      return prevIdx < 0 ? Math.max(0, media.length - imagesPerView) : prevIdx
    })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Helper function to extract YouTube video ID from the URL
  const extractYouTubeId = (url) => {
    const regExp =
      /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/))([\w-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden my-16 px-4" id="gallery">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold font-sans uppercase text-center bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
          Gallery
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-xl animate-pulse">
          <div className="text-gray-400">Loading gallery...</div>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-xl shadow-lg p-1">
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-10 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition transform -translate-y-1/2"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <div
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-in-out w-full"
              style={{
                transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)`,
              }}
            >
              {media.map((item, index) => (
                <div key={index} className="flex-shrink-0 p-2" style={{ width: `${100 / imagesPerView}%` }}>
                  <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden group">
                    {item.type === "image" ? (
                      <>
                        <Image
                          src={item.url || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={600}
                          height={400}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : item.type === "youtube" ? (
                      <div className="relative w-full h-full">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${extractYouTubeId(item.videoUrl)}?rel=0`}
                          title={`YouTube video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition z-10"
                          aria-label="Open in YouTube"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    ) : item.videoUrl ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(item.videoUrl)}`}
                        title={`Video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-10 p-3 bg-white/80 rounded-full shadow-md hover:bg-white transition transform -translate-y-1/2"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(media.length / imagesPerView) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx * imagesPerView)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex >= idx * imagesPerView && currentIndex < (idx + 1) * imagesPerView
                    ? "bg-indigo-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide group ${idx + 1}`}
              />
            ))}
          </div>
{/* 
          Thumbnails for quick navigation on larger screens
          <div className="hidden lg:flex mt-6 overflow-x-auto gap-2 pb-2 max-w-full">
            {media.map((item, index) => (
              <button
                key={`thumb-${index}`}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all ${
                  index >= currentIndex && index < currentIndex + imagesPerView
                    ? "ring-2 ring-indigo-600 scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play size={20} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div> */}
        </>
      )}
    </div>
  )
}

export default ImageSlideshow
