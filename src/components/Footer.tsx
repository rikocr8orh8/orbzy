import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-900/50 to-purple-950 text-purple-200 py-12 mt-16 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏠</span>
              <h3 className="text-white font-bold text-xl">Orbzy</h3>
            </div>
            <p className="text-sm text-purple-300">
              Home maintenance scheduling made simple. Track tasks, find providers, never miss maintenance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition">Provider Disclaimer</Link></li>
              <li><a href="#" className="termly-display-preferences hover:text-white transition">Consent Preferences</a></li>
            </ul>
          </div>
        </div>

        {/* Provider Disclaimer Banner */}
        <div className="glass-dark rounded-lg p-4 mb-6 border border-purple-400/20">
          <p className="text-xs text-purple-300 leading-relaxed">
            <span className="text-yellow-400 font-semibold">⚠️ Important:</span> Provider listings sourced from Google Places API.
            Orbzy does not verify provider credentials, licenses, or insurance. We do not endorse or guarantee any provider.
            Users are responsible for verifying all credentials before hiring. All bookings are made directly with providers.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-purple-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-purple-400">
            © {new Date().getFullYear()} Orbzy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/legal/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/legal/disclaimer" className="hover:text-white transition">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
