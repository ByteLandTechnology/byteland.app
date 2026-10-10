import Link from "next/link";
import Head from "next/head";
import { FaArrowLeft } from "react-icons/fa6";
import Page from "../components/Page";

export default function Custom404() {
  return (
    <Page>
      <Head>
        <title>404 - Page Not Found - ByteLand Technology</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight font-brand text-gradient-tri">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The page you are looking for has been retired or moved as part of our
          open-source redesign.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors dark:bg-white dark:text-slate-900"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </Page>
  );
}
