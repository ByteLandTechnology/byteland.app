import { motion } from "framer-motion";
import {
  FaMobileScreenButton,
  FaCode,
  FaBolt,
  FaMapPin,
  FaUpRightFromSquare,
  FaRobot,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import Page from "../components/Page";
import { FooterConfig } from "../components/Footer";

export default function About() {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "ByteLand",
      description: "Innovating for your everyday life.",
      icon: "/assets/images/logo.svg",
    },
    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              About <span className="text-gradient-tri">ByteLand</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Building innovative applications that make everyday life better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Established in August 2024 in Hong Kong, ByteLand Technology
                Limited is dedicated to crafting practical, high-quality
                applications.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We specialize in Cross-platform Mobile and Progressive Web Apps
                (PWA) that integrate seamlessly into your daily life. Whether
                it's checking the weather, catching a bus, or coding on the go,
                our tools are designed to be there when you need them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <FaMobileScreenButton className="w-8 h-8 mx-auto text-rgb-blue mb-3" />
                <h3 className="font-bold text-slate-900">Mobile First</h3>
                <p className="text-sm text-slate-500">
                  Optimized for your pocket
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <FaBolt className="w-8 h-8 mx-auto text-rgb-green mb-3" />
                <h3 className="font-bold text-slate-900">Fast & Secure</h3>
                <p className="text-sm text-slate-500">Privacy by design</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <FaCode className="w-8 h-8 mx-auto text-rgb-red mb-3" />
                <h3 className="font-bold text-slate-900">Dev Focused</h3>
                <p className="text-sm text-slate-500">Built for coders</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <FaRobot className="w-8 h-8 mx-auto text-rgb-blue mb-3" />
                <h3 className="font-bold text-slate-900">AI Powered</h3>
                <p className="text-sm text-slate-500">Next-gen intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.570491328963!2d114.19606437623197!3d22.338353979659676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340406c6072345b7%3A0x2e669208952238e0!2sLuk%20Hop%20Industrial%20Building%2C%208%20Luk%20Hop%20St%2C%20San%20Po%20Kong!5e0!3m2!1sen!2shk!4v1701490000000!5m2!1sen!2shk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Floating Info Card */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-start md:px-20">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl max-w-md border border-slate-100 mx-4 md:mx-0">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rgb-blue/10 text-rgb-blue mb-6">
              <FaMapPin className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-brand">
              Visit Our HQ
            </h2>
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider font-semibold">
              Hong Kong
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rgb-red mt-2 shrink-0"></div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  ROOM 25, 15/F, BLOCK E,
                  <br />
                  LUK HOP INDUSTRIAL BUILDING
                  <br />8 LUK HOP STREET, SAN PO KONG
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/qTiNuqkwA14SgHvc6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-rgb-blue transition-colors group"
            >
              Open in Google Maps
              <FaUpRightFromSquare className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
            <a
              href="mailto:info@byteland.app"
              className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rgb-blue hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-rgb-blue/10 text-rgb-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaEnvelope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                <p className="text-sm text-slate-600">info@byteland.app</p>
              </div>
            </a>

            <a
              href="https://github.com/ByteLandTechnology"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rgb-blue hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-rgb-blue/10 text-rgb-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaGithub className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">GitHub</h3>
                <p className="text-sm text-slate-600">@ByteLandTechnology</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </Page>
  );
}
