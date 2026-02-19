import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { TradingCard } from '@/components/TradingCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';
import { komodoCards } from '@/data/cards';
import { Shield, Sword, Zap, Wind, Heart, ChevronDown, Package, BookOpen, Swords } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Quiz = lazy(() => import('@/components/Quiz').then((mod) => ({ default: mod.Quiz })));
const PackOpening = lazy(() => import('@/components/PackOpening').then((mod) => ({ default: mod.PackOpening })));
const BattleArena = lazy(() => import('@/components/BattleArena').then((mod) => ({ default: mod.BattleArena })));

interface HeroParticle {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

const HERO_PARTICLES: HeroParticle[] = [
  { id: 0, left: '8%', top: '18%', animationDelay: '0.3s', animationDuration: '4.5s' },
  { id: 1, left: '16%', top: '64%', animationDelay: '1.0s', animationDuration: '6.0s' },
  { id: 2, left: '24%', top: '30%', animationDelay: '1.8s', animationDuration: '4.2s' },
  { id: 3, left: '33%', top: '72%', animationDelay: '2.2s', animationDuration: '5.1s' },
  { id: 4, left: '41%', top: '44%', animationDelay: '0.6s', animationDuration: '6.4s' },
  { id: 5, left: '49%', top: '14%', animationDelay: '2.8s', animationDuration: '4.9s' },
  { id: 6, left: '58%', top: '80%', animationDelay: '3.1s', animationDuration: '5.5s' },
  { id: 7, left: '66%', top: '26%', animationDelay: '1.4s', animationDuration: '6.3s' },
  { id: 8, left: '74%', top: '58%', animationDelay: '0.9s', animationDuration: '4.7s' },
  { id: 9, left: '82%', top: '38%', animationDelay: '2.5s', animationDuration: '5.8s' },
  { id: 10, left: '90%', top: '70%', animationDelay: '1.7s', animationDuration: '4.3s' },
  { id: 11, left: '96%', top: '22%', animationDelay: '3.0s', animationDuration: '6.1s' },
];

const statHighlights = [
  { icon: Sword, name: 'Attack', desc: 'Bite force + claw combos', iconContainerClass: 'bg-red-500/20', iconClass: 'text-red-400' },
  { icon: Shield, name: 'Defense', desc: 'Scales, dodge, terrain armor', iconContainerClass: 'bg-blue-500/20', iconClass: 'text-blue-400' },
  { icon: Heart, name: 'Health', desc: 'Survivability and endurance', iconContainerClass: 'bg-green-500/20', iconClass: 'text-green-400' },
  { icon: Wind, name: 'Speed', desc: 'Movement and reaction time', iconContainerClass: 'bg-yellow-500/20', iconClass: 'text-yellow-400' },
  { icon: Zap, name: 'Energy', desc: 'Stamina for special moves', iconContainerClass: 'bg-purple-500/20', iconClass: 'text-purple-400' },
] as const;

const modalStatStyles = [
  { icon: Sword, name: 'Attack', colorClass: 'text-red-400', bgClass: 'bg-red-900/30', valueKey: 'attack' },
  { icon: Shield, name: 'Defense', colorClass: 'text-blue-400', bgClass: 'bg-blue-900/30', valueKey: 'defense' },
  { icon: Heart, name: 'HP', colorClass: 'text-green-400', bgClass: 'bg-green-900/30', valueKey: 'hp' },
  { icon: Wind, name: 'Speed', colorClass: 'text-yellow-400', bgClass: 'bg-yellow-900/30', valueKey: 'speed' },
  { icon: Zap, name: 'Energy', colorClass: 'text-purple-400', bgClass: 'bg-purple-900/30', valueKey: 'energy' },
] as const;

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[#3a4a3a] bg-[#1B2B1B] p-4 text-center text-[#B8C1B8]">
      {label}
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof komodoCards[0] | null>(null);
  
  const collectionRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<HTMLDivElement>(null);
  const battleRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hero cards for display
  const heroCards = komodoCards.slice(0, 4);
  const featureCards = komodoCards.slice(4, 7);
  const collectionCards = komodoCards.slice(7, 14);

  // GSAP Scroll Animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate cards staggered
      gsap.utils.toArray<HTMLElement>('.animate-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30, rotateY: -15 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Hero content animation
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );

      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.8 }
      );

      // Floating animation for hero cards
      gsap.to('.hero-card-float', {
        y: -15,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#1B2B1B]">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation 
        onCollectionClick={() => scrollToSection(collectionRef)}
        onQuizClick={() => scrollToSection(quizRef)}
        onPacksClick={() => scrollToSection(packsRef)}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#243824] via-[#1B2B1B] to-[#1B2B1B]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_PARTICLES.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-[#FF6F2C]/20 rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="hero-title font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-[#F3EFE6] mb-6 leading-tight">
                Collect the
                <span className="text-[#FF6F2C] block">Dragons.</span>
                Rule the Islands.
              </h1>
              <p className="hero-subtitle text-[#B8C1B8] text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                A trading card adventure built on stats, strategy, and ancient predators. 
                Collect, trade, and battle with unique Komodo dragon cards.
              </p>
              
              <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => scrollToSection(collectionRef)}
                      className="btn-primary"
                    >
                      Explore Cards
                    </button>
                    <p className="text-[#B8C1B8] text-sm flex items-center justify-center sm:justify-start">
                      Free to play. No wallet required.
                    </p>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowQuizModal(true)}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      Take Quiz
                    </button>
                    <button 
                      onClick={() => setShowPackModal(true)}
                      className="bg-[#243824] text-[#F3EFE6] border-2 border-[#3a4a3a] px-6 py-4 rounded-xl font-display font-bold uppercase tracking-wider hover:border-[#FF6F2C] transition-colors inline-flex items-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Open Pack
                    </button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
                  <p className="font-accent text-3xl text-[#FF6F2C]">15+</p>
                  <p className="text-[#B8C1B8] text-sm">Unique Cards</p>
                </div>
                <div className="text-center animate-fade-in" style={{ animationDelay: '1.1s' }}>
                  <p className="font-accent text-3xl text-[#FF6F2C]">5</p>
                  <p className="text-[#B8C1B8] text-sm">Rarities</p>
                </div>
                <div className="text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <p className="font-accent text-3xl text-[#FF6F2C]">∞</p>
                  <p className="text-[#B8C1B8] text-sm">Strategies</p>
                </div>
              </div>
            </div>

            {/* Right Content - Card Display */}
            <div className="relative h-[500px] flex items-center justify-center hero-card-float">
              {/* Stacked cards behind */}
              {heroCards.slice(1).map((card, index) => (
                <div
                  key={card.id}
                  className="absolute animate-fade-in"
                  style={{
                    transform: `translateX(${(index + 1) * 30}px) translateY(${(index + 1) * 20}px) rotate(${(index + 1) * 8}deg)`,
                    zIndex: index + 1,
                    animationDelay: `${0.5 + index * 0.2}s`
                  }}
                >
                  <TradingCard card={card} size="md" showStats={false} />
                </div>
              ))}
              {/* Main hero card */}
              <div 
                className="absolute z-10 animate-fade-in"
                style={{ 
                  transform: 'rotate(-6deg)',
                  animationDelay: '0.3s'
                }}
              >
                <TradingCard 
                  card={heroCards[0]} 
                  size="lg" 
                  onClick={() => setSelectedCard(heroCards[0])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#B8C1B8]" />
        </div>
      </section>

      {/* Rarity Tiers Section */}
      <section className="animate-section py-20 bg-[#243824]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Rarity Tiers
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              From Common to Legendary - each tier brings more powerful stats and unique abilities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Common', color: '#B8C1B8', desc: 'Basic cards' },
              { name: 'Uncommon', color: '#4ADE80', desc: 'Boosted stats' },
              { name: 'Rare', color: '#60A5FA', desc: 'Strong abilities' },
              { name: 'Epic', color: '#A78BFA', desc: 'Powerful unique' },
              { name: 'Legendary', color: '#FF6F2C', desc: 'Game-changers', glow: true }
            ].map((tier) => (
              <div 
                key={tier.name}
                className="animate-card bg-[#1B2B1B] rounded-2xl p-4 border-2 text-center relative overflow-hidden"
                style={{ borderColor: tier.color }}
              >
                {tier.glow && <div className="absolute inset-0 opacity-10 animate-pulse" style={{ backgroundColor: tier.color }} />}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${tier.color}20` }}
                >
                  <span className="font-bold text-xs" style={{ color: tier.color }}>
                    {tier.name[0]}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg mb-1" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="text-[#B8C1B8] text-xs">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Types Section */}
      <section className="animate-section py-20 bg-[#1B2B1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Three paths. One island.
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              Tanks soak damage. Rogues strike fast. Balanced adapts to any situation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center justify-items-center">
            {featureCards.map((card, index) => (
              <div 
                key={card.id}
                className="animate-card transform hover:scale-105 transition-transform"
                style={{ 
                  transform: `rotate(${(index - 1) * 5}deg)`,
                }}
              >
                <TradingCard 
                  card={card} 
                  size="md"
                  onClick={() => setSelectedCard(card)}
                />
                <div className="text-center mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    card.type === 'tank' ? 'bg-blue-500/20 text-blue-400' :
                    card.type === 'rogue' ? 'bg-red-500/20 text-red-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {card.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats System Section */}
      <section className="animate-section py-20 bg-[#243824]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
                Stats that shape strategy
              </h2>
              <p className="text-[#B8C1B8] mb-8">
                Every card has unique stats that determine its strengths and weaknesses in battle.
              </p>

              <div className="space-y-4">
                {statHighlights.map((stat) => (
                  <div 
                    key={stat.name}
                    className="animate-card flex items-center gap-4 bg-[#1B2B1B] rounded-xl p-4"
                  >
                    <div className={`w-12 h-12 ${stat.iconContainerClass} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-[#F3EFE6]">{stat.name}</h4>
                      <p className="text-[#B8C1B8] text-sm">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Card */}
            <div className="flex justify-center animate-card">
              <TradingCard 
                card={komodoCards[0]} 
                size="lg"
                onClick={() => setSelectedCard(komodoCards[0])}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Battle Section */}
      <section ref={battleRef} className="animate-section py-20 bg-[#1B2B1B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Battle Arena
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              Pit your dragons against opponents in epic battles! Strategy and stats determine the winner.
            </p>
          </div>

          {isAuthenticated ? (
            <div className="bg-[#243824] rounded-2xl p-6 border-2 border-[#3a4a3a]">
              <Suspense fallback={<SectionFallback label="Loading battle arena..." />}>
                <BattleArena />
              </Suspense>
            </div>
          ) : (
            <div className="bg-[#243824] rounded-2xl p-8 border-2 border-[#3a4a3a] text-center">
              <Swords className="w-16 h-16 text-[#FF6F2C] mx-auto mb-4" />
              <h3 className="font-display text-2xl text-[#F3EFE6] mb-2">
                Login to Battle
              </h3>
              <p className="text-[#B8C1B8] mb-6">
                Create an account to challenge opponents and test your dragons' strength!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Collection Section */}
      <section ref={collectionRef} className="animate-section py-20 bg-[#243824]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Build your island roster
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              Collect cards from different habitats and rarities to build the ultimate deck.
            </p>
            {isAuthenticated && user && (
              <p className="text-[#FF6F2C] mt-4 font-display">
                Your Collection: {user.collection.length} / {komodoCards.length} cards
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionCards.map((card, index) => (
              <div key={card.id} className="flex justify-center animate-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <TradingCard 
                  card={card} 
                  size="md"
                  onClick={() => setSelectedCard(card)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section ref={quizRef} className="animate-section py-20 bg-[#1B2B1B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Earn packs. Answer smart.
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              Test your knowledge about Komodo dragons and earn card packs! 
              More correct answers = better drop rates.
            </p>
          </div>

          {isAuthenticated ? (
            <Suspense fallback={<SectionFallback label="Loading quiz..." />}>
              <Quiz onComplete={() => setShowQuizModal(false)} />
            </Suspense>
          ) : (
            <div className="bg-[#243824] rounded-2xl p-8 border-2 border-[#3a4a3a] text-center">
              <BookOpen className="w-16 h-16 text-[#FF6F2C] mx-auto mb-4" />
              <h3 className="font-display text-2xl text-[#F3EFE6] mb-2">
                Login to Take the Quiz
              </h3>
              <p className="text-[#B8C1B8] mb-6">
                Create an account or login to start earning card packs through quizzes!
              </p>
              <p className="text-sm text-[#B8C1B8]">
                3 questions per pack • Better scores = Better cards
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pack Opening Section */}
      <section ref={packsRef} className="animate-section py-20 bg-[#243824]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-[#F3EFE6] mb-4">
              Open Packs
            </h2>
            <p className="text-[#B8C1B8] max-w-2xl mx-auto">
              Open mystery card packs to expand your collection. 
              Will you find a legendary Komodo dragon?
            </p>
          </div>

          {isAuthenticated ? (
            <div className="bg-[#1B2B1B] rounded-2xl p-8 border-2 border-[#3a4a3a]">
              <Suspense fallback={<SectionFallback label="Loading pack opening..." />}>
                <PackOpening onComplete={() => setShowPackModal(false)} />
              </Suspense>
            </div>
          ) : (
            <div className="bg-[#1B2B1B] rounded-2xl p-8 border-2 border-[#3a4a3a] text-center">
              <Package className="w-16 h-16 text-[#FF6F2C] mx-auto mb-4" />
              <h3 className="font-display text-2xl text-[#F3EFE6] mb-2">
                Login to Open Packs
              </h3>
              <p className="text-[#B8C1B8] mb-6">
                Create an account to start opening card packs and building your collection!
              </p>
              <p className="text-sm text-[#B8C1B8]">
                Each pack contains 3 random cards
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B2B1B] border-t border-[#3a4a3a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦎</span>
              <span className="font-display font-bold text-[#F3EFE6]">
                Komodo Kingdom
              </span>
            </div>
            <p className="text-[#B8C1B8] text-sm">
              Collect the Dragons. Rule the Islands.
            </p>
            <p className="text-[#B8C1B8] text-sm">
              © 2026 Komodo Kingdom Cards
            </p>
          </div>
        </div>
      </footer>

      {/* Card Detail Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="bg-[#1B2B1B] border-2 border-[#3a4a3a] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          {selectedCard && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="font-display text-2xl sm:text-3xl text-[#F3EFE6]">
                  {selectedCard.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Card Image */}
                <div className="flex-shrink-0 flex justify-center lg:justify-start">
                  <div className="w-48 sm:w-56 lg:w-64">
                    <img 
                      src={selectedCard.image} 
                      alt={selectedCard.name}
                      className="w-full rounded-2xl border-4 border-[#F3EFE6] shadow-lg"
                      loading="eager"
                    />
                    <div className="mt-3 text-center">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold font-display uppercase"
                        style={{ 
                          backgroundColor: selectedCard.rarity === 'common' ? '#B8C1B8' :
                            selectedCard.rarity === 'uncommon' ? '#4ADE80' :
                            selectedCard.rarity === 'rare' ? '#60A5FA' :
                            selectedCard.rarity === 'epic' ? '#A78BFA' : '#FF6F2C',
                          color: '#1B2B1B'
                        }}
                      >
                        {selectedCard.rarity}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#B8C1B8] mb-4 text-sm sm:text-base">{selectedCard.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#243824] rounded-lg p-3">
                      <p className="text-[#FF6F2C] text-xs uppercase font-bold">Habitat</p>
                      <p className="text-[#F3EFE6] text-sm">{selectedCard.habitat}</p>
                    </div>
                    <div className="bg-[#243824] rounded-lg p-3">
                      <p className="text-[#FF6F2C] text-xs uppercase font-bold">Type</p>
                      <p className="text-[#F3EFE6] text-sm capitalize">{selectedCard.type}</p>
                    </div>
                  </div>

                  <div className="bg-[#243824] rounded-lg p-3 mb-4">
                    <p className="text-[#FF6F2C] text-xs uppercase font-bold mb-1">Special Ability</p>
                    <p className="text-[#F3EFE6] text-sm">{selectedCard.ability}</p>
                  </div>
                  
                  <div className="border-t border-[#3a4a3a] pt-4">
                    <h4 className="font-display text-[#F3EFE6] mb-3 text-lg">Stats</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {modalStatStyles.map((stat) => (
                        <div key={stat.name} className={`${stat.bgClass} rounded-lg p-2 text-center`}>
                          <stat.icon className={`w-4 h-4 ${stat.colorClass} mx-auto mb-1`} />
                          <p className={`${stat.colorClass} text-xs`}>{stat.name}</p>
                          <p className={`font-accent text-xl ${stat.colorClass}`}>
                            {selectedCard.stats[stat.valueKey]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="bg-[#1B2B1B] border-2 border-[#3a4a3a] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#F3EFE6]">
              Komodo Quiz
            </DialogTitle>
          </DialogHeader>
          <Suspense fallback={<SectionFallback label="Loading quiz..." />}>
            <Quiz onComplete={() => setShowQuizModal(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Pack Modal */}
      <Dialog open={showPackModal} onOpenChange={setShowPackModal}>
        <DialogContent className="bg-[#1B2B1B] border-2 border-[#3a4a3a] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#F3EFE6]">
              Open a Pack
            </DialogTitle>
          </DialogHeader>
          <Suspense fallback={<SectionFallback label="Loading pack opening..." />}>
            <PackOpening onComplete={() => setShowPackModal(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Battle Modal */}
      <Dialog open={showBattleModal} onOpenChange={setShowBattleModal}>
        <DialogContent className="bg-[#1B2B1B] border-2 border-[#3a4a3a] max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#F3EFE6]">
              Battle Arena
            </DialogTitle>
          </DialogHeader>
          <Suspense fallback={<SectionFallback label="Loading battle arena..." />}>
            <BattleArena />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
