import Link from "next/link";
import styles from "./home.module.css";

import { Header, InterfaceCard, Footer } from "@/components";
import { getButtonStyle } from "@/components/Button";
import { serverRequest } from "@/lib/api/serverRequest";
import { Suspense } from "react";
import { authenticate } from "@/lib/auth";

import { parseRequest } from "@/lib/parsers";

export default async function Home() {
	const { user } = await authenticate({ optional: true });
	const { data, error } = await getProjects();

	return (
		<>
			<Header user={user} />
			<section className={styles.section}>
				<h1>Welcome</h1>
				<div className={styles["main-links"]}>
					<Link href="/create" className={getButtonStyle()}>
						Create New Project
					</Link>
				</div>
			</section>
			<main className={styles["main-container"]}>
				<Suspense>
					<>
						{error ? null : (
							<>
								<section>
									{data.projects.length === 0 ? null : (
										<div
											className={
												styles[
													"section-title-container"
												]
											}
										>
											<h2
												className={
													styles["section-title"]
												}
											>
												Projects
											</h2>
											<Link
												className={
													styles[
														"section-title__link"
													]
												}
												href="#"
											>
												view all
											</Link>
										</div>
									)}
									<div
										className={
											styles["interface-container"]
										}
									>
										{data.projects.map((p: any) => (
											<Link
												key={p.id}
												href={`/${p.slug}`}
											>
												<InterfaceCard
													title={p.slug}
													__cssFor={{
														root: styles[
															"interface-card"
														],
													}}
												/>
											</Link>
										))}
									</div>
								</section>
								{data.interfaces.length > 0 ? (
									<section>
										<div
											className={
												styles[
													"section-title-container"
												]
											}
										>
											<h2
												className={
													styles["section-title"]
												}
											>
												Interfaces
											</h2>
											<Link
												className={
													styles[
														"section-title__link"
													]
												}
												href="#"
											>
												view all
											</Link>
										</div>
										<div
											className={
												styles["interface-container"]
											}
										>
											{data.interfaces.map(
												(access: any) => (
													<Link
														key={access.id}
														href={`/${access.interface.project.slug}/${access.interface.slug}`}
													>
														<InterfaceCard
															description={
																access.interface
																	.description
															}
															hash={
																access.interface
																	.hash
															}
															lastBuild={
																access.interface
																	.build_time
															}
															privacy={
																access.interface
																	.privacy
															}
															titleParts={{
																one: access
																	.interface
																	.project
																	.slug,
																two: access
																	.interface
																	.slug,
															}}
															__cssFor={{
																root: styles[
																	"interface-card"
																],
															}}
														/>
													</Link>
												)
											)}
										</div>
									</section>
								) : null}
							</>
						)}
					</>
				</Suspense>
			</main>
			<Footer />
		</>
	);
}

async function getProjects() {
	return await serverRequest("/api/v1/interfaces");
}
