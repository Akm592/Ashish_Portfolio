import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  chatterBox ,
  tripguide,
  threejs,
  rgipt
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Ui/Ux Designer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Btech Student",
    company_name: "Rajiv Gandhi Institute of Petroleum Technology",
    icon: rgipt,
    iconBg: "#383E56",
    date: "2021 -  2025",
    points: [
      "Branch: Information technology",
      
    ],
  },
 

];

const testimonials = [
 ///
];

const projects = [
  {
    name: "2-D Platformer game",
    description:
      "A visually appealing 2D platformer game made with Kaboom.js, ESBuild, and JavaScript. Avoid obstacles, collect bonuses, and complete levels.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "Kaboom.js",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/Akm592/2dgame",
  },
  {
    name: "Chatter Box",
    description:
      "Chatter Box is a chat application built with socket.io, React, and MongoDB. Connect with others, send/receive messages in real-time, and store conversations.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "Socket.io",
        color: "green-text-gradient",
      },
      {
        name: "MongoDB",
        color: "pink-text-gradient",
      },
    ],
    image: chatterBox,
    source_code_link: "https://github.com/Akm592/Chatter-Box",
  },
  {
    name: "Personal Portfolio",
    description:
      "The personal 3D portfolio website, created with React, Three.js, and Tailwind CSS, showcases stunning 3D models and artwork with a sleek and responsive design.",
    tags: [
      {
        name: "Reactjs",
        color: "blue-text-gradient",
      },
      {
        name: "THREE JS",
        color: "green-text-gradient",
      },
      {
        name: "Tailwind CSS",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/Akm592/Ashish_Portfolio",
  },
];

export { services, technologies, experiences, testimonials, projects };
