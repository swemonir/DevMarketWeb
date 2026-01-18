import { Link } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { ArrowRight, Code, Smartphone, Globe, Palette, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
interface LandingPageProps {
  onOpenAuth: () => void;
}
export function LandingPage({
  onOpenAuth
}: LandingPageProps) {
  const categories = [{
    name: 'AI Tools',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    count: '120+'
  }, {
    name: 'Web Apps',
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    count: '350+'
  }, {
    name: 'Mobile Apps',
    icon: <Smartphone className="w-6 h-6 text-purple-400" />,
    count: '200+'
  }, {
    name: 'Design',
    icon: <Palette className="w-6 h-6 text-pink-400" />,
    count: '150+'
  }, {
    name: 'Source Code',
    icon: <Code className="w-6 h-6 text-green-400" />,
    count: '500+'
  }];

  // this is for auth part 
  const { user } = useAuth()
  return <div className="min-h-screen">
    {/* Hero Section */}
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-[#0a0e1a] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-medium mb-6">
            The #1 Marketplace for Developers
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Discover, Showcase & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Sell Digital Creations
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            DevNexus is the premier platform for developers to share their
            work, find inspiration, and monetize their side projects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/discover">
              <Button size="lg" className="min-w-[160px]">
                Explore Apps
              </Button>
            </Link>
            {
              user ? '' : <Button variant="outline" size="lg" onClick={onOpenAuth} className="min-w-[160px]">
                Sign In
              </Button>
            }

          </div>
        </motion.div>
      </div>
    </section>

    {/* Featured Categories */}
    <section className="py-20 bg-[#0a0e1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-400">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => <motion.div key={cat.name} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: idx * 0.1
          }} viewport={{
            once: true
          }}>
            <Link to={`/discover?category=${cat.name}`}>
              <Card hoverEffect className="p-6 text-center h-full flex flex-col items-center justify-center gap-4 bg-[#151b2d]/50">
                <div className="p-3 rounded-full bg-gray-800/50">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.count} items</p>
                </div>
              </Card>
            </Link>
          </motion.div>)}
        </div>
      </div>
    </section>

    {/* Features Grid */}
    <section className="py-20 bg-[#0f1422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Global Discovery
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Get your projects in front of thousands of developers,
              investors, and potential users from around the world.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Verified Trust
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Every listing is manually reviewed to ensure quality and
              authenticity. Buy and sell with confidence.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Instant Transactions
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Connect directly with sellers via WhatsApp or Email to negotiate
              and close deals faster.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
            Ready to showcase your work?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of developers who are building their portfolio and
            earning income on DevNexus.
          </p>
          <div className="relative z-10">
            <Button size="lg" onClick={onOpenAuth} className="bg-white text-blue-900 hover:bg-gray-100">
              Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>;
}