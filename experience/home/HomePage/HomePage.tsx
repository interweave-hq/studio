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
                    <div className={styles.hero__left}>
                        <h1 className={styles.hero__title}>Generate user&#8209;interfaces for your&nbsp;API</h1>
                        <p className={styles.hero__subtitle}>
                            Live in seconds, functional immediately, and <span className={styles["hero__subtitle-highlight"]}>keeps your team moving fast</span>
                            .
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
                </section>
                <section className={styles.section}>
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
                </section>
                <section className={styles.section}>
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
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <h2 className="visually-hidden">Steps to build an interface with Interweave</h2>
                    <div>
                        <h3 className={styles.step__title}>
                            <span className={styles.step__number}>1.</span> Define Configuration
                        </h3>
                        <p className={styles.step__body}>
                            Write the configuration file in your codebase. Share with your team members and define their permissions, specify privacy controls,
                            add validation, and more. With help from our TypeScript interfaces.
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
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <div>
                        <h3 className={styles.step__title}>
                            <span className={styles.step__number}>2.</span> Send To Interweave
                        </h3>
                        <p className={styles.step__body}>
                            With Interweave living close to your database, tie it into your CI/CD workflow or build process. A single request to Interweave is
                            all that is needed to go live in seconds.
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
                </section>
                <section className={`${styles.step} ${styles.section}`}>
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
                </section>
                <section className={`${styles.join} ${styles.section} ${styles["section--last"]}`}>
                    <div className={styles.join__inner}>
                        <h2 className={styles.join__title}>Get Involved</h2>
                        <p>This is a work in progress and we&apos;re still shaping what we&apos;re building. We&apos;d love your help!</p>
                        <a
                            className={styles["discord-button"]}
                            href="https://interwv.com/chat"
                        >
                            <svg
                                className={styles["discord-button__icon"]}
                                viewBox="0 -28.5 256 256"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid"
                            >
                                <g>
                                    <path
                                        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                        fill="#ffffff"
                                        fillRule="nonzero"
                                    />
                                </g>
                            </svg>
                            <span>Join The Discord</span>
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
