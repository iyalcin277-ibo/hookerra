import { LegalPage } from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-xs text-[#707070]">Last updated: May 18, 2026</p>

      <p>
        At Hookerra, we take the privacy and security of the information you entrust to us seriously.
        This policy explains what data is collected and for what purpose when you use our services.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Data we collect</h2>
        <p>
          We collect the following information to improve our service quality and provide you with a
          personalized experience:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Account information:</strong> The email
            address and basic profile details you share during registration.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Content data:</strong> Text inputs you
            enter to generate content on the platform, and the results produced by the system.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Technical data:</strong> Anonymous
            statistics about the device, browser type, and usage patterns used to access the site.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. How we use your data</h2>
        <p>Collected data is used only for the following purposes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Managing user sessions and running secure sign-in processes.</li>
          <li>Providing the AI-powered content generation service.</li>
          <li>Improving user experience and resolving technical issues.</li>
          <li>Tracking subscription entitlements and managing membership processes.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Data security &amp; retention</h2>
        <p>
          Your data is protected with industry-standard encryption methods and strict security protocols.
          Our digital infrastructure is continuously monitored to prevent unauthorized access. Your data
          is retained for as long as your account is active or as legally required to provide the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Data sharing</h2>
        <p>
          Your data is never shared with third parties for commercial purposes or sold. It is only shared
          with technical partners strictly necessary for delivering the core service (such as payment
          processors or cloud infrastructure providers). All our partners are bound to protect your data
          at least as rigorously as we do.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">5. Your rights</h2>
        <p>As a user you have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Request a copy of the data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete information.</li>
          <li>
            Request permanent deletion of your account and all associated data from our systems.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">6. Cookies</h2>
        <p>
          Our site uses essential cookies to keep your session active and remember your preferences.
          These cookies do not track your personal data for advertising purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">7. Contact</h2>
        <p>
          For questions about our privacy practices or data deletion requests, contact us at:{' '}
          <a
            href="mailto:privacy@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            privacy@hookerra.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
