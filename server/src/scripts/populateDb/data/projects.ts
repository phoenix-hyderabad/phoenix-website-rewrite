import { type projects } from "@/lib/db/schema/projects";

const projectData: (typeof projects.$inferInsert)[] = [
    {
        key: "gym",
        name: "Bi-Directional Gym Visitor Tracker",
        cover: "https://phoenix-bphc.vercel.app/linefol/3.jpeg",
        problemStatement:
            "An IoT Bidirectional Counter for a gym is a system designed to monitor and count the number of people entering and exiting the gym facility. The system uses ESP32 microcontrollers and is simulated on Wokwi. It relies on sensors to detect movement in both directions, ensuring accurate occupancy tracking. The challenge involves both hardware and software aspects, requiring sensor integration, efficient counting logic, and real-time data processing. ",
        current: true,
    },
    {
        key: "micromouse",
        name: "Micromouse",
        cover: "https://phoenix-bphc.vercel.app/linefol/1.jpeg",
        problemStatement:
            "The Micromouse project involves designing and building a small autonomous robot (micromouse) capable of navigating a maze from a starting point to the center. The challenge is to develop both the hardware and software required for the robot to efficiently navigate through the maze, detecting walls, making decisions at intersections, and ultimately finding the optimal path to the finish.",
        current: true,
    },
    {
        key: "sumo",
        name: "Robo Sumo Bot",
        cover: "https://phoenix-bphc.vercel.app/linefol/4.jpeg",
        problemStatement:
            "Developing bots for thrilling competitions like Robo Sumo and Robo Soccer, where robots either autonomously or manually engage in intense battles or soccer matches. The goal is to push opponents out or score goals by maneuvering a ball into the opponent's goal.",
        current: true,
    },
    {
        key: "line",
        name: "Line Follower Bot",
        cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Micromouse_Green_Giant_V1.3.jpg/220px-Micromouse_Green_Giant_V1.3.jpg",
        problemStatement:
            "Line follower robots are autonomous machines designed to follow a pre-defined path, typically marked by a line on the ground. Using sensors, such as infrared or optical sensors, these robots detect the contrast between the line and the surface to navigate the path. Our prototype bot won first place in its first competition.",
        current: false,
    },
    {
        key: "thriveforce",
        name: "Thriveforce - Robowars Bot",
        cover: "https://phoenix-bphc.vercel.app/linefol/thriveforceimg.jpg",
        problemStatement:
            "Thriveforce is our combat robotics team which has won multiple prizes in colleges like IIT Bombday, BITS Pilani, etc. Robowars is an event of destruction and madness where robots battle it out to claim victory over their opponents.",
        current: false,
    },
];

export default projectData;
