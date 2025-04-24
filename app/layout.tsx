import "./globals.css"
import { Providers } from "./providers"
import Footer from "@/components/footer"
import LightRay from "@/components/light-ray"
import Navbar from "@/components/navbar"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Provider } from "react-wrap-balancer"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Gauvain Palanga",
    description:
        "I am Gauvain Palanga, a passionate computer science student, who wants to share his love for software development.",
    openGraph: {
        title: "Gauvain Palanga",
        description:
            "I am Gauvain Palanga, a passionate computer science student, who wants to share his love for software development.",
        url: "https://gxuvain.dev",
        siteName: "Gauvain Palanga",
        images: [
            {
                url: "https://gxuvain.dev/api/og?title=gxuvain.dev",
                alt: "gxuvain.dev",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@gxuvain",
        creator: "@gxuvain",
    },
    metadataBase: new URL("https://gxuvain.dev"),
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Provider>
                    <Providers>
                        <div className="container mx-auto max-w-3xl font-[family-name:var(--font-geist-mono)] px-6">
                            <LightRay />
                            <Navbar />
                            {children}
                            <Footer />
                        </div>
                    </Providers>
                </Provider>
                <Analytics />
            </body>
        </html>
    )
}
