import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Building, ExternalLink, CheckCircle } from 'lucide-react';

const PropertySourcesBadge = () => {
  const sources = [
    { name: '99acres', verified: true, color: 'bg-blue-600' },
    { name: 'NoBroker', verified: true, color: 'bg-green-600' },
    { name: 'MagicBricks', verified: true, color: 'bg-orange-600' },
    { name: 'Housing.com', verified: true, color: 'bg-purple-600' },
    { name: 'CommonFloor', verified: false, color: 'bg-gray-500' },
  ];

  return (
    <motion.div 
      className="glassmorphism rounded-xl p-4 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        <Building className="h-4 w-4" />
        <span>Live data from trusted sources</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Badge 
              className={`${source.color} text-white text-xs px-3 py-1 flex items-center space-x-1 hover:scale-105 transition-transform cursor-pointer`}
            >
              <span>{source.name}</span>
              {source.verified && <CheckCircle className="h-3 w-3" />}
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Badge>
          </motion.div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Real-time property listings • Live pricing updates • Verified sources
      </div>
    </motion.div>
  );
};

export default PropertySourcesBadge;