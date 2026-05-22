import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt
} from "react-icons/fa";
import aboutPortrait from "../assets/images/aboutportrait.jpeg";
import project1 from "../assets/images/FreeLancing1.jpeg";
import project2 from "../assets/images/FreeLancing2.jpeg";
import project3 from "../assets/images/FreeLancing3.jpeg";
import project4 from "../assets/images/FreeLancing4.jpeg";
import "./styles/freelancing.css";

const freelanceProjects = [
  {
    id: "Model Portfolio",
    title: "Model Portfolio",
    image: project1,
    stack: "React 19, Vite 5, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Lucide React",
    description:
      "A premium single-page portfolio with immersive dark UI, canvas star-map background, and scroll-driven 3D reveals for an unforgettable model showcase experience.",
    link: "https://model-portfolio-6yoh4451u-shahabaj-s-projects.vercel.app/",
    linkLabel: "View Live Project",
    status: "Live"
  },
  {
    id: "E-commerce",
    title: "Barkat Imperial Elegance",
    image: project2,
    stack: "Django, PostgreSQL, Bootstrap, JavaScript, Cloudinary, WhiteNoise",
    description:
      "A full-stack e-commerce platform for traditional sarees with product browsing, cart, wishlist, reviews, and session-based authentication.",
    link: "https://barkat-imperial-elegance-e81s.onrender.com",
    linkLabel: "View Live Project",
    status: "Live"
  },
  {
    id: "portfolio",
    title: "Personal Developer Portfolio",
    image: project3,
    stack: "React 18, Vite 5, Three.js, GSAP + ScrollTrigger, React Three Fiber, Formspree",
    description:
      "A responsive multi-page portfolio with 3D tilt interactions, GSAP scroll animations, and integrated contact workflows for a polished, accessible showcase.",
    link: "https://my-portfolio-drab-chi-74.vercel.app/",
    linkLabel: "View Live Project",
    status: "Live"
  },
  {
    id: "attendance",
    title: "Attendance Management System",
    image: project4,
    stack: "Django, DRF, SQLite, OpenCV, NumPy, SciPy, Bootstrap, JavaScript",
    description:
      "A Django web app for digitizing classroom attendance with face verification, role-based access, and anti-proxy controls for secure live authentication.",
    link: "https://attendance-marker-f8ra.onrender.com",
    linkLabel: "View Live Project",
    status: "Live"
  }
];

const profileInfo = [
  { label: "Name", value: "Shahabaj Mulani" },
  { label: "Role", value: "Full Stack Web Developer" },
  { label: "Location", value: "Pune, India" },
  { label: "Availability", value: "Open for Freelance Work" }
];

export default function FreelancingApp() {
  const handleCardMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 10;
    const rotateY = (x - 0.5) * 10;

    card.classList.add("is-active");
    card.style.setProperty("--fx", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--fy", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glx", `${(x * 100).toFixed(2)}%`);
    card.style.setProperty("--gly", `${(y * 100).toFixed(2)}%`);
  };

  const resetCardMove = (event) => {
    const card = event.currentTarget;
    card.classList.remove("is-active");
    card.style.setProperty("--fx", "0deg");
    card.style.setProperty("--fy", "0deg");
    card.style.setProperty("--glx", "50%");
    card.style.setProperty("--gly", "50%");
  };

  return (
    <div className="freelancing-page">
      <div className="freelancing-orb freelancing-orb-left" aria-hidden />
      <div className="freelancing-orb freelancing-orb-right" aria-hidden />

      <header className="freelancing-topbar">
        <a className="top-link top-link-home" href="./index.html">
          <FaArrowLeft /> Main Portfolio
        </a>
        <a className="top-link top-link-hire" href="mailto:mulanishabaj99@gmail.com">
          <FaEnvelope /> Hire Me
        </a>
      </header>

      <main className="freelancing-shell">
        <section className="freelancing-hero">
          <div className="hero-copy">
            <p className="eyebrow">Freelancing Portfolio</p>
            <h1>3D-ready web experiences that are fast, polished, and production-focused.</h1>
            <p>
              I help teams and founders ship responsive interfaces, engaging user interactions, and
              maintainable code. This page highlights selected projects and my freelance profile.
            </p>

            <div className="hero-tags">
              <span>
                <FaClock /> Quick Turnaround
              </span>
              <span>
                <FaMapMarkerAlt /> Pune, India
              </span>
              <span>
                <FaLinkedin /> Client Communication Ready
              </span>
            </div>
          </div>

          <article className="profile-card-3d">
            <img src={aboutPortrait} alt="Shahabaj Mulani profile" loading="lazy" />
            <div className="profile-overlay">
              {profileInfo.map((item) => (
                <p key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className="freelancing-projects">
          <div className="section-head">
            <p className="eyebrow">Selected Work</p>
            <h2>Live Projects and Portfolio Deliverables</h2>
            <p>
              Hover cards for depth, open links for demos, and review the exact stack used in each
              delivery.
            </p>
          </div>

          <div className="freelancing-grid">
            {freelanceProjects.map((project) => (
              <article
                key={project.id}
                className="freelancing-project-card"
                onMouseMove={handleCardMove}
                onMouseLeave={resetCardMove}
              >
                <div className="freelancing-project-inner">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="project-content">
                    <span className={`project-status ${project.status === "Live" ? "live" : "repo"}`}>
                      {project.status}
                    </span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <small className="project-stack">{project.stack}</small>
                    <a
                      className={project.status === "Live" ? "project-link link-live" : "project-link link-source"}
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.linkLabel} <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="freelancing-contact">
          <h2>Want a similar project delivered?</h2>
          <p>Share your idea and I can help with design, frontend, API integration, and deployment.</p>
          <div className="contact-actions">
            <a className="action-live" href="mailto:mulanishabaj99@gmail.com">
              <FaEnvelope /> Email Me
            </a>
            <a className="action-source" href="https://github.com/shabaj003" target="_blank" rel="noreferrer">
              <FaGithub /> GitHub
            </a>
            <a
              className="action-live"
              href="https://www.linkedin.com/in/shahabaj-mulani-5965292b8/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a className="action-home" href="./index.html">
              <FaArrowRight /> Back to Main Portfolio
            </a>
          </div>
        </section>
      </main>

      <footer className="freelancing-footer">
        <p>(c) {new Date().getFullYear()} Shahabaj Mulani | Freelancing Showcase</p>
      </footer>
    </div>
  );
}
