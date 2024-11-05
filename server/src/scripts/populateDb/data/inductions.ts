import { type inductions } from "@/lib/db/schema/inductions";

const inductionData: (typeof inductions.$inferInsert)[] = [
    {
        name: "Design Team",
        url: "https://youtu.be/xvFZjo5PgG0",
        isOpen: true,
    },
    {
        name: "Editorial Team",
        url: "https://youtu.be/xvFZjo5PgG0",
        isOpen: false,
    },
    {
        name: "IT Team",
        url: "https://youtu.be/xvFZjo5PgG0",
        isOpen: true,
    },
    {
        name: "Tech Team",
        url: "/projects",
        isOpen: false,
    },
];

export default inductionData;
