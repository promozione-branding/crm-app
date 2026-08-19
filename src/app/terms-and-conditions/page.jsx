import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Terms & Conditions | Inquiry Bazaar",
    description:
        "Terms and Conditions governing the use of Inquiry Bazaar CRM and related services.",
};

export default function TermsAndConditionsPage() {
    return (<>
        <nav className="flex items-center justify-between md:px-8 px-2 py-2 bg-white shadow-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <Image
                    src="/logoo.webp"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                />
            </div>

            <button className="rounded-xl bg-orange-500 px-6 py-3 flex items-center gap-1 font-semibold text-white transition hover:bg-orange-600">
                Book a Demo <ArrowRight size={18} />
            </button>
        </nav>

        <main className="min-h-screen bg-white text-gray-800">
            <div className="mx-auto max-w-5xl px-6 py-12">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Terms and Conditions
                </h1>

                <p className="mb-8 text-gray-600">
                    Last updated: August 2026
                </p>

                <section className="space-y-8">
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            1. Acceptance of Terms
                        </h2>

                        <p className="leading-7">
                            These Terms and Conditions govern your use of
                            Inquiry Bazaar and its CRM platform.
                        </p>

                        <p className="mt-3 leading-7">
                            Throughout these Terms, <strong>&quot;we&quot;</strong>,
                            <strong> &quot;us&quot;</strong>, and
                            <strong> &quot;our&quot;</strong> refer to
                            Inquiry Bazaar and the entity operating the service.
                            The terms <strong>&quot;you&quot;</strong> and
                            <strong> &quot;your&quot;</strong> refer to the
                            individual or business using our services.
                        </p>

                        <p className="mt-3 leading-7">
                            By accessing or using our services, you agree to
                            these Terms and Conditions.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            2. Our Services
                        </h2>

                        <p className="leading-7">
                            We provide CRM and business management functionality
                            that may include lead management, task management,
                            reporting, call logs, advertising integrations,
                            analytics, and other related features.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            3. User Accounts
                        </h2>

                        <p className="leading-7">
                            You are responsible for maintaining the
                            confidentiality of your account credentials and for
                            all activities performed through your account.
                        </p>

                        <p className="mt-3 leading-7">
                            You agree to provide accurate and current
                            information when creating or maintaining your
                            account.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            4. Meta / Facebook Integration
                        </h2>

                        <p className="leading-7">
                            Our CRM may allow you to connect Facebook Pages,
                            Meta advertising accounts, and Facebook Lead Ads.
                        </p>

                        <p className="mt-3 leading-7">
                            By connecting your Meta account, you authorize us
                            to access the Meta data and assets necessary to
                            provide the requested CRM functionality.
                        </p>

                        <p className="mt-3 leading-7">
                            You must have the appropriate authorization to
                            connect and manage the Meta accounts, Pages, and
                            advertising assets that you connect to our
                            platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            5. Google Integration
                        </h2>

                        <p className="leading-7">
                            Our CRM may allow you to connect Google services,
                            including Google Ads and related Google APIs.
                        </p>

                        <p className="mt-3 leading-7">
                            By connecting your Google account, you authorize us
                            to access the Google data necessary to provide the
                            requested functionality.
                        </p>

                        <p className="mt-3 leading-7">
                            You must have appropriate authorization to connect
                            and manage the Google Ads accounts and other Google
                            assets connected to our platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            6. Lead Data
                        </h2>

                        <p className="leading-7">
                            Our CRM may receive leads from advertising
                            platforms such as Meta Lead Ads and other supported
                            advertising integrations.
                        </p>

                        <p className="mt-3 leading-7">
                            You are responsible for ensuring that your
                            collection, storage, communication, and use of
                            lead information complies with applicable laws,
                            regulations, and platform policies.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            7. Third-Party Platforms
                        </h2>

                        <p className="leading-7">
                            Our services may depend on third-party platforms,
                            including Meta and Google.
                        </p>

                        <p className="mt-3 leading-7">
                            We are not responsible for changes, interruptions,
                            restrictions, suspensions, API limitations, or
                            policy changes made by third-party platforms.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            8. Acceptable Use
                        </h2>

                        <p className="mb-3 leading-7">
                            You agree not to:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Use our services for unlawful activities</li>
                            <li>Attempt to gain unauthorized access</li>
                            <li>Abuse or disrupt our systems</li>
                            <li>Upload malicious software</li>
                            <li>Misuse personal or lead information</li>
                            <li>Violate Meta, Google, or other third-party policies</li>
                            <li>Use our services to commit fraud or abuse</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            9. Intellectual Property
                        </h2>

                        <p className="leading-7">
                            Our software, platform, design, branding, content,
                            and related materials are owned by us or our
                            licensors and are protected by applicable
                            intellectual property laws.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            10. Service Availability
                        </h2>

                        <p className="leading-7">
                            We aim to keep our services available and reliable,
                            but we do not guarantee uninterrupted or
                            error-free operation.
                        </p>

                        <p className="mt-3 leading-7">
                            Services may occasionally be unavailable due to
                            maintenance, technical problems, third-party
                            outages, API changes, or circumstances beyond our
                            reasonable control.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            11. Account Suspension or Termination
                        </h2>

                        <p className="leading-7">
                            We may suspend or terminate an account if we
                            reasonably believe that the user has violated
                            these Terms, applicable law, or third-party
                            platform policies.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            12. Limitation of Liability
                        </h2>

                        <p className="leading-7">
                            To the maximum extent permitted by applicable law,
                            we will not be responsible for indirect,
                            incidental, special, or consequential losses
                            resulting from the use or inability to use our
                            services.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            13. Changes to These Terms
                        </h2>

                        <p className="leading-7">
                            We may update these Terms from time to time.
                            Continued use of our services after changes are
                            published means that you accept the updated Terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            14. Contact Us
                        </h2>

                        <p className="leading-7">
                            If you have any questions about these Terms and
                            Conditions, please contact us.
                        </p>

                        <p className="mt-3 leading-7">
                            <strong>Email:</strong> support@inquirybazaar.com
                        </p>
                    </div>
                </section>
            </div>
        </main>

        <footer>
            <div className="border-b bg-gray-100 py-3">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4 text-sm text-gray-600">
                    <span>
                        © {new Date().getFullYear()} All Rights Reserved.
                    </span>

                    <span>•</span>

                    <a
                        href="https://inquirybazaar.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 hover:underline"
                    >
                        Inquiry Bazaar Pvt. Ltd
                    </a>
                </div>
            </div>
        </footer>
    </>);
}