import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MapPin,
  Upload,
  Plus,
  Trash2,
  Bed,
  Bath,
  Users,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Tv,
  Wind,

  Shield,
  Palette,
  ArrowLeft,
  Check,
} from "lucide-react"
import Navbar from "@/components/Navbar"

export default function AddRoomPage() {
  const [step, setStep] = useState(1)
  const [ownershipType, setOwnershipType] = useState("self")
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm()

  const amenitiesList = [
    { id: "wifi", name: "Wi-Fi", icon: Wifi },
    { id: "parking", name: "Parking", icon: Car },
    { id: "gym", name: "Gym", icon: Dumbbell },
    { id: "kitchen", name: "Kitchen", icon: Coffee },
    { id: "tv", name: "TV", icon: Tv },
    { id: "ac", name: "Air Conditioning", icon: Wind },
    { id: "washing_machine", name: "Washing Machine", icon: Wind },
    { id: "security", name: "24/7 Security", icon: Shield },
    { id: "furnished", name: "Furnished", icon: Palette },
  ]

  const toggleAmenity = (amenityId) => {
    if (amenities.includes(amenityId)) {
      setAmenities(amenities.filter(id => id !== amenityId))
    } else {
      setAmenities([...amenities, amenityId])
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed")
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const onSubmit = (data) => {
    data.amenities = amenities
    data.images = images
    console.log("Room data:", data)
    // Here you would typically send the data to your backend
    alert("Room added successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl flex items-center justify-center gap-2">
                  <Home className="h-8 w-8 text-orange-500" />
                  List Your Room
                </CardTitle>
                <CardDescription>
                  Fill in the details about your room to find the perfect roommate
                </CardDescription>
                
                {/* Progress Steps */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          i === step ? "bg-orange-500 text-white" : 
                          i < step ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}>
                          {i < step ? <Check className="h-5 w-5" /> : i}
                        </div>
                        {i < 4 && (
                          <div className={`h-1 w-16 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Room Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Spacious 2BHK near Tech Park"
                            {...register("title", { required: "Title is required" })}
                          />
                          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select onValueChange={(value) => setValue("propertyType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">Independent House</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="pg">PG</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.propertyType && <p className="text-red-500 text-sm">Property type is required</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Select onValueChange={(value) => setValue("bedrooms", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? "Bedroom" : "Bedrooms"}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.bedrooms && <p className="text-red-500 text-sm">Bedrooms count is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Select onValueChange={(value) => setValue("bathrooms", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? "Bathroom" : "Bathrooms"}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.bathrooms && <p className="text-red-500 text-sm">Bathrooms count is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="availableBeds">Available Beds *</Label>
                          <Input
                            id="availableBeds"
                            type="number"
                            min="1"
                            {...register("availableBeds", { 
                              required: "Available beds is required",
                              min: { value: 1, message: "At least 1 bed required" }
                            })}
                          />
                          {errors.availableBeds && <p className="text-red-500 text-sm">{errors.availableBeds.message}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your room, neighborhood, and what makes it special..."
                          rows={4}
                          {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={nextStep}>
                          Next: Location
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Location Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="e.g., Bangalore"
                            {...register("city", { required: "City is required" })}
                          />
                          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Select onValueChange={(value) => setValue("state", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="karnataka">Karnataka</SelectItem>
                              <SelectItem value="maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="telangana">Telangana</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.state && <p className="text-red-500 text-sm">State is required</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Area/Locality *</Label>
                        <Input
                          id="area"
                          placeholder="e.g., Koramangala"
                          {...register("area", { required: "Area is required" })}
                        />
                        {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Building name, floor, street address..."
                          rows={3}
                          {...register("address", { required: "Address is required" })}
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="landmark">Landmark (Optional)</Label>
                          <Input
                            id="landmark"
                            placeholder="e.g., Near Forum Mall"
                            {...register("landmark")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            placeholder="e.g., 560034"
                            {...register("pincode", { 
                              required: "Pincode is required",
                              pattern: {
                                value: /^[1-9][0-9]{5}$/,
                                message: "Please enter a valid pincode"
                              }
                            })}
                          />
                          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Next: Pricing & Amenities
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Pricing & Amenities */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Amenities</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Monthly Rent (₹) *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            placeholder="e.g., 15000"
                            {...register("price", { 
                              required: "Price is required",
                              min: { value: 0, message: "Price must be positive" }
                            })}
                          />
                          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                          <Input
                            id="securityDeposit"
                            type="number"
                            min="0"
                            placeholder="e.g., 30000"
                            {...register("securityDeposit")}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Amenities *</Label>
                        <p className="text-sm text-gray-600 mb-3">Select all amenities available</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {amenitiesList.map(amenity => (
                            <div 
                              key={amenity.id}
                              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                amenities.includes(amenity.id) 
                                  ? "border-orange-500 bg-orange-50" 
                                  : "border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              <Checkbox 
                                checked={amenities.includes(amenity.id)} 
                                onCheckedChange={() => toggleAmenity(amenity.id)}
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                              />
                              <amenity.icon className="h-4 w-4 text-gray-600" />
                              <span className="text-sm cursor-pointer" onClick={() => toggleAmenity(amenity.id)}>
                                {amenity.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        {amenities.length === 0 && <p className="text-red-500 text-sm">Select at least one amenity</p>}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Next: Ownership & Images
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 4: Ownership & Images */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Ownership & Images</h3>
                      
                      <div className="space-y-4">
                        <Label>Ownership Type *</Label>
                        <Tabs 
                          value={ownershipType} 
                          onValueChange={setOwnershipType}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger value="self">Self Owned</TabsTrigger>
                            <TabsTrigger value="tenant">I'm a Tenant</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="self" className="space-y-4">
                            <p className="text-sm text-gray-600">
                              As the owner, you'll be responsible for managing this listing.
                            </p>
                          </TabsContent>
                          
                          <TabsContent value="tenant" className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                              Please provide the owner's details as you'll need permission to sublet the room.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name *</Label>
                                <Input
                                  id="ownerName"
                                  placeholder="Owner's full name"
                                  {...register("ownerName", { 
                                    required: ownershipType === "tenant" ? "Owner name is required" : false 
                                  })}
                                />
                                {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="ownerContact">Owner Contact *</Label>
                                <Input
                                  id="ownerContact"
                                  placeholder="Phone number or email"
                                  {...register("ownerContact", { 
                                    required: ownershipType === "tenant" ? "Owner contact is required" : false 
                                  })}
                                />
                                {errors.ownerContact && <p className="text-red-500 text-sm">{errors.ownerContact.message}</p>}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="permissionDetails">Permission Details</Label>
                              <Textarea
                                id="permissionDetails"
                                placeholder="Describe the permission you have to sublet this room..."
                                rows={3}
                                {...register("permissionDetails")}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Upload Room Images *</Label>
                        <p className="text-sm text-gray-600 mb-3">Add at least 3 photos of your room (max 10)</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={URL.createObjectURL(image)} 
                                alt={`Room ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          
                          {images.length < 10 && (
                            <label 
                              htmlFor="room-images"
                              className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-orange-500 transition-colors"
                            >
                              <Upload className="h-6 w-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-500">Add Image</span>
                              <input
                                id="room-images"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          )}
                        </div>
                        {images.length < 3 && <p className="text-red-500 text-sm">Please upload at least 3 images</p>}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button type="submit">
                          Submit Room Listing
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}