"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

export default function ReviewModal({ product_id, fetchReviews }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [email, setEmail] = useState("")
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      if (session?.user?.email) {
        setEmail(session.user.email)
      } else if (session?.user?.phone) {
        setEmail(session.user.phone + "@gmail.com")
      }
    }
    console.log("Your email is: ", email)
    console.log("Current product_id: ", typeof(product_id))
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("") // Clear any previous errors

    try {      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/reviews`,
        {
          title,
          reviewText, 
          rating,
          email,
          product_id: product_id, 
        }
      )
      // console.log(response);
      

      console.log("Review submitted:", response.data)
      fetchReviews() // Fetch updated reviews after submission
      
      // Reset form and close modal
      setTitle("")
      setReviewText("")
      setRating(0)
      setOpen(false)

    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        "An error occurred while submitting the review"
      setError(message)
      console.error("Error submitting review:", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white">
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Share Your Experience</DialogTitle>
          <DialogDescription>
            Tell us what you think about our product or service.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-blue-600">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review" className="text-blue-600">Your Review</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us more details about your experience"
              required
              className="min-h-[100px] border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-600">Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                  required
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoverRating || rating) >= star
                        ? "fill-pink-500 text-pink-500"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
