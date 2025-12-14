import Page from "../components/Page";
import { FooterConfig } from "../components/Footer";

const JoyDex = () => {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "JoyDex",
      icon: "/assets/images/joydex-icon.svg",
      description: "The ultimate companion for your Pokémon journey.",
    },
    socials: true,
    customContent: (
      <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
        <p>Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.</p>
        <p className="mt-2">
          JoyDex is an unofficial fan-made app and is not affiliated with
          Nintendo.
        </p>
      </div>
    ),
  };

  return (
    <Page footerConfig={footerConfig} className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium text-sm mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Coming Soon to iOS & Android
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Your Journey, <br />
                <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                JoyDex isn't just a database. It's a vibrant, interactive
                companion designed to bring joy back to your Pokémon adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  disabled
                  className="px-8 py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-200 to-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative flex justify-center items-center gap-6">
                <img
                  src="/assets/images/joydex-mockup-home.svg"
                  alt="App Home"
                  className="w-64 drop-shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500"
                />
                <img
                  src="/assets/images/joydex-mockup-detail.svg"
                  alt="App Detail"
                  className="w-64 drop-shadow-2xl transform translate-y-12 rotate-6 hover:rotate-0 transition-all duration-500 hidden sm:block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why JoyDex?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built by trainers, for trainers. We've packed every feature you
              need into a beautiful, joy-filled interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📚"
              title="Ultimate Database"
              desc="Gen 1-9 complete data. Moves, abilities, stats, and evolution trees at your fingertips."
            />
            <FeatureCard
              icon="⚔️"
              title="Smart Team Builder"
              desc="Analyze synergy, coverage, and weaknesses. Build the perfect competitive team."
            />
            <FeatureCard
              icon="✨"
              title="Catch Tracker"
              desc="Track your Living Dex, Shinies, and Alphas. Sync across all your devices."
            />

            <FeatureCard
              icon="🌑"
              title="Offline First"
              desc="No signal? No problem. The entire database is stored locally on your device."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <img
            src="/assets/images/joydex-icon.svg"
            alt=""
            className="absolute bottom-0 right-0 w-[800px] h-[800px] opacity-5 translate-x-1/2 translate-y-1/2 pointer-events-none"
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join thousands of trainers waiting for the most joyful Pokédex
              experience ever created.
            </p>
            <button
              disabled
              className="px-10 py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold text-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>
    </Page>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default JoyDex;
