"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Shield,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Home,
  DollarSign,
} from "lucide-react"


export default function ViewDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const images = [
    "/modern-luxury-apartment.png",
    "/modern-apartment.png",
    "/modern-bedroom.png",
    "/modern-kitchen.png",
    "/modern-bathroom.png",
  ]

  const amenities = [
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Car, label: "Parking Available" },
    { icon: Utensils, label: "Fully Equipped Kitchen" },
    { icon: Tv, label: "Smart TV" },
    { icon: Wind, label: "Air Conditioning" },
    { icon: Shield, label: "Security System" },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-orange-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                            <img src="/logo.png" alt="Homiezz Logo" height={"40px"} width={"40px"}/>

            </div>
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent animate-pulse text-4xl font-bold cursor-pointer" onClick={() => window.location.href = '/'}>
              Homiezz
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/find-rooms" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Find Rooms
            </a>
            <a href="/find-roommates" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Find Roommates
            </a>
            <a href="/about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              About
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent" >
              <a href="/register" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Login
            </a>
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="relative h-96">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Luxury 2BHK Apartment in Downtown
                    </CardTitle>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>123 Main Street, Downtown, City</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">₹25,000</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                    <span className="ml-1 text-sm text-gray-500">(24 reviews)</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Home className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">2 BHK</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">2-3 People</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">Available Now</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">₹5,000 Deposit</div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Beautiful and spacious 2BHK apartment located in the heart of downtown. This fully furnished
                    apartment features modern amenities, high-speed internet, and is perfect for professionals or
                    students. The building offers 24/7 security, parking facilities, and is close to public
                    transportation, shopping centers, and restaurants.
                  </p>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <amenity.icon className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Property Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/professional-person.png" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Rajesh Kumar</div>
                    <div className="text-sm text-gray-500">Property Owner</div>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs ml-1">4.9 (15 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Map View</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Metro Station</span>
                    <span className="font-medium">0.5 km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shopping Mall</span>
                    <span className="font-medium">1.2 km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hospital</span>
                    <span className="font-medium">2.1 km</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Similar Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <img src="/modern-apartment-interior.png" alt="Property" className="w-20 h-15 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">2BHK Apartment</div>
                      <div className="text-xs text-gray-500">Downtown Area</div>
                      <div className="text-sm font-semibold text-orange-600">₹22,000/month</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
