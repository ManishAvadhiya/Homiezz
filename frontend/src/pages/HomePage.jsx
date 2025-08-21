import { useUserStore } from '@/store/userStore';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Example shadcn button import (adjust path as needed)
import { Button } from "@/components/ui/button";

const HomePage = () => {
    const navigate = useNavigate();
    const { user, checkAuth, setUser } = useUserStore();

    useEffect(() => {
        checkAuth();
        setUser(user);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Hero Section */}
            <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-10">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-6xl font-bold text-indigo-800 mb-4">
                        Find Your Perfect Roommate & Accommodation
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8">
                        Discover the best places to live and connect with like-minded roommates. Safe, easy, and tailored for you.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            className="px-8 py-3 text-lg"
                            onClick={() => navigate("/register")}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            className="px-8 py-3 text-lg"
                            onClick={() => navigate("/listings")}
                        >
                            Browse Listings
                        </Button>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                        alt="Roommates"
                        className="rounded-xl shadow-lg w-full max-w-md object-cover"
                    />
                </div>
            </section>

            {/* Welcome Section */}
            <section className="bg-white/80 py-6 px-4 md:px-20 rounded-t-3xl shadow-inner">
                <div className="text-center">
                    <span className="text-gray-600 text-lg">
                        Welcome, <span className="font-semibold text-indigo-700">{!!!user ? "Guest" : user?.name}</span>
                    </span>
                </div>
            </section>
        </div>
    );
};

export default HomePage