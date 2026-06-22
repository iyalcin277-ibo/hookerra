import { LegalPage } from '@/components/LegalPage';

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy">
      <p className="text-xs text-[#707070]">Last updated: May 18, 2026</p>

      <p>
        At Hookerra we want you to be satisfied with our AI-powered tools. Due to the digital nature of
        our services, our refund process is governed by the rules summarized below.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Digital content &amp; services</h2>
        <p>
          Subscriptions and credits purchased on Hookerra are considered &quot;instantly delivered digital
          content.&quot; Under applicable consumer regulations, there is no standard right of withdrawal
          for plans that have already been used (e.g. hooks or other AI-generated outputs already
          produced).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Refund conditions</h2>
        <p>You may request a refund in the following cases:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Technical errors:</strong> If a
            system-side issue prevents you from accessing the service and the problem cannot be resolved
            within 48 hours.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Unused subscription:</strong> If the
            refund request is submitted within 24 hours of purchase and no AI generations have been made
            during that period.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Refund process</h2>
        <p>
          Send your refund request to{' '}
          <a
            href="mailto:support@hookerra.com"
            className="font-medium text-white underline decoration-[#FF0000]/60 underline-offset-2 hover:decoration-[#FF0000]"
          >
            support@hookerra.com
          </a>{' '}
          along with your account details and invoice. After reviewing your request, we will get back to
          you within 7 business days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Subscription cancellation</h2>
        <p>
          A refund and a cancellation are different things. You can cancel your subscription at any time.
          Upon cancellation, no refund is issued for the current billing period; however, you continue
          to have access to the service until the end of that period.
        </p>
      </section>
    </LegalPage>
  );
}
