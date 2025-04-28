"use client"

import { ExternalLink, Download, FileText, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"

const ImageModal: FC<{
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt: string
}> = ({ isOpen, onClose, imageSrc, imageAlt }) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full max-h-[90vh] rounded-lg overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Fermer"
                >
                    <X size={24} />
                </button>
                <div className="relative w-full h-full aspect-video">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="object-contain"
                        quality={100}
                    />
                </div>
            </div>
        </div>
    )
}

const projects = [
    {
        id: "ap3",
        title: "Bookmarks",
        description:
            "Bookmarks est une application permettant aux utilisateurs de créer et partager des pages personnalisées pour organiser leurs découvertes, conseils et inspirations sous forme de signets (Marks). Cette plateforme vise à transformer les signets classiques en un espace interactif et créatif.",
        technologies: [
            "PHP",
            "Framework MVC",
            "MariaDB",
            "TailwindCSS",
            "JavaScript",
            "Twig",
        ],
        features: [
            "Création de signets",
            "Recherche de signets",
            "Gestion de son profil",
            "Gestion des collections",
            "Gestion des tags",
            "Gestion des likes",
        ],
        screenshots: [
            "home1.png",
            "home2.png",
            "pricing.png",
            "profile.png",
            "dashboard.png",
        ],
        documents: [
            {
                title: "Cahier des charges",
                description:
                    "Document détaillant les spécifications et objectifs du projet.",
                filename: "cahier_des_charges_ap3.pdf",
            },
            {
                title: "Documentation technique",
                description:
                    "Documentation technique détaillant l'architecture et les choix d'implémentation.",
                filename: "documentation_technique_ap3.pdf",
            },
            {
                title: "Manuel utilisateur",
                description: "Manuel d'utilisation de l'application.",
                filename: "manuel_utilisateur_ap3.pdf",
            },
        ],
    },
    {
        id: "ap4",
        title: "LinkUp",
        description:
            "LinkUp est une application de messagerie instantanée de type Discord qui permet aux utilisateurs de communiquer en temps réel via une interface de bureau. ",
        technologies: ["Java", "Spring Boot", "MariaDB", "JavaFX", "CSS"],
        features: [
            "Chat en temps réel",
            "Canaux de discussion",
            "AJout d'amis",
            "Gestion de son status",
            "Gestion de son profil",
        ],
        screenshots: [
            "linkup_auth.png",
            "linkup_home.png",
            "linkup_friend_add.png",
            "linkup_friend_accept.png",
            "linkup_chat.png",
            "linkup_chat_pinned.png",
            "linkup_status.png",
            "linkup_settings.png",
        ],
        documents: [
            {
                title: "Cahier des charges",
                description:
                    "Document détaillant les spécifications et objectifs du projet.",
                filename: "cahier_des_charges_ap4.pdf",
            },
            {
                title: "Documentation technique",
                description:
                    "Documentation technique détaillant l'architecture et les choix d'implémentation.",
                filename: "documentation_technique_ap4.pdf",
            },
            {
                title: "Manuel utilisateur",
                description: "Manuel d'utilisation de l'application.",
                filename: "manuel_utilisateur_ap4.pdf",
            },
        ],
    },
]

const BTSPage: FC = () => {
    const [modalImage, setModalImage] = useState<{
        isOpen: boolean
        src: string
        alt: string
    }>({
        isOpen: false,
        src: "",
        alt: "",
    })

    const openModal = (src: string, alt: string) => {
        setModalImage({
            isOpen: true,
            src,
            alt,
        })
    }

    const closeModal = () => {
        setModalImage({
            isOpen: false,
            src: "",
            alt: "",
        })
    }

    return (
        <div className="my-12 space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-4">Épreuves BTS SIO</h1>
                <p className="text-lg mb-6">
                    Cette page présente les informations relatives à mes projets
                    pour les épreuves du BTS SIO.
                </p>
            </div>
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">
                    Récapitulatif des projets
                </h2>
                <div className="space-y-12">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="space-y-6 bg-muted/50 p-6 rounded-lg"
                        >
                            <h3 className="text-2xl font-semibold border-b pb-2">
                                {project.title}
                            </h3>
                            <p>{project.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-semibold">
                                        Technologies utilisées
                                    </h4>
                                    <ul className="list-disc list-inside mt-2">
                                        {project.technologies.map(
                                            (tech, idx) => (
                                                <li key={idx}>{tech}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        Fonctionnalités principales
                                    </h4>
                                    <ul className="list-disc list-inside mt-2">
                                        {project.features.map(
                                            (feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold mb-3">
                                    Documents du projet
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.documents.map((doc, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col items-start space-y-3 p-4 border border-muted rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <FileText className="mr-2 size-5" />
                                                <h3 className="font-semibold">
                                                    {doc.title}
                                                </h3>
                                            </div>
                                            <p className="text-sm">
                                                {doc.description}
                                            </p>
                                            <div className="flex space-x-3 mt-2">
                                                <Link
                                                    href={`/documents/${doc.filename}`}
                                                    target="_blank"
                                                    className="flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <ExternalLink className="mr-1 size-4" />
                                                    Prévisualiser
                                                </Link>
                                                <Link
                                                    href={`/documents/${doc.filename}`}
                                                    download
                                                    className="flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <Download className="mr-1 size-4" />
                                                    Télécharger
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold mb-3">
                                    Captures d&apos;écran
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {project.screenshots.map(
                                        (screenshot, idx) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-video rounded-lg overflow-hidden border border-muted cursor-pointer transition-transform hover:scale-[1.02]"
                                                onClick={() =>
                                                    openModal(
                                                        `/assets/screenshots/${screenshot}`,
                                                        `Capture d'écran ${
                                                            idx + 1
                                                        } de ${project.title}`
                                                    )
                                                }
                                            >
                                                <Image
                                                    src={`/assets/screenshots/${screenshot}`}
                                                    alt={`Capture d'écran ${
                                                        idx + 1
                                                    } de ${project.title}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                                                        Agrandir
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal pour afficher les images en grand */}
            <ImageModal
                isOpen={modalImage.isOpen}
                onClose={closeModal}
                imageSrc={modalImage.src}
                imageAlt={modalImage.alt}
            />
        </div>
    )
}

export default BTSPage
