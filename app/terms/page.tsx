import { LegalPage } from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p className="text-xs text-[#707070]">Last updated: May 18, 2026</p>

      <p>
        Welcome to Hookerra! By using this website you agree to the following terms. Please read them
        carefully.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Service description</h2>
        <p>
          Hookerra is a software-as-a-service (SaaS) platform that enables users to create social media
          content and opening lines (&quot;hooks&quot;) using artificial intelligence (AI) technology.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Account registration &amp; security</h2>
        <p>You must create an account to use the service.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            You are responsible for the accuracy of the information you provide during registration
            (e.g. email address).
          </li>
          <li>
            You are responsible for any unauthorized use of your account.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Acceptable use</h2>
        <p>By using Hookerra you agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Generate illegal, hateful, or otherwise harmful content.
          </li>
          <li>
            Use automated tools (bots, scrapers, etc.) that place excessive load on the system.
          </li>
          <li>
            Engage in activities that threaten the security of the platform.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. AI-generated content</h2>
        <p>
          Hookerra uses advanced AI models to generate content. We cannot guarantee that generated
          content is 100% accurate, current, or original.
        </p>
        <p>
          The legal and commercial responsibility for the use of generated content rests entirely with
          the user.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">5. Payments &amp; subscriptions</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Paid plans:</strong> Hookerra offers
            free and paid membership options (Starter, Pro, Unlimited).
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Auto-renewal:</strong> Subscriptions
            renew automatically at the end of each period unless cancelled.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Price changes:</strong> Hookerra reserves
            the right to change subscription prices; changes take effect from the next billing period.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">6. Limitation of liability</h2>
        <p>
          Hookerra shall not be held liable for service interruptions, data loss, or indirect damages
          caused by AI-generated text. The service is provided &quot;as is&quot;.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">7. Changes</h2>
        <p>
          These terms may be updated from time to time. Updates take effect as soon as they are
          published on the site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">8. Contact</h2>
        <p>
          For questions:{' '}
          <a
            href="mailto:support@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            support@hookerra.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
