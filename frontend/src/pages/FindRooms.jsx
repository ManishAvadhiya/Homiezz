import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Users,
  Search,
  Home,
  MessageCircle,
  Star,
  Filter,
  Heart,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Bath,
  Bed,
  Grid,
  List,
} from "lucide-react"
import { Nav } from "react-day-picker"
import Navbar from "@/components/Navbar"

export default function FindRoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect Room</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover thousands of verified rooms and apartments across India. Your dream home awaits!
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl shadow-2xl">
              <div className="flex-1">
                <Input
                  placeholder="🏠 Enter city, area, or landmark..."
                  className="border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48 border-0 bg-gray-50">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="pg">PG</SelectItem>
                  <SelectItem value="hostel">Hostel</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Filter className="h-5 w-5 mr-2 text-orange-600" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
                    <div className="px-2">
                      <Slider defaultValue={[5000, 25000]} max={50000} min={1000} step={1000} className="w-full" />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>₹5,000</span>
                        <span>₹25,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Room Type</h3>
                    <div className="space-y-2">
                      {["Single Room", "1 BHK", "2 BHK", "3 BHK", "Shared Room"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} />
                          <label htmlFor={type} className="text-sm text-gray-700">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Amenities</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Wi-Fi", icon: Wifi },
                        { name: "Parking", icon: Car },
                        { name: "Gym", icon: Dumbbell },
                        { name: "Kitchen", icon: Coffee },
                        { name: "Attached Bath", icon: Bath },
                      ].map((amenity) => (
                        <div key={amenity.name} className="flex items-center space-x-2">
                          <Checkbox id={amenity.name} />
                          <amenity.icon className="h-4 w-4 text-gray-500" />
                          <label htmlFor={amenity.name} className="text-sm text-gray-700">
                            {amenity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Furnishing */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Furnishing</h3>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully">Fully Furnished</SelectItem>
                        <SelectItem value="semi">Semi Furnished</SelectItem>
                        <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
                  <p className="text-gray-600">1,247 properties found in Bangalore</p>
                </div>
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-gray-300 rounded-lg">
                    <Button variant="ghost" size="sm" className="px-3">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-3">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Room Listings */}
              <div className="grid gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-square relative">
                        <img
                          src={`/modern-apartment.png?height=300&width=400&query=modern apartment room ${i} interior`}
                          alt={`Room ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Badge className="absolute bottom-3 left-3 bg-green-500 text-white">Available Now</Badge>
                      </div>

                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Spacious 2BHK Apartment</h3>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                              Koramangala {i}st Block, Bangalore
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              ₹{(15000 + i * 3000).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">per month</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />2 Bedrooms
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />2 Bathrooms
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            2-3 People
                          </div>
                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                            <span className="text-yellow-700 font-medium">4.{8 + i}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {["Wi-Fi", "Parking", "Gym", "Kitchen"].map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="bg-orange-100 text-orange-700">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          Fully furnished apartment with modern amenities, 24/7 security, and excellent connectivity to
                          IT hubs. Perfect for working professionals.
                        </p>

                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button className="bg-orange-500 text-white">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">...</Button>
                  <Button variant="outline">15</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
