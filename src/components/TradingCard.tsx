import { useRef, useState } from 'react';
import type { KomodoCard } from '@/types';
import { getRarityColor, getRarityLabel } from '@/data/cards';
import { Shield, Sword, Heart, Zap, Wind } from 'lucide-react';

interface TradingCardProps {
  card: KomodoCard;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
  onClick?: () => void;
  tiltEnabled?: boolean;
  style?: React.CSSProperties;
}

export function TradingCard({ 
  card, 
  size = 'md', 
  showStats = true, 
  className = '',
  onClick,
  tiltEnabled = true,
  style
}: TradingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  const sizeClasses = {
    sm: 'w-40 text-xs',
    md: 'w-64 text-sm',
    lg: 'w-80 text-base'
  };

  const imageHeightClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg)');
  };

  const rarityColor = getRarityColor(card.rarity);
  const rarityClass = `card-${card.rarity}`;

  return (
    <div
      ref={cardRef}
      className={`card-base ${rarityClass} ${sizeClasses[size]} ${className} cursor-pointer`}
      style={{ 
        transform: transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className={`relative ${imageHeightClasses[size]} overflow-hidden`}>
        <img 
          src={card.image} 
          alt={card.name}
          className="w-full h-full object-cover"
        />
        {/* Rarity Badge */}
        <div 
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold font-display"
          style={{ 
            backgroundColor: rarityColor,
            color: '#1B2B1B'
          }}
        >
          {getRarityLabel(card.rarity)}
        </div>
        {/* Type Badge */}
        <div 
          className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold font-display bg-black/60 text-white capitalize"
        >
          {card.type}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 bg-gradient-to-b from-[#243824] to-[#1B2B1B]">
        {/* Card Name */}
        <h3 className="font-display font-bold text-[#F3EFE6] text-lg mb-1 truncate">
          {card.name}
        </h3>

        {/* Habitat */}
        <p className="text-[#B8C1B8] text-xs mb-2 italic">
          {card.habitat}
        </p>

        {/* Description */}
        <p className="text-[#B8C1B8] text-xs mb-3 line-clamp-2">
          {card.description}
        </p>

        {/* Stats */}
        {showStats && (
          <div className="space-y-1.5">
            {/* Attack */}
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400" />
              <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 stat-bar-fill"
                  style={{ width: `${card.stats.attack}%` }}
                />
              </div>
              <span className="font-accent text-red-400 w-8 text-right">{card.stats.attack}</span>
            </div>

            {/* Defense */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 stat-bar-fill"
                  style={{ width: `${card.stats.defense}%` }}
                />
              </div>
              <span className="font-accent text-blue-400 w-8 text-right">{card.stats.defense}</span>
            </div>

            {/* HP */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-400" />
              <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 stat-bar-fill"
                  style={{ width: `${card.stats.hp}%` }}
                />
              </div>
              <span className="font-accent text-green-400 w-8 text-right">{card.stats.hp}</span>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-yellow-400" />
              <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 stat-bar-fill"
                  style={{ width: `${card.stats.speed}%` }}
                />
              </div>
              <span className="font-accent text-yellow-400 w-8 text-right">{card.stats.speed}</span>
            </div>

            {/* Energy */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 stat-bar-fill"
                  style={{ width: `${card.stats.energy}%` }}
                />
              </div>
              <span className="font-accent text-purple-400 w-8 text-right">{card.stats.energy}</span>
            </div>
          </div>
        )}

        {/* Ability */}
        <div className="mt-3 pt-2 border-t border-[#3a4a3a]">
          <p className="text-[#FF6F2C] text-xs font-bold">
            {card.ability}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CardBack({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-40 h-56',
    md: 'w-64 h-80',
    lg: 'w-80 h-[28rem]'
  };

  return (
    <div 
      className={`card-base ${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-br from-[#FF6F2C] to-[#e56222]`}
    >
      <div className="text-center p-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1B2B1B] flex items-center justify-center">
          <span className="text-4xl">🦎</span>
        </div>
        <h3 className="font-display font-bold text-[#F3EFE6] text-xl mb-2">
          KOMODO
        </h3>
        <p className="text-[#F3EFE6]/80 text-sm">
          Kingdom Cards
        </p>
        <div className="mt-4 w-16 h-1 bg-[#F3EFE6] mx-auto rounded-full" />
      </div>
    </div>
  );
}
