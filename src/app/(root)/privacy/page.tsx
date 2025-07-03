import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Zest Store",
  description: "Privacy policy for Zest Store",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            At Zest Store, we respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            how we handle your personal data when you visit our website and tell
            you about your privacy rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal
            data about you including:
          </p>
          <ul>
            <li>Identity Data: first name, last name, username</li>
            <li>Contact Data: email address, phone number</li>
            <li>
              Technical Data: IP address, browser type, device information
            </li>
            <li>
              Usage Data: information about how you use our website and services
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Data
          </h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and manage your account</li>
            <li>Process orders and deliver products</li>
            <li>Send marketing communications (only with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your
            personal data from being accidentally lost, used, or accessed in an
            unauthorized way, altered, or disclosed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection
            laws in relation to your personal data, including:
          </p>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p>
            We use cookies to distinguish you from other users of our website,
            which helps us to provide you with a good experience and also allows
            us to improve our site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy
            practices, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
