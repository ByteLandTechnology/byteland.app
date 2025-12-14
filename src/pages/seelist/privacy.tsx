import Page from "../../components/Page";
import { FooterConfig } from "../../components/Footer";

const SeelistPrivacy = () => {
  const footerConfig: FooterConfig = {
    variant: "grid",
    brand: {
      title: "Seelist",
      description: "Your personal movie and show tracker.",
      icon: "/assets/images/seelist-icon.svg",
    },
    links: [
      {
        title: "Product",
        items: [
          { label: "Features", href: "/seelist#features" },
          { label: "Privacy Policy", href: "/seelist/privacy" },
        ],
      },
    ],
    socials: true,
  };

  return (
    <Page footerConfig={footerConfig}>
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600">
              Your privacy is our priority. Seelist is designed to keep your
              data on your device.
            </p>
          </div>

          <div className="prose prose-lg prose-slate mx-auto">
            <h3>Introduction</h3>
            <p>
              At Seelist, we believe that your personal entertainment
              preferences are just that—personal. This Privacy Policy explains
              how Seelist handles your data. In short:{" "}
              <strong>we don't.</strong>
            </p>

            <h3>Data Collection and Storage</h3>
            <p>
              Seelist operates efficiently by storing your data locally on your
              device. We do not maintain servers to store your watchlists,
              favorites, or viewing history. All of this information stays with
              you.
            </p>
            <ul>
              <li>
                <strong>Local Storage:</strong> Your collections are stored
                directly on your device using local storage technologies.
              </li>
              <li>
                <strong>No Accounts:</strong> You do not need to create an
                account to use Seelist. No email, no password, no login.
              </li>
            </ul>

            <h3>Third-Party Services</h3>
            <p>
              Seelist uses the API provided by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Movie Database (TMDB)
              </a>{" "}
              to provide movie and TV show metadata, images, and other content.
            </p>
            <ul>
              <li>
                When you search for or view content, the app communicates
                directly with TMDB's API.
              </li>
              <li>
                Your use of TMDB is subject to{" "}
                <a
                  href="https://www.themoviedb.org/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TMDB's Privacy Policy
                </a>
                .
              </li>
            </ul>

            <h3>Changes to This Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a href="mailto:support@byteland.app">support@byteland.app</a>.
            </p>

            <p className="text-sm text-slate-400 mt-12">
              Last updated: December 13, 2025
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
};

export default SeelistPrivacy;
