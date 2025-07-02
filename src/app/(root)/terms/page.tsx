import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Zest Store",
  description: "Terms and conditions for Zest Store",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <div className="prose dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to Zest Store. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Zest Store if you do not agree to all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. License</h2>
          <p>Unless otherwise stated, Zest Store and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
          <p>You are specifically restricted from:</p>
          <ul>
            <li>Publishing any website material in any other media</li>
            <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
            <li>Using this website in any way that is or may be damaging to this website</li>
            <li>Using this website contrary to applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Privacy</h2>
          <p>Please read our Privacy Policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Reservation of Rights</h2>
          <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
        </section>
      </div>
    </div>
  );
}
