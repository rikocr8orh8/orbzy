import Link from 'next/link'

export default function ProviderDisclaimer() {
  return (
    <div className="min-h-screen bg-gradient-orbzy">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-purple-300 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Provider Disclaimer</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-purple-100">
            <div className="glass-dark rounded-xl p-4 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-200">
                <strong>Last Updated:</strong> January 13, 2026
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Important Notice</h2>
              <p className="leading-relaxed">
                Orbzy displays business information sourced from the <strong>Google Places API</strong>.
                We are a directory and scheduling platform, not a marketplace or service provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What Orbzy Does NOT Do</h2>
              <ul className="space-y-3 list-disc list-inside">
                <li>Verify provider credentials, licenses, or insurance</li>
                <li>Endorse, recommend, or guarantee any provider</li>
                <li>Collect or manage provider account information</li>
                <li>Process payments between users and providers</li>
                <li>Manage transactions or contracts</li>
                <li>Assume liability for provider conduct, service quality, fraud, or disputes</li>
                <li>Control provider pricing, availability, or policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Provider Independence</h2>
              <p className="leading-relaxed">
                All providers listed on Orbzy are <strong>independent third parties</strong> operating under their own terms.
                They are not employees, contractors, or agents of Orbzy. Homeowners contact and book directly with providers
                at their own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h2>
              <p className="leading-relaxed mb-4">By using Orbzy, you acknowledge and agree that you are responsible for:</p>
              <ul className="space-y-3 list-disc list-inside">
                <li><strong>Verifying credentials:</strong> Check licenses, insurance, and references before hiring</li>
                <li><strong>Due diligence:</strong> Research providers, read reviews, check Better Business Bureau ratings</li>
                <li><strong>Contracts:</strong> Negotiate and sign contracts directly with providers</li>
                <li><strong>Payment:</strong> All payments are made directly to providers, not through Orbzy</li>
                <li><strong>Disputes:</strong> Resolve any issues directly with the provider</li>
                <li><strong>Safety:</strong> Ensure providers have proper safety equipment and follow regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                Orbzy's liability is limited to the subscription fees you've paid ($4.99-$29/month).
                We are not liable for:
              </p>
              <ul className="space-y-2 list-disc list-inside mt-4">
                <li>Provider negligence, fraud, or misconduct</li>
                <li>Property damage or personal injury caused by providers</li>
                <li>Breach of contract by providers</li>
                <li>Unlicensed or uninsured work</li>
                <li>Poor service quality or incomplete work</li>
                <li>Disputes over pricing or billing</li>
                <li>Data accuracy from Google Places API</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Source Provider Data</h2>
              <p className="leading-relaxed">
                Provider listings are automatically sourced from <strong>Google Places API</strong> based on:
              </p>
              <ul className="space-y-2 list-disc list-inside mt-4">
                <li>User location</li>
                <li>Service category (HVAC, Plumbing, etc.)</li>
                <li>Minimum rating threshold (4+ stars)</li>
                <li>Minimum review count (50+ reviews)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We do not manually curate, vet, or verify these listings. Information accuracy depends on Google's data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Recommended Safety Practices</h2>
              <div className="glass-dark rounded-xl p-6 space-y-3">
                <p className="font-semibold text-white">Before hiring any provider:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>✅ Verify state/local licenses</li>
                  <li>✅ Check liability and workers' compensation insurance</li>
                  <li>✅ Read reviews on multiple platforms (Google, Yelp, BBB)</li>
                  <li>✅ Get 3+ written quotes</li>
                  <li>✅ Sign a detailed contract</li>
                  <li>✅ Never pay in full upfront</li>
                  <li>✅ Check for complaints with your state's consumer protection agency</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Reporting Issues</h2>
              <p className="leading-relaxed">
                If you encounter fraudulent or dangerous providers, please:
              </p>
              <ul className="space-y-2 list-disc list-inside mt-4">
                <li>Report to your local consumer protection agency</li>
                <li>File a complaint with the Better Business Bureau</li>
                <li>Report to your state licensing board</li>
                <li>Contact us at <a href="mailto:support@orbzy.app" className="text-pink-400 underline">support@orbzy.app</a> so we can remove them from our displayed results</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
              <p className="leading-relaxed">
                Any disputes with providers must be resolved directly between you and the provider.
                Orbzy is not a party to these agreements and cannot mediate disputes.
              </p>
              <p className="leading-relaxed mt-4">
                For small claims, consider:
              </p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>Small claims court in your jurisdiction</li>
                <li>State contractor licensing board complaints</li>
                <li>Better Business Bureau mediation</li>
              </ul>
            </section>

            <section className="glass-dark rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="leading-relaxed">
                Questions about this disclaimer? Contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:legal@orbzy.app" className="text-pink-400 underline">legal@orbzy.app</a><br />
                <strong>Website:</strong> <a href="https://orbzy.app" className="text-pink-400 underline">orbzy.app</a>
              </p>
            </section>

            <div className="text-center mt-12 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                By using Orbzy, you acknowledge that you have read, understood, and agree to this Provider Disclaimer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
