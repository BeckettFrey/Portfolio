
import { AboutConfig } from "./AboutContent/types";

export const aboutConfig: AboutConfig = {
    greeting: "Hey there! 👋",
    name: "Beckett Frey",
    introduction:
        "I'm Beckett — a developer who builds things end-to-end. This site is my home base for sharing what I’ve built, how I think, and where things might go next.\n\nIt starts as a portfolio, but it’s open-ended. Whether I’m shipping code, solving weird bugs, or sketching out new ideas, this is where it all lands.\n\nPress the red home button in the upper left to explore projects, view my résumé, get in touch, or just poke around.",
    education: {
        title: "BS Graduate",
        subtitle: "UW-Milwaukee",
    },
    role: {
        title: "Aspiring Developer",
        subtitle: "Full Stack",
    },
    location: {
        city: "Madison",
        state: "Wisconsin",
        country: "USA",
    },
    technicalInterests: [
        {
            icon: "FaCode",
            text: "Web & App Development",
            color: "blue",
        },
        {
            icon: "FaBrain",
            text: "AI & Neural Networks",
            color: "purple",
        },
        {
            icon: "FaAtom",
            text: "Quantum Computing",
            color: "green",
        },
    ],
    personalInterests: [
            {
                icon: "FaUtensils",
                text: "Cooking & Culinary Arts",
                color: "orange",
            },
            {
                icon: "FaDumbbell",
                text: "Fitness & Active Lifestyle",
                color: "red",
            },
            {
                icon: "FaChessKing",
                text: "Chess & Strategy Games",
                color: "blue",
            }
        ],
    callToAction: {
        title: "Open to What Comes Next",
        description:
            "I'm open to freelance work, creative partnerships, or anything that feels like a good fit. If you’re exploring an idea, building something, or just want to talk shop — feel free to reach out.",
    },
} as const;