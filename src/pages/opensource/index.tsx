import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

/** The project list now lives on the home page; keep old links working. */
export default function ProjectsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <Head>
      <title>Projects - ByteLand Technology</title>
      <meta name="robots" content="noindex" />
      <meta httpEquiv="refresh" content="0; url=/" />
      <link rel="canonical" href="https://byteland.app" />
    </Head>
  );
}
