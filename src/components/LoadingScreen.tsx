import { motion } from 'framer-motion';
import { Building, TrendingUp, MapPin, Star } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading BrickMatric Intelligence..." }: LoadingScreenProps) => {
  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  };

  const pulseTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--background-gradient)' }}>
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-32 h-32 mx-auto relative"
            animate={pulseAnimation}
            transition={pulseTransition}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl primary-glow" />
            <div className="absolute inset-2 bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <motion.div
                variants={iconVariants}
                className="text-primary"
              >
                <Building className="w-12 h-12" />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            className="absolute -top-4 -right-4"
            variants={iconVariants}
            transition={{ delay: 0.5 }}
          >
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4"
            variants={iconVariants}
            transition={{ delay: 0.7 }}
          >
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-8 -left-8"
            variants={iconVariants}
            transition={{ delay: 0.9 }}
          >
            <div className="w-6 h-6 bg-accent/30 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-accent" />
            </div>
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Recommendation Center
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            AI-Powered Real Estate Intelligence
          </p>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          </div>
        </motion.div>

        {/* Subtle Animation Dots */}
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;