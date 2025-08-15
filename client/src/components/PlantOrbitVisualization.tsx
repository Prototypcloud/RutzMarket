import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Info, Star, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  plantMaterial: string;
  scientificName: string;
  category: string;
  sector: string;
  bioactiveCompounds: string[];
  origin: string;
  price: string;
  rating: string;
  imageUrl: string;
}

interface PlantNode {
  id: string;
  name: string;
  scientificName: string;
  x: number;
  y: number;
  angle: number;
  radius: number;
  products: Product[];
  category: string;
  connections: string[];
  color: string;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  reason: string;
  type: 'synergy' | 'complement' | 'sequence';
}

const PlantOrbitVisualization: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<PlantNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState<Connection[]>([]);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Transform products into plant nodes with orbital positions
  const plantNodes: PlantNode[] = products.reduce((nodes: PlantNode[], product) => {
    const existingNode = nodes.find(n => n.scientificName === product.scientificName);
    
    if (existingNode) {
      existingNode.products.push(product);
      return nodes;
    }

    const nodeIndex = nodes.length;
    const totalNodes = 8; // Limit for better visualization
    if (nodeIndex >= totalNodes) return nodes;

    const angle = (nodeIndex / totalNodes) * Math.PI * 2;
    const radius = 180 + (nodeIndex % 2) * 60; // Varying orbital distances
    
    const colors = [
      '#10B981', // Emerald
      '#8B5CF6', // Violet  
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#3B82F6', // Blue
      '#84CC16', // Lime
      '#F97316', // Orange
      '#EC4899', // Pink
    ];

    const newNode: PlantNode = {
      id: `plant-${nodeIndex}`,
      name: product.plantMaterial,
      scientificName: product.scientificName,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle,
      radius,
      products: [product],
      category: product.category,
      connections: [],
      color: colors[nodeIndex % colors.length],
    };

    return [...nodes, newNode];
  }, []);

  // Define plant connections based on traditional Indigenous knowledge
  const plantConnections: Connection[] = [
    {
      from: 'Rhododendron groenlandicum', // Labrador Tea
      to: 'Thuja occidentalis', // Eastern White Cedar
      strength: 0.9,
      reason: 'Traditional respiratory wellness combination used by northern Indigenous communities',
      type: 'synergy'
    },
    {
      from: 'Hierochloe odorata', // Sweetgrass
      to: 'Rosa acicularis', // Wild Rose
      strength: 0.8,
      reason: 'Sacred ceremonial pairing for spiritual and physical healing',
      type: 'complement'
    },
    {
      from: 'Oplopanax horridus', // Devil\'s Club
      to: 'Arctostaphylos uva-ursi', // Bearberry
      strength: 0.85,
      reason: 'Traditional medicine sequence for immune and urinary system support',
      type: 'sequence'
    },
    {
      from: 'Rubus chamaemorus', // Cloudberry
      to: 'Rosa acicularis', // Wild Rose
      strength: 0.7,
      reason: 'Vitamin C powerhouse combination for immune system strength',
      type: 'synergy'
    }
  ];

  // Animate orbital positions
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setRotationSpeed(prev => prev + 0.002);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isAnimating]);

  const getNodePosition = (node: PlantNode) => {
    const currentAngle = node.angle + rotationSpeed;
    return {
      x: Math.cos(currentAngle) * node.radius,
      y: Math.sin(currentAngle) * node.radius,
    };
  };

  const handleNodeClick = (node: PlantNode) => {
    setSelectedNode(node);
    // Find connections for this node
    const connections = plantConnections.filter(
      conn => conn.from === node.scientificName || conn.to === node.scientificName
    );
    setActiveConnections(connections);
  };

  const getConnectionPath = (conn: Connection) => {
    const fromNode = plantNodes.find(n => n.scientificName === conn.from);
    const toNode = plantNodes.find(n => n.scientificName === conn.to);
    
    if (!fromNode || !toNode) return '';

    const fromPos = getNodePosition(fromNode);
    const toPos = getNodePosition(toNode);
    
    // Create curved path for connections
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    const controlX = midX + (Math.random() - 0.5) * 50;
    const controlY = midY + (Math.random() - 0.5) * 50;
    
    return `M ${fromPos.x + 300} ${fromPos.y + 300} Q ${controlX + 300} ${controlY + 300} ${toPos.x + 300} ${toPos.y + 300}`;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-forest via-sage to-cream overflow-hidden">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-forest" />
        </motion.div>
        <div className="text-center mt-4">
          <h3 className="text-white font-bold text-lg">Indigenous Canadian</h3>
          <p className="text-cream text-sm">Plant Medicine Network</p>
        </div>
      </div>

      {/* Orbital Visualization Container */}
      <div 
        ref={containerRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeConnections.map((conn, index) => (
            <motion.path
              key={`${conn.from}-${conn.to}`}
              d={getConnectionPath(conn)}
              stroke={conn.type === 'synergy' ? '#10B981' : conn.type === 'complement' ? '#8B5CF6' : '#F59E0B'}
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: conn.strength }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          ))}
        </svg>

        {/* Plant Nodes */}
        {plantNodes.map((node) => {
          const position = getNodePosition(node);
          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{
                left: position.x + 300,
                top: position.y + 300,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white"
                style={{ backgroundColor: node.color }}
              >
                {node.products.length}
              </div>
              
              {(hoveredNode === node.id || selectedNode?.id === node.id) && (
                <motion.div
                  className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 w-48 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h4 className="font-bold text-sm text-forest">{node.name}</h4>
                  <p className="text-xs text-gray-600 italic">{node.scientificName}</p>
                  <p className="text-xs text-gray-500 mt-1">{node.products.length} products</p>
                  <Button size="sm" className="mt-2 w-full" data-testid={`explore-${node.id}`}>
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Explore
                  </Button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="absolute top-6 left-6 space-y-4">
        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Orbit Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Animation</span>
              <Button
                variant={isAnimating ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                data-testid="toggle-animation"
              >
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Rotation Speed</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full"
                data-testid="speed-slider"
              />
            </div>
          </CardContent>
        </Card>

        {/* Connection Legend */}
        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Connection Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <span className="text-xs">Synergy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-violet-500"></div>
              <span className="text-xs">Complement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-amber-500"></div>
              <span className="text-xs">Sequence</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plant Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute top-6 right-6 w-80 bg-white rounded-xl shadow-2xl z-30"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-forest">{selectedNode.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  data-testid="close-details"
                >
                  ✕
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 italic mb-4">{selectedNode.scientificName}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Available Products ({selectedNode.products.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedNode.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-xs font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ${product.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {activeConnections.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Traditional Combinations</h4>
                    <div className="space-y-2">
                      {activeConnections.map((conn, index) => (
                        <div key={index} className="p-2 bg-cream/50 rounded text-xs">
                          <div className="flex items-center mb-1">
                            <Star className="w-3 h-3 mr-1 text-amber-500" />
                            <span className="font-medium">
                              {conn.type.charAt(0).toUpperCase() + conn.type.slice(1)}
                            </span>
                            <span className="ml-2 text-gray-500">
                              {Math.round(conn.strength * 100)}% match
                            </span>
                          </div>
                          <p className="text-gray-600">{conn.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlantOrbitVisualization;