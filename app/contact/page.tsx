import { LegalPage } from '@/components/LegalPage';

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <p className="text-base text-white">Get in touch with us</p>
      <p>
        You can reach us for any questions, suggestions, partnership opportunities, or technical support
        requests related to Hookerra. Our team will get back to you as soon as possible.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Email addresses</h2>
        <p>
          Reach out directly using the address that best matches your inquiry:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">General Inquiries &amp; Partnerships:</strong>{' '}
            <a
              href="mailto:hello@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              hello@hookerra.com
            </a>
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Customer Support &amp; Technical Help:</strong>{' '}
            <a
              href="mailto:support@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              support@hookerra.com
            </a>
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Privacy &amp; Data Requests:</strong>{' '}
            <a
              href="mailto:privacy@hookerra.com"
              className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
            >
              privacy@hookerra.com
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Response time</h2>
        <p>
          We aim to respond to all emails within 24–48 business hours.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Company details</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Platform name:</strong> Hookerra SaaS
            Solutions
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Headquarters:</strong> Istanbul, Turkey
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}
