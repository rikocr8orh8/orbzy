"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p className="text-gray-500 mb-8">Last updated: January 15, 2026</p>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully before using the Orbzy
            website and service (the &quot;Service&quot;) operated by Orbzy (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p className="text-gray-600 mb-6">
            By accessing or using the Service, you agree to be bound by these Terms. If you
            disagree with any part of the Terms, you may not access the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            Orbzy is a home maintenance scheduling platform that allows users to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Create and manage maintenance schedules for their properties</li>
            <li>Track maintenance tasks and receive reminders</li>
            <li>Search for and view information about local service providers</li>
            <li>Organize property maintenance information</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            To access certain features of the Service, you must create an account. When you
            create an account, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="text-gray-600 mb-6">
            We reserve the right to suspend or terminate your account if any information
            provided is inaccurate, false, or violates these Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Subscription and Payments</h2>
          <p className="text-gray-600 mb-4">
            Orbzy offers both free and paid subscription plans. For paid subscriptions:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Payment is processed securely through Stripe, our third-party payment processor</li>
            <li>Subscriptions are billed on a recurring basis (monthly or annually) depending on your selected plan</li>
            <li>You authorize us to charge your payment method for recurring fees until you cancel</li>
            <li>Prices are subject to change with reasonable notice</li>
            <li>All fees are non-refundable except as required by law or as explicitly stated</li>
          </ul>
          <p className="text-gray-600 mb-6">
            You may cancel your subscription at any time through your account settings. Cancellation
            will take effect at the end of your current billing period.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Service Provider Information Disclaimer</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700 font-medium mb-2">⚠️ Important Notice:</p>
            <p className="text-gray-600 mb-4">
              Service provider listings displayed on Orbzy are sourced from the Google Places API
              and other third-party sources. Orbzy does not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Verify, endorse, or guarantee any service provider</li>
              <li>Verify licenses, certifications, insurance, or qualifications</li>
              <li>Guarantee the accuracy of provider information, reviews, or ratings</li>
              <li>Act as a party to any transaction between you and a service provider</li>
              <li>Assume any liability for work performed by service providers</li>
            </ul>
          </div>
          <p className="text-gray-600 mb-6">
            <strong>You are solely responsible</strong> for verifying all credentials, licenses,
            insurance, and qualifications before hiring any service provider. Any agreement or
            transaction between you and a service provider is strictly between you and that provider.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. User Responsibilities</h2>
          <p className="text-gray-600 mb-4">By using the Service, you agree not to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Upload malicious code or attempt to compromise security</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Impersonate another person or entity</li>
            <li>Share your account credentials with others</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            The Service and its original content, features, and functionality are owned by Orbzy
            and are protected by international copyright, trademark, and other intellectual property
            laws. You may not copy, modify, distribute, sell, or lease any part of the Service
            without our prior written consent.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORBZY AND ITS OFFICERS, DIRECTORS, EMPLOYEES,
              AND AGENTS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Any loss of profits, data, use, or goodwill</li>
              <li>Any damages resulting from service provider actions or omissions</li>
              <li>Any damages exceeding the amount paid by you in the 12 months prior to the claim</li>
            </ul>
          </div>
          <p className="text-gray-600 mb-6">
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of
            any kind, either express or implied, including but not limited to implied warranties
            of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Indemnification</h2>
          <p className="text-gray-600 mb-6">
            You agree to indemnify, defend, and hold harmless Orbzy and its officers, directors,
            employees, and agents from any claims, damages, losses, liabilities, and expenses
            (including attorneys&apos; fees) arising from your use of the Service, violation of these
            Terms, or infringement of any rights of another party.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Termination</h2>
          <p className="text-gray-600 mb-6">
            We may terminate or suspend your account and access to the Service immediately,
            without prior notice or liability, for any reason, including breach of these Terms.
            Upon termination, your right to use the Service will cease immediately. Provisions
            of these Terms that by their nature should survive termination shall survive.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These Terms shall be governed by and construed in accordance with the laws of the
            State of California, United States, without regard to its conflict of law provisions.
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
            of the courts located in San Mateo County, California.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion. By
            continuing to access or use the Service after revisions become effective, you agree
            to be bound by the revised Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-none text-gray-600 mb-6 space-y-1">
            <li><strong>Email:</strong> support@orbzy.com</li>
            <li><strong>Address:</strong> c/o Orbzy, 210 S Ellsworth Ave #345, San Mateo, CA 94401</li>
          </ul>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              By using Orbzy, you acknowledge that you have read, understood, and agree to be
              bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
