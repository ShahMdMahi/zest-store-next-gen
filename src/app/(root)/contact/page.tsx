import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Zest Store",
  description: "Get in touch with Zest Store",
};

export default function ContactPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>

      <div className="prose dark:prose-invert mb-8">
        <p>
          We&apos;d love to hear from you! Whether you have a question about our products, need help
          with an order, or just want to say hello, please don&apos;t hesitate to reach out to us.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-medium">Email</h3>
            <p className="text-muted-foreground">support@zeststore.com</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Address</h3>
            <address className="text-muted-foreground not-italic">
              123 Zest Avenue
              <br />
              Suite 101
              <br />
              San Francisco, CA 94107
            </address>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Business Hours</h3>
            <p className="text-muted-foreground">
              Monday - Friday: 9am - 5pm PST
              <br />
              Saturday & Sunday: Closed
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="first-name" className="text-sm font-medium">
                First name
              </label>
              <input
                id="first-name"
                className="bg-background w-full rounded-md border p-2"
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last-name" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="last-name"
                className="bg-background w-full rounded-md border p-2"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="bg-background w-full rounded-md border p-2"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              className="bg-background w-full rounded-md border p-2"
              placeholder="Enter the subject"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="bg-background w-full rounded-md border p-2"
              placeholder="Enter your message"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
