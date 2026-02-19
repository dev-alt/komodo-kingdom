import { useState, useRef, useEffect } from 'react';
import type { KomodoCard } from '@/types';
import { TradingCard } from './TradingCard';
import { getRandomCards } from '@/data/cards';
import { useAuth } from '@/context/AuthContext';
import { Package, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';

interface PackOpeningProps {
  onComplete?: () => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return '#B8C1B8';
    case 'uncommon': return '#4ADE80';
    case 'rare': return '#60A5FA';
    case 'epic': return '#A78BFA';
    case 'legendary': return '#FF6F2C';
    default: return '#B8C1B8';
  }
};

export function PackOpening({ onComplete }: PackOpeningProps) {
  const { addCardsToCollection } = useAuth();
  const [stage, setStage] = useState<'intro' | 'shaking' | 'burst' | 'revealing' | 'revealed'>('intro');
  const [cards, setCards] = useState<KomodoCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  
  const packRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startOpening = () => {
    const newCards = getRandomCards(3, 0.1);
    setCards(newCards);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealedCount(newCards.length);
      setStage('revealed');
      return;
    }

    setStage('shaking');
    
    // Shake animation
    if (packRef.current) {
      gsap.to(packRef.current, {
        x: "random(-15, 15)",
        y: "random(-10, 10)",
        rotation: "random(-10, 10)",
        duration: 0.08,
        repeat: 10,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          setStage('burst');
          gsap.to(packRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "back.in(2)"
          });
        }
      });
    }
  };

  // Burst effect
  useEffect(() => {
    if (stage === 'burst' && burstRef.current) {
      // Create particle explosion
      const particles = Array.from({ length: 30 }, () => {
        const particle = document.createElement('div');
        particle.className = 'absolute w-3 h-3 rounded-full';
        const colors = ['#FF6F2C', '#FFD700', '#FF4444', '#44FF44', '#4444FF', '#FFFFFF'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';
        burstRef.current?.appendChild(particle);
        return particle;
      });

      // Animate particles
      particles.forEach((particle, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 0,
          opacity: 0,
          duration: 0.8 + Math.random() * 0.4,
          ease: "power3.out",
          onComplete: () => particle.remove()
        });
      });

      // Flash effect
      const flash = document.createElement('div');
      flash.className = 'absolute inset-0 bg-white rounded-full';
      flash.style.opacity = '1';
      burstRef.current.appendChild(flash);
      gsap.to(flash, {
        opacity: 0,
        scale: 3,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          flash.remove();
          setStage('revealing');
        }
      });
    }
  }, [stage]);

  // Card reveal animation
  useEffect(() => {
    if (stage === 'revealing') {
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          // Initial hidden state
          gsap.set(cardRef, {
            scale: 0,
            opacity: 0,
            rotationY: 180,
            y: 100
          });

          // Staggered reveal
          gsap.to(cardRef, {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            y: 0,
            duration: 0.8,
            delay: index * 0.4,
            ease: "back.out(1.7)",
            onComplete: () => {
              if (index === cards.length - 1) {
                setStage('revealed');
              }
              setRevealedCount(prev => prev + 1);
            }
          });

          // Add glow effect for rare+ cards
          const card = cards[index];
          if (card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary') {
            gsap.to(cardRef, {
              boxShadow: `0 0 60px ${getRarityColor(card.rarity)}`,
              duration: 0.5,
              delay: index * 0.4 + 0.5,
              yoyo: true,
              repeat: 3
            });
          }
        }
      });
    }
  }, [stage, cards]);

  const handleAddToCollection = () => {
    addCardsToCollection(cards);
    if (onComplete) {
      onComplete();
    }
  };

  if (stage === 'intro') {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block mb-8" ref={packRef}>
          <div className="relative">
            <Package className="w-32 h-32 text-[#FF6F2C] mx-auto drop-shadow-2xl" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#FF6F2C] blur-3xl opacity-30 animate-pulse" />
            {/* Sparkles */}
            <Sparkles className="w-10 h-10 text-yellow-400 absolute -top-4 -right-4 animate-bounce" />
            <Star className="w-6 h-6 text-yellow-300 absolute -bottom-2 -left-4 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <Star className="w-4 h-4 text-orange-400 absolute top-4 -left-6 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F3EFE6] mb-4">
          Mystery Card Pack
        </h2>
        <p className="text-[#B8C1B8] mb-8 max-w-md mx-auto">
          Open this pack to reveal 3 random Komodo dragon cards! 
          Will you find a legendary?
        </p>
        <button
          onClick={startOpening}
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          <Package className="w-6 h-6" />
          Open Pack
        </button>
      </div>
    );
  }

  if (stage === 'shaking') {
    return (
      <div className="text-center py-12">
        <div ref={packRef}>
          <Package className="w-32 h-32 text-[#FF6F2C] mx-auto" />
        </div>
        <p className="text-[#F3EFE6] mt-8 font-display text-xl animate-pulse">
          Opening...
        </p>
      </div>
    );
  }

  if (stage === 'burst') {
    return (
      <div className="text-center py-12 relative" ref={burstRef}>
        <div className="w-32 h-32 mx-auto relative">
          <Package className="w-32 h-32 text-[#FF6F2C] mx-auto opacity-50" />
        </div>
      </div>
    );
  }

  if (stage === 'revealing' || stage === 'revealed') {
    return (
      <div className="py-8">
        <h2 className="font-display text-3xl sm:text-4xl text-[#F3EFE6] text-center mb-2 animate-fade-in">
          {stage === 'revealed' ? '🎉 Pack Opened!' : 'Revealing...'}
        </h2>
        <p className="text-[#B8C1B8] text-center mb-8">
          {revealedCount} of {cards.length} cards revealed
        </p>

        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap mb-8 perspective-1000">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              ref={el => { cardRefs.current[idx] = el; }}
              className="transform-gpu"
              style={{ 
                transformStyle: 'preserve-3d',
                zIndex: cards.length - idx
              }}
            >
              <TradingCard 
                card={card} 
                size="md"
                tiltEnabled={false}
              />
              {stage === 'revealed' && (
                <div 
                  className="text-center mt-2 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.2}s`, animationFillMode: 'forwards' }}
                >
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={{ 
                      backgroundColor: getRarityColor(card.rarity),
                      color: '#1B2B1B'
                    }}
                  >
                    {card.rarity}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {stage === 'revealed' && (
          <div className="text-center animate-fade-in">
            <button
              onClick={handleAddToCollection}
              className="btn-primary text-lg px-8 py-4"
            >
              Add to My Collection
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
