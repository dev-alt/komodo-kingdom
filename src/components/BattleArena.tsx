import { useState, useRef } from 'react';
import type { KomodoCard } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { komodoCards } from '@/data/cards';
import { Sword, Shield, Trophy, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

interface BattleResult {
  winner: 'player' | 'opponent' | 'draw';
  playerDamage: number;
  opponentDamage: number;
  message: string;
}

export function BattleArena() {
  const { user } = useAuth();
  const [playerCard, setPlayerCard] = useState<KomodoCard | null>(null);
  const [opponentCard, setOpponentCard] = useState<KomodoCard | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [showCardSelect, setShowCardSelect] = useState(true);

  const playerCardRef = useRef<HTMLDivElement>(null);
  const opponentCardRef = useRef<HTMLDivElement>(null);
  const battleAreaRef = useRef<HTMLDivElement>(null);

  const userCards = user?.collection || komodoCards.slice(0, 6);

  const selectCard = (card: KomodoCard) => {
    setPlayerCard(card);
    const selectedIndex = komodoCards.findIndex((entry) => entry.id === card.id);
    const opponentIndex = selectedIndex >= 0 ? (selectedIndex + 1) % komodoCards.length : 0;
    setOpponentCard(komodoCards[opponentIndex]);
    setShowCardSelect(false);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // Animate cards entering
    setTimeout(() => {
      if (playerCardRef.current && opponentCardRef.current) {
        gsap.fromTo(playerCardRef.current, 
          { x: -300, opacity: 0, rotateY: -90 },
          { x: 0, opacity: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
        gsap.fromTo(opponentCardRef.current,
          { x: 300, opacity: 0, rotateY: 90 },
          { x: 0, opacity: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }
    }, 100);
  };

  const startBattle = () => {
    if (!playerCard || !opponentCard) return;
    
    setIsBattling(true);
    setBattleResult(null);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      calculateBattleResult();
      setIsBattling(false);
      return;
    }

    // Battle animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        calculateBattleResult();
        setIsBattling(false);
      }
    });

    // Cards move to center
    tl.to([playerCardRef.current, opponentCardRef.current], {
      x: (i) => i === 0 ? 80 : -80,
      duration: 0.4,
      ease: "power2.in"
    });

    // Clash effect
    tl.add(() => {
      // Create clash particles
      if (battleAreaRef.current) {
        const clash = document.createElement('div');
        clash.className = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-xl';
        clash.style.opacity = '1';
        battleAreaRef.current.appendChild(clash);
        
        gsap.to(clash, {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => clash.remove()
        });

        // Add shake effect
        gsap.to(battleAreaRef.current, {
          x: "random(-10, 10)",
          y: "random(-10, 10)",
          duration: 0.05,
          repeat: 8,
          yoyo: true
        });
      }
    });

    // Cards bounce back
    tl.to(playerCardRef.current, {
      x: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    }, "+=0.1");
    
    tl.to(opponentCardRef.current, {
      x: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    }, "<");
  };

  const calculateBattleResult = () => {
    if (!playerCard || !opponentCard) return;

    const playerPower = playerCard.stats.attack + playerCard.stats.speed;
    const opponentPower = opponentCard.stats.attack + opponentCard.stats.speed;
    
    const playerDefense = playerCard.stats.defense + playerCard.stats.hp / 2;
    const opponentDefense = opponentCard.stats.defense + opponentCard.stats.hp / 2;

    const playerScore = playerPower * 0.6 + playerDefense * 0.4;
    const opponentScore = opponentPower * 0.6 + opponentDefense * 0.4;

    let result: BattleResult;
    
    if (playerScore > opponentScore) {
      result = {
        winner: 'player',
        playerDamage: Math.floor(playerPower * 0.8),
        opponentDamage: Math.floor(opponentPower * 0.3),
        message: `${playerCard.name} dominates with a powerful strike!`
      };
    } else if (opponentScore > playerScore) {
      result = {
        winner: 'opponent',
        playerDamage: Math.floor(playerPower * 0.3),
        opponentDamage: Math.floor(opponentPower * 0.8),
        message: `${opponentCard.name} counters with devastating force!`
      };
    } else {
      result = {
        winner: 'draw',
        playerDamage: Math.floor(playerPower * 0.5),
        opponentDamage: Math.floor(opponentPower * 0.5),
        message: "It's a fierce stalemate!"
      };
    }

    setBattleResult(result);

    // Animate winner
    if (result.winner === 'player' && playerCardRef.current) {
      gsap.to(playerCardRef.current, {
        scale: 1.1,
        y: -20,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    } else if (result.winner === 'opponent' && opponentCardRef.current) {
      gsap.to(opponentCardRef.current, {
        scale: 1.1,
        y: -20,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    }
  };

  const resetBattle = () => {
    setPlayerCard(null);
    setOpponentCard(null);
    setBattleResult(null);
    setShowCardSelect(true);
    setIsBattling(false);
  };

  if (showCardSelect) {
    return (
      <div className="py-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[#F3EFE6] text-center mb-2">
          Choose Your Fighter
        </h2>
        <p className="text-[#B8C1B8] text-center mb-8">
          Select a card from your collection to battle
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {userCards.map((card, index) => (
            <div
              key={card.id}
              className="cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => selectCard(card)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative rounded-xl overflow-hidden border-2 border-[#3a4a3a] hover:border-[#FF6F2C] transition-colors">
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-[#F3EFE6] text-xs font-bold truncate">{card.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" ref={battleAreaRef}>
      {/* VS Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl sm:text-4xl text-[#F3EFE6] mb-2">
          Battle Arena
        </h2>
        {battleResult ? (
          <div className={`text-xl font-bold ${
            battleResult.winner === 'player' ? 'text-green-400' :
            battleResult.winner === 'opponent' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {battleResult.message}
          </div>
        ) : (
          <p className="text-[#B8C1B8]">Click Battle to fight!</p>
        )}
      </div>

      {/* Battle Field */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-8">
        {/* Player Card */}
        <div className="text-center">
          <p className="text-[#FF6F2C] font-display text-lg mb-2">YOU</p>
          <div ref={playerCardRef} className="relative">
            {playerCard && (
              <div className="w-48 sm:w-56">
                <img 
                  src={playerCard.image} 
                  alt={playerCard.name}
                  className="w-full rounded-2xl border-4 border-green-500 shadow-lg"
                />
                <div className="mt-2">
                  <p className="text-[#F3EFE6] font-bold">{playerCard.name}</p>
                  <div className="flex justify-center gap-2 mt-1 text-xs">
                    <span className="text-red-400 flex items-center gap-1">
                      <Sword className="w-3 h-3" /> {playerCard.stats.attack}
                    </span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {playerCard.stats.defense}
                    </span>
                  </div>
                </div>
                {battleResult && (
                  <div className={`mt-2 font-accent text-2xl ${
                    battleResult.winner === 'player' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {battleResult.winner === 'player' ? `-${battleResult.opponentDamage}` : `-${battleResult.playerDamage}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#FF6F2C] rounded-full flex items-center justify-center animate-pulse">
            <span className="font-accent text-2xl text-[#1B2B1B]">VS</span>
          </div>
          {!isBattling && !battleResult && (
            <button
              onClick={startBattle}
              className="mt-4 btn-primary"
            >
              <Sword className="w-5 h-5 inline mr-2" />
              Battle!
            </button>
          )}
          {battleResult?.winner === 'player' && (
            <Trophy className="w-12 h-12 text-yellow-400 mt-4 animate-bounce" />
          )}
        </div>

        {/* Opponent Card */}
        <div className="text-center">
          <p className="text-red-400 font-display text-lg mb-2">OPPONENT</p>
          <div ref={opponentCardRef} className="relative">
            {opponentCard && (
              <div className="w-48 sm:w-56">
                <img 
                  src={opponentCard.image} 
                  alt={opponentCard.name}
                  className="w-full rounded-2xl border-4 border-red-500 shadow-lg"
                />
                <div className="mt-2">
                  <p className="text-[#F3EFE6] font-bold">{opponentCard.name}</p>
                  <div className="flex justify-center gap-2 mt-1 text-xs">
                    <span className="text-red-400 flex items-center gap-1">
                      <Sword className="w-3 h-3" /> {opponentCard.stats.attack}
                    </span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {opponentCard.stats.defense}
                    </span>
                  </div>
                </div>
                {battleResult && (
                  <div className={`mt-2 font-accent text-2xl ${
                    battleResult.winner === 'opponent' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {battleResult.winner === 'opponent' ? `-${battleResult.playerDamage}` : `-${battleResult.opponentDamage}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Battle Result */}
      {battleResult && (
        <div className="text-center animate-fade-in">
          <div className={`inline-block px-6 py-3 rounded-xl mb-4 ${
            battleResult.winner === 'player' ? 'bg-green-900/50 border border-green-500' :
            battleResult.winner === 'opponent' ? 'bg-red-900/50 border border-red-500' :
            'bg-yellow-900/50 border border-yellow-500'
          }`}>
            <p className={`font-display text-xl ${
              battleResult.winner === 'player' ? 'text-green-400' :
              battleResult.winner === 'opponent' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {battleResult.winner === 'player' ? '🎉 You Win!' :
               battleResult.winner === 'opponent' ? '💀 You Lose!' :
               '🤝 Draw!'}
            </p>
          </div>
          <div>
            <button
              onClick={resetBattle}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Battle Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
