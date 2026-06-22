import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="About">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Who are we?</h2>
        <p>
          Hookerra is an innovative SaaS platform built to amplify the social media voice of content
          creators, entrepreneurs, and brands in the digital age. We know how difficult it is to grab
          attention and stand out from the crowd in today&apos;s digital world. That&apos;s why we create
          solutions that help you make an impact in the very first second of your content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Our mission</h2>
        <p>
          By combining social media dynamics with AI technology, we transform the time-consuming processes
          of finding content, writing attention-grabbing headlines, and creating hooks into an effortless
          experience that takes seconds. Our goal is to let you focus solely on &ldquo;creating&rdquo; while
          your ideas reach a wider audience.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Why Hookerra?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Speed &amp; Efficiency:</strong> Thanks
            to our advanced AI models, we instantly analyze and generate the most effective headlines
            and opening sentences that will keep your audience hooked.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Minimalist &amp; Powerful Experience:</strong>{' '}
            We won&apos;t waste your time with complex panels or confusing settings. We offer a clean,
            fast, and purpose-built interface.
          </li>
          <li>
            <strong className="font-semibold text-[#C8C8C8]">Continuous Improvement:</strong> We
            closely follow social media trends and update our infrastructure daily to develop content
            strategies best suited to the algorithms.
          </li>
        </ul>
      </section>

      <p>
        We&apos;re here to build the content strategy of the future today and maximize your potential in
        the digital space.
      </p>

      <section className="space-y-3 border-l-4 border-[#FF0000] pl-4">
        <h2 className="text-base font-bold text-white">Contact</h2>
        <p>
          General inquiries &amp; partnerships:{' '}
          <a
            href="mailto:hello@hookerra.com"
            className="text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
          >
            hello@hookerra.com
          </a>
        </p>
        <p>
          For support emails, privacy requests, response times and company details, visit our{' '}
          <Link
            href="/contact"
            className="font-semibold text-[#FF0000] underline decoration-[#FF0000]/40 underline-offset-2 hover:text-white"
          >
            Contact
          </Link>{' '}
          page.
        </p>
      </section>
    </LegalPage>
  );
}
