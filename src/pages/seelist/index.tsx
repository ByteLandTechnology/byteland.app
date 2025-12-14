import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaFilm,
  FaHeart,
  FaPlay,
  FaMagnifyingGlass,
  FaTv,
  FaGlobe,
  FaShareNodes,
  FaDatabase,
  FaShieldHalved,
  FaMobileScreenButton,
  FaLanguage,
  FaFilter,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowTrendUp,
  FaBookmark,
} from "react-icons/fa6";

import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";

// Theme colors from Seelist icon
// Primary: #007AFF (iOS Blue)
// Secondary: #34C759 (iOS Green)
// Accent: #FF3B30 (iOS Red)

// App Store Style Product Card - 10:16 aspect ratio
// Layout: Title + Description on top, Phone slides up from bottom (showing top 70%)
const AppStoreProductCard = ({
  image,
  title,
  tagline,
  gradient,
}: {
  image: string;
  title: string;
  tagline: string;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative w-full max-w-[320px] aspect-[10/16] rounded-3xl shadow-2xl p-[2px] ring-1 ring-black/5"
    style={{
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
    }}
  >
    <div
      className="w-full h-full rounded-[calc(1.5rem-2px)] overflow-hidden relative"
      style={{ background: gradient }}
    >
      {/* Top Text Content */}
      <div className="pt-6 sm:pt-8 pb-3 sm:pb-4 px-3 sm:px-6 text-center">
        <h3 className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-white/70 text-xs sm:text-sm leading-snug">
          {tagline}
        </p>
      </div>

      {/* Phone Screenshot - slides up from bottom, showing top ~70% */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] translate-y-[30%]">
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="rounded-[2rem] p-[4px] shadow-xl"
            style={{
              background: "linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)",
            }}
          >
            <div className="rounded-[1.8rem] bg-black p-[2px]">
              <div className="relative rounded-[1.6rem] overflow-hidden">
                {/* Screenshot - no notch to block the view */}
                <img src={image} alt={title} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Feature Carousel
const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      id: "trending",
      image: "/assets/images/seelist/seelist-trending.png",
      title: "Real-Time Trending",
      tagline:
        "Discover the hottest movies and TV shows that everyone's talking about right now",
      gradient: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
      icon: FaArrowTrendUp,
      heading: "Real-Time Trending",
      description:
        "Stay connected to the entertainment world. Our trending section updates in real-time to show you what movies and TV shows are captivating audiences globally.",
      highlights: [
        "Global trending",
        "Real-time updates",
        "Rising stars",
        "Popular now",
      ],
    },
    {
      id: "movies",
      image: "/assets/images/seelist/seelist-movie.png",
      title: "Movie Discovery",
      tagline:
        "Explore millions of films from blockbusters to indie gems, all in one beautiful interface",
      gradient: "linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)",
      icon: FaFilm,
      heading: "Endless Movie Library",
      description:
        "Your gateway to cinema. Explore films spanning every genre—from Hollywood blockbusters to indie gems, timeless classics to international masterpieces.",
      highlights: [
        "All genres",
        "Smart filtering",
        "Detailed info",
        "Now playing",
      ],
    },
    {
      id: "tvshows",
      image: "/assets/images/seelist/seelist-tv-show.png",
      title: "TV Show Tracking",
      tagline:
        "Keep track of your favorite series, see what's airing today, and never miss an episode again",
      gradient: "linear-gradient(135deg, #34C759 0%, #30D158 100%)",
      icon: FaTv,
      heading: "TV Show Tracking",
      description:
        "Never lose track of your series again. See what's airing today, discover new shows, and track progress through every season.",
      highlights: [
        "Airing today",
        "Episode tracking",
        "Season progress",
        "New shows",
      ],
    },
    {
      id: "detail",
      image: "/assets/images/seelist/seelist-movie-detail.png",
      title: "Rich Details",
      tagline:
        "Get complete cast info, ratings, plot summaries, and personalized recommendations for every title",
      gradient: "linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)",
      icon: FaStar,
      heading: "Rich Movie Details",
      description:
        "Dive deep into every title. Get comprehensive cast info, ratings from multiple sources, plot summaries, and personalized recommendations.",
      highlights: [
        "Cast & crew",
        "Multiple ratings",
        "Plot summaries",
        "Recommendations",
      ],
    },
    {
      id: "trailer",
      image: "/assets/images/seelist/seelist-trailer.png",
      title: "Built-in Trailers",
      tagline:
        "Watch official trailers and behind-the-scenes content without ever leaving the app",
      gradient: "linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)",
      icon: FaPlay,
      heading: "Built-in Trailers",
      description:
        "Preview before you commit. Watch official trailers, teasers, and behind-the-scenes content without leaving the app.",
      highlights: [
        "YouTube player",
        "Official trailers",
        "Behind scenes",
        "Teaser clips",
      ],
    },
    {
      id: "collection",
      image: "/assets/images/seelist/seelist-collection.png",
      title: "Private Collection",
      tagline:
        "Build your personal watchlist with complete privacy—no account needed, works offline",
      gradient: "linear-gradient(135deg, #007AFF 0%, #34C759 100%)",
      icon: FaBookmark,
      heading: "Personal Collection",
      description:
        "Build your entertainment archive your way. Save favorites, create watchlists—everything stays on your device with complete privacy.",
      highlights: [
        "100% private",
        "No account",
        "Offline access",
        "Custom lists",
      ],
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, [features.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const current = features[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left - Text Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                {current.heading}
              </h3>

              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                {current.description}
              </p>

              <ul className="grid grid-cols-2 gap-4">
                {current.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-blue-50">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right - App Store Card with Navigation */}
          <div className="order-1 lg:order-2 flex items-center justify-center gap-2 sm:gap-6 relative">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-10 hover:scale-110"
              aria-label="Previous feature"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>

            <AppStoreProductCard
              image={current.image}
              title={current.title}
              tagline={current.tagline}
              gradient={current.gradient}
            />

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-10 hover:scale-110"
              aria-label="Next feature"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators (Dots only) */}
      <div className="flex items-center justify-center gap-2 mt-12">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-10 bg-white"
                : "w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to feature ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Seelist() {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "Seelist",
      description: "Your personal movie and show tracker.",
      icon: "/assets/images/seelist-icon.svg",
    },
    socials: true,
  };

  const coreFeatures = [
    {
      icon: FaDatabase,
      title: "TMDB Powered",
      desc: "Access millions of movies and TV shows with your own TMDB API key.",
      color: "#007AFF",
    },
    {
      icon: FaFilm,
      title: "Movie Discovery",
      desc: "Browse popular, now playing, upcoming, and top-rated films.",
      color: "#FF3B30",
    },
    {
      icon: FaTv,
      title: "TV Tracking",
      desc: "Follow series with season and episode tracking.",
      color: "#34C759",
    },
    {
      icon: FaPlay,
      title: "Trailer Player",
      desc: "Watch official trailers with the built-in YouTube player.",
      color: "#FF9500",
    },
    {
      icon: FaHeart,
      title: "Local Collection",
      desc: "Save favorites locally with complete privacy.",
      color: "#FF2D55",
    },
    {
      icon: FaMagnifyingGlass,
      title: "Smart Search",
      desc: "Find any movie or show instantly with advanced filters.",
      color: "#5856D6",
    },
  ];

  const additionalFeatures = [
    {
      icon: FaGlobe,
      title: "Multi-Language",
      desc: "English, Chinese, Japanese & more",
    },
    {
      icon: FaFilter,
      title: "Advanced Filters",
      desc: "Filter by genre, year, rating",
    },
    {
      icon: FaShareNodes,
      title: "Easy Sharing",
      desc: "Share with friends easily",
    },
    { icon: FaEye, title: "Watch Providers", desc: "See where to stream" },
  ];

  return (
    <Page footerConfig={footerConfig}>
      {/* Hero Section - Clean White Theme */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        {/* Background */}
        <div className="absolute inset-0">
          {/* Subtle decorative elements */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#007AFF]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-[#34C759]/5 rounded-full blur-[120px]"></div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center justify-center gap-4"
            >
              <img
                src="/assets/images/seelist-icon.svg"
                alt="Seelist"
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
              />
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gradient-tri">
                Seelist
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Your personal movie database. Browse millions of movies and TV
              shows, watch trailers, and build your private collection.
            </motion.p>

            {/* Hero App Preview - Fan-spread card layout like poker cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative w-full max-w-4xl mx-auto"
              style={{ height: "380px" }}
            >
              {/* Phone 1 - Far Left */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -25 }}
                animate={{ opacity: 1, x: 0, rotate: -18 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="absolute hidden lg:block"
                style={{
                  left: "5%",
                  bottom: "0",
                  width: "140px",
                  zIndex: 1,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.2rem] p-[3px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1rem] bg-black p-[2px]">
                    <div className="rounded-[0.9rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-trailer.png"
                        alt="Trailer"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 2 - Left */}
              <motion.div
                initial={{ opacity: 0, x: -60, rotate: -15 }}
                animate={{ opacity: 1, x: 0, rotate: -10 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute hidden sm:block"
                style={{
                  left: "15%",
                  bottom: "20px",
                  width: "150px",
                  zIndex: 2,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.4rem] p-[3px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1.2rem] bg-black p-[2px]">
                    <div className="rounded-[1rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-collection.png"
                        alt="Collection"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 3 - Left-Center (Visible on Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -6 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="absolute z-[3] bottom-[20px] sm:bottom-[40px] left-[5%] sm:left-[27%] w-[130px] sm:w-[160px]"
                style={{
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.5rem] p-[4px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1.3rem] bg-black p-[2px]">
                    <div className="rounded-[1.1rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-movie.png"
                        alt="Movies"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 4 - Center (Main, elevated) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute z-[10] left-1/2 -translate-x-1/2 bottom-[40px] sm:bottom-[60px] w-[150px] sm:w-[180px]"
              >
                <div
                  className="rounded-[1.8rem] p-[5px] shadow-2xl ring-2 ring-white/30"
                  style={{ background: "linear-gradient(145deg, #555, #111)" }}
                >
                  <div className="rounded-[1.5rem] bg-black p-[3px]">
                    <div className="rounded-[1.3rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-trending.png"
                        alt="Trending"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 5 - Right-Center (Visible on Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 8 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                className="absolute z-[3] bottom-[20px] sm:bottom-[40px] right-[5%] sm:right-[27%] w-[130px] sm:w-[160px]"
                style={{
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.5rem] p-[4px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1.3rem] bg-black p-[2px]">
                    <div className="rounded-[1.1rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-tv-show.png"
                        alt="TV Shows"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 6 - Right */}
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 15 }}
                animate={{ opacity: 1, x: 0, rotate: 10 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute hidden sm:block"
                style={{
                  right: "15%",
                  bottom: "20px",
                  width: "150px",
                  zIndex: 2,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.4rem] p-[3px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1.2rem] bg-black p-[2px]">
                    <div className="rounded-[1rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-movie-detail.png"
                        alt="Movie Detail"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 7 - Far Right */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 25 }}
                animate={{ opacity: 1, x: 0, rotate: 18 }}
                transition={{ delay: 0.95, duration: 0.5 }}
                className="absolute hidden lg:block"
                style={{
                  right: "5%",
                  bottom: "0",
                  width: "140px",
                  zIndex: 1,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="rounded-[1.2rem] p-[3px] shadow-xl"
                  style={{ background: "linear-gradient(145deg, #444, #111)" }}
                >
                  <div className="rounded-[1rem] bg-black p-[2px]">
                    <div className="rounded-[0.9rem] overflow-hidden">
                      <img
                        src="/assets/images/seelist/seelist-episodes.png"
                        alt="Episodes"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              <button
                disabled
                className="px-8 py-4 bg-gradient-to-r from-[#007AFF] to-[#34C759] text-white rounded-2xl font-bold text-lg opacity-80 cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <FaMobileScreenButton className="w-5 h-5" />
                Coming Soon
              </button>
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                Get TMDB API Key
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-8 justify-center text-slate-500 font-medium"
            >
              <Link
                href="/seelist/privacy"
                className="flex items-center gap-2 hover:text-[#34C759] transition-colors cursor-pointer group"
              >
                <FaShieldHalved className="w-5 h-5 text-[#34C759] group-hover:scale-110 transition-transform" />{" "}
                Privacy Policy
              </Link>
              <span className="flex items-center gap-2">
                <FaDatabase className="w-5 h-5 text-slate-900" /> Local Storage
              </span>
              <span className="flex items-center gap-2">
                <FaLanguage className="w-5 h-5 text-[#FF9500]" /> Multi-Language
              </span>
            </motion.div>

            {/* TMDB Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB Logo"
                className="h-3 w-auto"
              />
              <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left">
                This product uses the TMDB API but is not endorsed or certified
                by TMDB.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Carousel Section */}
      <section className="py-24 bg-[#007AFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Everything You Need
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Powerful features designed for movie enthusiasts and TV show
                fans who value privacy and beautiful design.
              </p>
            </motion.div>
          </div>
          <FeatureCarousel />
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Core Features
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Built with the tools you need to discover and organize
              entertainment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gradient-to-r from-[#007AFF] via-[#34C759] to-[#FF3B30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">And More</h2>
            <p className="text-white/70">
              Additional features to enhance your experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <f.icon className="w-8 h-8 mx-auto mb-3 text-white" />
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-white/70 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <img
            src="/assets/images/seelist-icon.svg"
            alt=""
            className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none"
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to start watching?
            </h2>
            <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
              Seelist is coming soon. Be among the first to experience a new way
              to discover and track your entertainment.
            </p>
            <button
              disabled
              className="px-10 py-4 bg-gradient-to-r from-[#007AFF] to-[#34C759] text-white rounded-2xl font-bold text-lg cursor-not-allowed shadow-lg inline-flex items-center gap-2 opacity-80"
            >
              <FaMobileScreenButton className="w-5 h-5" />
              Coming to App Store
            </button>
          </div>
        </div>
      </section>
    </Page>
  );
}
