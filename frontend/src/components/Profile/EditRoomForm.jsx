import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

const EditRoomForm = ({ room, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    title: room.title || "",
    price: room.price || "",
    availableBeds: room.availableBeds || 1,
    description: room.description || "",
    // Address fields
    street: room.address?.street || "",
    city: room.address?.city || "",
    state: room.address?.state || "",
    zip: room.address?.zip || "",
    // Metadata fields
    area: room.metadata?.area || "",
    landmark: room.metadata?.landmark || "",
    propertyType: room.metadata?.propertyType || "apartment",
    bedrooms: room.metadata?.bedrooms || 1,
    bathrooms: room.metadata?.bathrooms || 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title || !form.price || !form.city || !form.state || !form.street) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.price < 0) {
      toast.error("Price must be positive");
      return;
    }

    if (form.availableBeds < 1) {
      toast.error("Available beds must be at least 1");
      return;
    }

    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title"
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <Label htmlFor="price">Price (₹/month) *</Label>
          <Input 
            id="price"
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            required 
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="availableBeds">Available Beds *</Label>
          <Input 
            id="availableBeds"
            name="availableBeds" 
            type="number" 
            value={form.availableBeds} 
            onChange={handleChange} 
            required 
            min="1"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label htmlFor="street">Street Address *</Label>
          <Input 
            id="street"
            name="street" 
            value={form.street} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city"
            name="city" 
            value={form.city} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input 
            id="state"
            name="state" 
            value={form.state} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input 
            id="zip"
            name="zip" 
            value={form.zip} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <Label htmlFor="area">Area</Label>
          <Input 
            id="area"
            name="area" 
            value={form.area} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <Label htmlFor="landmark">Landmark</Label>
          <Input 
            id="landmark"
            name="landmark" 
            value={form.landmark} 
            onChange={handleChange} 
          />
        </div>

        {/* Property Details */}
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <select 
            id="propertyType"
            name="propertyType" 
            value={form.propertyType} 
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="pg">PG</option>
            <option value="hostel">Hostel</option>
          </select>
        </div>

        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input 
            id="bedrooms"
            name="bedrooms" 
            type="number" 
            value={form.bedrooms} 
            onChange={handleChange} 
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input 
            id="bathrooms"
            name="bathrooms" 
            type="number" 
            value={form.bathrooms} 
            onChange={handleChange} 
            min="1"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditRoomForm;