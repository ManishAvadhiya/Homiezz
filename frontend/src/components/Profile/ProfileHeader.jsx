import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Shield, CheckCircle2, Star, MapPin, Calendar } from "lucide-react";

const ProfileHeader = ({ user }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const roleConfig = {
    owner: {
      badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      icon: <Home className="h-4 w-4" />,
      glow: "shadow-amber-500/25"
    },
    tenant: {
      badge: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0",
      gradient: "from-purple-500 via-indigo-500 to-blue-600",
      icon: <Building className="h-4 w-4" />,
      glow: "shadow-purple-500/25"
    },
    admin: {
      badge: "bg-gradient-to-r from-red-500 to-pink-600 text-white border-0",
      gradient: "from-red-500 via-rose-500 to-pink-600",
      icon: <Shield className="h-4 w-4" />,
      glow: "shadow-red-500/25"
    }
  };

  const userRole = user.role?.toLowerCase() || 'tenant';
  const config = roleConfig[userRole] || roleConfig.tenant;

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl relative">
        {/* Animated Background Gradient */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-48 bg-gradient-to-r ${config.gradient} relative overflow-hidden`}
        >
          {/* Animated Background Elements */}
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"
          />
          
          {/* Shimmer Effect */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </motion.div>

        <CardContent className="pt-0 relative">
          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center -mt-24"
          >
            {/* Avatar with Enhanced Animation */}
            <motion.div
              variants={scaleIn}
              whileHover={{ 
                scale: 1.05,
                rotateY: 10,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className={`absolute -inset-2 bg-gradient-to-r ${config.gradient} rounded-full blur-md opacity-75`} />
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl relative z-10 bg-gradient-to-br from-white to-gray-100">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              {/* Online Status Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full z-20 shadow-lg"
              />
            </motion.div>

            {/* User Info Section */}
            <motion.div
              variants={fadeInUp}
              className="text-center mt-6 space-y-3"
            >
              <div>
                <motion.h1
                  className="text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  {user.name}
                </motion.h1>
                <motion.p
                  className="text-gray-600 text-lg mt-2 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {user.email}
                </motion.p>
              </div>

              {/* Additional User Info */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-4 text-sm text-gray-500"
              >
                {user.phone && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {user.phone}
                  </motion.div>
                )}
                {user.createdAt && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <Calendar className="h-3 w-3" />
                    Member since {new Date(user.createdAt).getFullYear()}
                  </motion.div>
                )}
              </motion.div>

              {/* Badges Section */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-3 mt-4"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${config.badge} ${config.glow}`}>
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </Badge>
                </motion.div>

                {user.isVerified && (
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg shadow-green-500/25 border-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified Profile
                      </div>
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Decorative Corner Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-2xl"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileHeader;