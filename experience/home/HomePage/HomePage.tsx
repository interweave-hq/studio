import "server-only";

import Link from "next/link";
import Image from "next/image";
import { Header, Footer, InterfaceCard } from "@/components";
import { getMetadata } from "@/lib/metadata";

import styles from "./styles.module.css";
import { authenticate } from "@/lib/auth";

import { HeroInput } from "@/experience/home/HeroInput";
import { getButtonStyle } from "@/components/Button";

export const metadata = getMetadata({ title: "Home" });

export async function HomePage() {
    const { user } = await authenticate({ optional: true });
    return (
        <>
            <Header user={user} />
            <main className={styles.main}>
                <section className={`${styles.hero} ${styles.section} ${styles["section--top"]}`}>
                    <div className={`${styles.hero__inner} ${styles.section__inner}`}>
                        <div className={styles.hero__left}>
                            <h1 className={styles.hero__title}>Generate user&#8209;interfaces for your&nbsp;API</h1>
                            <p className={styles.hero__subtitle}>
                                Live in seconds, functional immediately, and{" "}
                                <span className={styles["hero__subtitle-highlight"]}>keeps your team moving fast</span>.
                            </p>
                            {/* <HeroInput /> */}
                            <a
                                href="https://docs.interwv.com/getting-started"
                                className={getButtonStyle()}
                            >
                                Get Started
                            </a>
                        </div>
                        <div className={styles.hero__right}>
                            <div className={styles["hero__right-content"]}>
                                <p className={styles["hero__interface-container-label"]}>Or check out these pre-made interfaces:</p>
                                <div className={styles["hero__interface-container"]}>
                                    <InterfaceCard
                                        title="Open Brewery DB"
                                        description="Browse thousands of breweries from the Open Brewery DB."
                                        privacy="Public"
                                        relativePathLink="/examples/breweries"
                                    />
                                    <InterfaceCard
                                        title="FBI Most Wanted"
                                        description="Interfacing with the FBI's Most Wanted API."
                                        privacy="Public"
                                        relativePathLink="/examples/fbi-most-wanted"
                                    />
                                    <InterfaceCard
                                        title="Trivia Questions"
                                        description="Collection of questions from the Open Trivia database."
                                        privacy="Public"
                                        relativePathLink="/examples/trivia"
                                    />
                                    <InterfaceCard
                                        title="Products"
                                        description="Products from a DummyJSON API."
                                        privacy="Public"
                                        relativePathLink="/examples/products"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.section__inner}>
                        <Image
                            src="/interface-oct-2023.jpg"
                            width={1600}
                            height={800}
                            quality={100}
                            priority={true}
                            className={styles.display__image}
                            alt="Screenshot of Interweave interface showing a table of values, actions, and details about data."
                        />
                        <p className={styles.display__caption}>Fully-functional interfaces generated in seconds! Create, Read, Update, Delete in seconds.</p>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.section__inner}>
                        <h2 className="visually-hidden">Features</h2>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <svg
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.feature__icon}
                                >
                                    <path
                                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3 className={styles.feature__title}>Privacy And Permissions</h3>
                                <p className={styles.feature__text}>No hassle to control who can do what.</p>
                            </div>
                            <div className={styles.feature}>
                                <svg
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.feature__icon}
                                >
                                    <path
                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3 className={styles.feature__title}>Share With Your Team Immediately</h3>
                                <p className={styles.feature__text}>One line of JSON to share with your teammates&mdash;or anyone!</p>
                            </div>
                            <div className={styles.feature}>
                                <svg
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.feature__icon}
                                >
                                    <path
                                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3 className={styles.feature__title}>Lives With Your Data</h3>
                                <p className={styles.feature__text}>Your configuration can live close to your database for quickly changing models.</p>
                            </div>
                            <div className={styles.feature}>
                                <svg
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.feature__icon}
                                >
                                    <path
                                        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3 className={styles.feature__title}>Automatic Interfaces</h3>
                                <p className={styles.feature__text}>No drag and drop, no code, nothing. We take care of it.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <div className={`${styles.section__inner} ${styles.step__inner}`}>
                        <h2 className="visually-hidden">Steps to build an interface with Interweave</h2>
                        <div>
                            <h3 className={styles.step__title}>
                                <span className={styles.step__number}>1.</span> Define Configuration
                            </h3>
                            <p className={styles.step__body}>
                                Write the configuration file in your codebase. Share with your team members and define their permissions, specify privacy
                                controls, add validation, and more. With help from our TypeScript interfaces.
                            </p>
                            <Link
                                href="https://docs.interwv.com/getting-started"
                                className={styles.step__link}
                            >
                                Read more about getting started
                            </Link>
                        </div>
                        <div>
                            <pre className={styles.step__code}>
                                {`{
    "key": "names-interface",
    "title": "Names",
    "fields": {
        "firstName": {
            "schema": {
                "type": "string"
            }
        }
    },
    "requests": {
        "create": {
            "uri": "https://example.com/names",
            "method": "POST"
        }
    }
}`}
                            </pre>
                        </div>
                    </div>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <div className={`${styles.section__inner} ${styles.step__inner}`}>
                        <div>
                            <h3 className={styles.step__title}>
                                <span className={styles.step__number}>2.</span> Send To Interweave
                            </h3>
                            <p className={styles.step__body}>
                                With Interweave living close to your database, tie it into your CI/CD workflow or build process. A single request to Interweave
                                is all that is needed to go live in seconds.
                            </p>
                            <Link
                                href="https://docs.interwv.com/getting-started"
                                className={styles.step__link}
                            >
                                Read more about how Interweave works
                            </Link>
                        </div>
                        <div>
                            <pre className={styles.step__code}>
                                {`// JS Library
import { buildInterface } from "@interweave/interweave";

buildInterface(INTERWEAVE_API, INTERWEAVE_CONFIG);

// Regular HTTP Request
const result = fetch(INTERWEAVE_API, INTERWEAVE_CONFIG);`}
                            </pre>
                        </div>
                    </div>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <div className={`${styles.section__inner} ${styles.step__inner}`}>
                        <div>
                            <h3 className={styles.step__title}>
                                <span className={styles.step__number}>3.</span> Keep Going
                            </h3>
                            <p className={styles.step__body}>Your fully-functional interface is ready to go. Share with your team and keep moving fast.</p>
                        </div>
                        <Image
                            src="/interface-oct-2023.jpg"
                            width={1600}
                            height={800}
                            quality={100}
                            priority={true}
                            className={styles.step__image}
                            alt="Screenshot of Interweave interface showing a table of values, actions, and details about data."
                        />
                    </div>
                </section>
                <section className={`${styles.section} ${styles["section--last"]} ${styles.join}`}>
                    <div className={styles.section__inner}>
                        <h2 className={styles.join__title}>Get Started For Free</h2>
                        <p>Let&apos;s get your team that interface&mdash;it&apos;ll only take a few minutes.</p>
                        <div className={styles["join__button-container"]}>
                            <Link
                                href="/login"
                                className={getButtonStyle()}
                            >
                                Sign up for free
                            </Link>
                            <a href="https://docs.interwv.com/support">Schedule A Free Call</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
