import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Privacy Policy | Inquiry Bazaar CRM",
    description:
        "Privacy Policy for Inquiry Bazaar CRM and its advertising and lead management services.",
};

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
                </h1>

                <p className="mb-8 text-gray-600">
                    Last updated: August 2026
                </p>

                <section className="space-y-8">
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            1. Introduction
                        </h2>

                        <p className="leading-7">
                            Welcome to Inquiry Bazaar. This Privacy Policy
                            explains how <strong>we</strong>, <strong>us</strong>,
                            and <strong>our</strong> company collect, use,
                            store, and protect information when you use our
                            CRM platform, website, integrations, and related
                            services.
                        </p>

                        <p className="mt-3 leading-7">
                            By using our services, you agree to the practices
                            described in this Privacy Policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            2. Information We Collect
                        </h2>

                        <p className="mb-3 leading-7">
                            We may collect the following information:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Name and contact information</li>
                            <li>Email address and phone number</li>
                            <li>Company and business information</li>
                            <li>CRM account and login information</li>
                            <li>Lead and customer information entered into the CRM</li>
                            <li>Advertising and campaign information</li>
                            <li>Technical and device information</li>
                            <li>Usage and activity information</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            3. Meta / Facebook Integration
                        </h2>

                        <p className="leading-7">
                            Our CRM may integrate with Meta services, including
                            Facebook Pages, Facebook Lead Ads, Meta Ads, and
                            related Meta APIs.
                        </p>

                        <p className="mt-3 leading-7">
                            When you choose to connect your Meta account to our
                            CRM, <strong>we</strong> may receive information
                            that you authorize Meta to provide to us, such as
                            Facebook Page information, advertising account
                            information, and leads submitted through Facebook
                            Lead Ads.
                        </p>

                        <p className="mt-3 leading-7">
                            We use this information to provide CRM functionality,
                            including importing leads, displaying advertising
                            information, managing leads, and providing reporting
                            features.
                        </p>

                        <p className="mt-3 leading-7">
                            We do not use Meta data for purposes unrelated to
                            providing the services requested by our customers.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            4. Google Integration
                        </h2>

                        <p className="leading-7">
                            Our CRM may integrate with Google services,
                            including Google Ads and related Google APIs.
                        </p>

                        <p className="mt-3 leading-7">
                            When you connect your Google account, <strong>we</strong>
                            may receive information that you authorize Google
                            to provide to us.
                        </p>

                        <p className="mt-3 leading-7">
                            Depending on the integration you use, this may
                            include Google Ads account information, campaigns,
                            ad groups, advertisements, performance metrics,
                            clicks, impressions, conversions, costs, and other
                            advertising-related information.
                        </p>

                        <p className="mt-3 leading-7">
                            We use Google data only to provide the CRM features
                            requested by you, including advertising reporting,
                            campaign analysis, lead tracking, and related
                            business functionality.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            5. How We Use Information
                        </h2>

                        <p className="mb-3 leading-7">
                            We may use collected information to:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Provide and operate our CRM services</li>
                            <li>Manage user accounts</li>
                            <li>Import and manage leads</li>
                            <li>Display Meta and Google advertising information</li>
                            <li>Provide campaign and performance reports</li>
                            <li>Improve our products and services</li>
                            <li>Provide customer support</li>
                            <li>Detect fraud, abuse, and security issues</li>
                            <li>Comply with applicable legal requirements</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            6. Data Storage and Security
                        </h2>

                        <p className="leading-7">
                            We take reasonable technical and organizational
                            measures to protect information against
                            unauthorized access, alteration, disclosure, or
                            destruction.
                        </p>

                        <p className="mt-3 leading-7">
                            However, no internet-based service can guarantee
                            complete security.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            7. Third-Party Services
                        </h2>

                        <p className="leading-7">
                            Our services may use third-party providers,
                            including Meta and Google, to provide integrations
                            and functionality.
                        </p>

                        <p className="mt-3 leading-7">
                            These third-party services may process information
                            according to their own privacy policies and terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            8. Data Retention
                        </h2>

                        <p className="leading-7">
                            We retain information only for as long as reasonably
                            necessary to provide our services, maintain
                            business records, resolve disputes, comply with
                            legal obligations, and enforce our agreements.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            9. Your Rights
                        </h2>

                        <p className="leading-7">
                            Depending on applicable law, you may have rights to
                            access, correct, delete, or restrict the processing
                            of your personal information.
                        </p>

                        <p className="mt-3 leading-7">
                            You may also disconnect your Meta or Google account
                            from our CRM at any time through the available
                            integration settings or by contacting us.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            10. Children&apos;s Privacy
                        </h2>

                        <p className="leading-7">
                            Our services are not intended for children under
                            the applicable legal age. We do not knowingly
                            collect personal information from children for the
                            purpose of providing our business services.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            11. Changes to This Privacy Policy
                        </h2>

                        <p className="leading-7">
                            We may update this Privacy Policy from time to time.
                            When we make changes, we will update the
                            &quot;Last updated&quot; date on this page.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">
                            12. Contact Us
                        </h2>

                        <p className="leading-7">
                            If you have questions about this Privacy Policy or
                            how we handle your information, please contact us.
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