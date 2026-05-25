import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaArrowRight,
  FaBars,
  FaBriefcase,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaTimes,
  FaWhatsapp
} from "react-icons/fa";
import DeveloperBackground3DShader from "./DeveloperBackground3DShader";
import "./styles/background3d.css";
import "./styles/portfolio.css";

import aboutPortrait from "../assets/images/aboutportrait.jpeg";
import aboutHover from "../assets/images/abouthover.jpeg";

import project1 from "../assets/images/project1.jpg";
import project2 from "../assets/images/movie.jpeg";
import project3 from "../assets/images/Algorithm.jpeg";
import project4 from "../assets/images/project4.jpg";
import project5 from "../assets/images/project2.jpg";
import project6 from "../assets/images/Project3.webp";
import project7 from "../assets/images/FreeLancing4.jpeg";

import resumeFile from "../assets/documents/My_Resume.pdf";
import paperFile from "../assets/documents/IJIRT180698_PAPER.pdf";

const skillsPrimary = [
  { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  {
    name: "Bootstrap",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
  },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
];

const skillsSecondary = [
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  {
    name: "Spring Boot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
  },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" }
];

const education = [
  {
    title: "Bachelor of Computer Engineering",
    institute: "Savitribai Phule Pune University",
    result: "CGPA: 7.41"
  },
  {
    title: "Higher Secondary Education (XII)",
    institute: "Shri Nilkanteshwar Vidyalay, Lasurne",
    result: "Percentage: 84.3%"
  },
  {
    title: "Secondary School Certificate (X)",
    institute: "Shri Nilkanteshwar Vidyalay, Lasurne",
    result: "Percentage: 79.8%"
  }
];

const projects = [
  {
      id: "attendance",
      title: "Attendance Management System",
      image: project7,
      stack: "Django, DRF, SQLite, OpenCV, NumPy, SciPy, Bootstrap, JavaScript",
      description:
        "A Django web app for digitizing classroom attendance with face verification, role-based access, and anti-proxy controls for secure live authentication.",
      link: "https://attendance-marker-f8ra.onrender.com",
      linkLabel: "See Live",
      status: "Live"
    },
  {
    id: "weather",
    title: "Weather App Development",
    stack: "HTML, CSS, JavaScript",
    image: project1,
    link: "https://forecast-weather-app-obfo.onrender.com",
    linkLabel: "See Live",
    description:
      "At Surecast, planning your day should never feel like a gamble with weather. It delivers accurate real-time forecasts for informed daily decisions."
  },
  {
    id: "movie",
    title: "Movie Recommendation",
    stack: "Python, Flask, HTML, CSS, SQLite",
    image: project2,
    link: "https://movie-recommendation-application-a53l.onrender.com",
    linkLabel: "See Live",
    description:
      "Flask-based recommendation app that suggests personalized movies with login, wishlist, and interactive dashboard features."
  },
  {
    id: "word",
    title: "Word Guessing Game",
    stack: "HTML, CSS, JavaScript",
    image: project5,
    link: "https://word-guessing-k2q4.onrender.com",
    linkLabel: "See Live",
    description:
      "Browser-based word game with random selection, letter validation, and real-time game state updates."
  },
  {
    id: "algo",
    title: "Algorithm Visualizer",
    stack: "HTML, CSS, JavaScript, DOM",
    image: project3,
    link: "https://github.com/shabaj003/Algorithm_visualizer-master",
    linkLabel: "Source Code",
    description:
      "Interactive web-based visualizer that graphically demonstrates sorting and searching algorithms with clear animations."
  },
  {
    id: "attendance",
    title: "Smart Attendance System",
    stack: "Python, Flask, HTML, CSS",
    image: project4,
    link: "https://github.com/shabaj003/smart-attendance-system-master",
    linkLabel: "Source Code",
    description:
      "Real-time face recognition attendance system with registration, live recognition, automated marking, and CSV record storage."
  },
  {
    id: "chat",
    title: "Chat Application System",
    stack: "HTML, Spring Boot, JavaScript",
    image: project6,
    link: "https://github.com/shabaj003/Chat-Application",
    linkLabel: "Source Code",
    description:
      "Real-time chat system using Spring Boot + WebSocket with dynamic HTML and JavaScript for smooth messaging."
  }
];

const navItems = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
  { href: "./freelancing.html", label: "FreeLancing" }
];

function SkillTrack({ items, reverse = false }) {
  const loopItems = [...items, ...items];
  return (
    <div className={`skills-track ${reverse ? "reverse" : ""}`}>
      {loopItems.map((skill, index) => (
        <article key={`${skill.name}-${index}`} className="skill-card">
          <img src={skill.icon} alt={skill.name} loading="lazy" />
          <span>{skill.name}</span>
        </article>
      ))}
    </div>
  );
}

export default function App() {
  const appRef = useRef(null);
  const tiltCardRef = useRef(null);
  const glareRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileProfileHover, setMobileProfileHover] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setIntroDone(true);
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" }
      });

      tl.from(".loader-reveal > span", {
        yPercent: 110,
        duration: 0.95,
        stagger: 0.14,
        delay: 0.35
      })
        .to(".loader-reveal > span", {
          yPercent: -115,
          duration: 0.58,
          stagger: 0.06
        })
        .to("#intro-loader", {
          height: 0,
          duration: 1.05,
          onComplete: () => setIntroDone(true)
        });
    }, appRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!introDone) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(".top-nav", {
        y: -18,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(".hero-reveal > span", {
        yPercent: 105,
        duration: 1.05,
        stagger: 0.14,
        ease: "expo.out",
        delay: 0.12
      });

      gsap.from(".hero-fade", {
        y: 20,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.25
      });

      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 46,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 86%"
          }
        });
      });
    }, appRef);

    return () => ctx.revert();
  }, [introDone]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 1024) setMobileNavOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  useEffect(() => {
    const resetMobileHoverOnPointerChange = () => {
      if (!window.matchMedia("(hover: none), (pointer: coarse)").matches) {
        setMobileProfileHover(false);
      }
    };

    window.addEventListener("resize", resetMobileHoverOnPointerChange);
    return () => window.removeEventListener("resize", resetMobileHoverOnPointerChange);
  }, []);

  const handleAnchorClick = (event, href) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setMobileNavOpen(false);
  };

  const toggleProject = (projectId) => {
    setActiveProject((current) => (current === projectId ? null : projectId));
  };

  const handleProjectTiltMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 11;
    const rotateY = (x - 0.5) * 11;

    card.classList.add("is-hovered");
    card.style.setProperty("--project-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--project-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--project-glare-x", `${(x * 100).toFixed(2)}%`);
    card.style.setProperty("--project-glare-y", `${(y * 100).toFixed(2)}%`);
  };

  const resetProjectTilt = (card) => {
    card.classList.remove("is-hovered");
    card.style.setProperty("--project-rotate-x", "0deg");
    card.style.setProperty("--project-rotate-y", "0deg");
    card.style.setProperty("--project-glare-x", "50%");
    card.style.setProperty("--project-glare-y", "50%");
  };

  const handleProjectTiltLeave = (event) => {
    resetProjectTilt(event.currentTarget);
  };

  const handleProfileTiltMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const card = tiltCardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotX = y * -22;
    const rotY = x * 22;

    card.classList.add("is-hovered");
    card.style.transition = "none";
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`;
    glare.style.background = `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255,255,255,0.18), transparent 65%)`;
  };

  const handleProfileTiltLeave = () => {
    const card = tiltCardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    card.classList.remove("is-hovered");
    card.style.transition = "transform 0.6s cubic-bezier(0.03, 0.98, 0.52, 0.99)";
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    glare.style.background = "none";
  };

  const handleMobileProfileHoverToggle = () => {
    if (!window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    setMobileProfileHover((prev) => !prev);
  };

  return (
    <div className="portfolio-app" ref={appRef}>
      <DeveloperBackground3DShader quality="high" />

      <section id="intro-loader" aria-hidden={introDone}>
        <div className="loader-top">
          <p className="loader-reveal">
            <span>Welcome to my</span>
          </p>
          <p className="loader-reveal">
            <span>portfolio</span>
          </p>
        </div>
        <h1 className="loader-name">
          {["Shahabaj", "Mulani", "is", "a"].map((word) => (
            <span key={word} className="loader-reveal">
              <span>{word}</span>
            </span>
          ))}
        </h1>
      </section>

      <header className="top-nav">
        <a href="#home" className="brand nav-link">
          Shahabaj Mulani
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={mobileNavOpen ? "site-nav open" : "site-nav"}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={(event) => handleAnchorClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumeFile}
            target="_blank"
            rel="noreferrer"
            className="nav-link nav-resume"
            onClick={() => setMobileNavOpen(false)}
          >
            Resume
          </a>
        </nav>
      </header>

      <main className="portfolio-content" id="home">
        <section className="hero-card reveal-section">
          <h1 className="hero-reveal hero-title">
            <span>Full Stack</span>
            <span>
              <em>Web Developer</em>
            </span>
          </h1>
          <div className="hero-meta-row hero-fade">
            <div className="hero-side">
              <p>Currently Available For</p>
              <p>Web Development</p>
            </div>
            <div className="hero-side">
              <p>Location: Pune</p>
              <p>(India)</p>
            </div>
          </div>
        </section>

        <section id="about" className="glass-section about-grid reveal-section">
          <div>
            <p className="section-label">About Me</p>
            <p>
              I&apos;m <strong>Shahabaj</strong>. I build modern, accessible web interfaces with
              delightful interactions. I am a quick learner with a self-learning attitude. I love
              to learn and explore new technologies and I am passionate about problem-solving.
            </p>
            <p>
              I love turning ideas into polished, production-ready experiences. I focus on beautiful
              accessible interfaces and enjoy collaborating on open-source while continuously improving
              my engineering approach.
            </p>

            <div className="about-actions">
              <a className="about-btn about-btn-resume" href={resumeFile} target="_blank" rel="noreferrer">
                <FaDownload /> Get Resume
              </a>
              <a className="about-btn about-btn-contact" href="#contact">
                <FaArrowRight /> Contact
              </a>
              <a
                className="about-btn about-btn-publication"
                href={paperFile}
                target="_blank"
                rel="noreferrer"
              >
                <FaMedium /> Publication
              </a>
              <a className="about-btn about-btn-freelancing" href="./freelancing.html">
                <FaBriefcase /> Freelancing
              </a>
            </div>

            <div className="social-links">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/shahabaj-mulani-5965292b8/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://wa.me/917276593004?text=Hello%20Shahabaj!%20I%20saw%20your%20portfolio."
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="mailto:mulanishabaj99@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Shahabaj,%20I%20saw%20your%20portfolio."
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <aside className="profile-visual">
            <div className="tilt-card-wrap">
              <article
                ref={tiltCardRef}
                className={`tilt-card ${mobileProfileHover ? "mobile-hovered" : ""}`}
                onMouseMove={handleProfileTiltMove}
                onMouseLeave={handleProfileTiltLeave}
                onClick={handleMobileProfileHoverToggle}
              >
                <img className="tilt-bg" src={aboutPortrait} alt="Portrait background" loading="lazy" />
                <div className="tilt-bottom-gradient" />
                <div className="tilt-info-panel">
                  <h3>Shahabaj Mulani</h3>
                  <span className="tilt-role-badge">Full Stack Developer</span>
                  <div className="tilt-social-row">
                    <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
                      <FaGithub />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/shahabaj-mulani-5965292b8/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
                <img className="tilt-profile" src={aboutHover} alt="Floating profile" loading="lazy" />
                <div ref={glareRef} className="tilt-glare" />
              </article>
            </div>
          </aside>
        </section>

        <section id="education" className="glass-section reveal-section">
          <p className="section-label">Education</p>
          <div className="education-layout">
            <div className="education-visual">
              <lottie-player
                src="https://assets3.lottiefiles.com/packages/lf20_0yfsb3a1.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: "320px", height: "320px" }}
              />
            </div>
            <div className="education-grid">
              {education.map((item) => (
                <article key={item.title} className="education-card">
                  <h3>{item.title}</h3>
                  <p>{item.institute}</p>
                  <span>{item.result}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="glass-section reveal-section">
          <p className="section-label">Skills</p>
          <div className="skills-wrap">
            <SkillTrack items={skillsPrimary} />
            <SkillTrack items={skillsSecondary} reverse />
          </div>
        </section>

        <section id="projects" className="glass-section reveal-section">
          <p className="section-label">Projects</p>
          <div className="project-grid">
            {projects.map((project) => {
              const isFlipped = activeProject === project.id;
              return (
                <article
                  key={project.id}
                  className={`project-card ${isFlipped ? "flipped" : ""}`}
                  onClick={() => toggleProject(project.id)}
                  onMouseMove={handleProjectTiltMove}
                  onMouseLeave={handleProjectTiltLeave}
                  onBlur={handleProjectTiltLeave}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleProject(project.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${project.title}`}
                >
                  <div className="project-card-inner">
                    <div className="project-front">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <h3>{project.title}</h3>
                      <p>{project.stack}</p>
                      <a
                        className={project.linkLabel === "Source Code" ? "link-source" : "link-live"}
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {project.linkLabel} <FaArrowRight />
                      </a>
                    </div>
                    <div className="project-back">
                      <p>{project.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="glass-section contact-grid reveal-section">
          <div className="contact-panel">
            <p className="section-label">Contact</p>
            <h2>Let&apos;s work together</h2>
            <p>If you like what you see, email me or use the form. I usually reply within a day.</p>
            <p>
              <strong>Email:</strong> mulanishabaj99@gmail.com
            </p>
            <p>
              <strong>Location:</strong> Pune
            </p>
          </div>

          <form className="contact-form" action="https://formspree.io/f/mjkapnqp" method="post">
            <input required type="text" name="name" placeholder="Your Name" />
            <input required type="email" name="email" placeholder="Your Email" />
            <textarea required name="message" placeholder="Message" rows={6} />
            <button type="submit">
              Send Message <FaArrowRight />
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Portfolio Developed By <span>Shahabaj Mulani</span>
        </p>
      </footer>
    </div>
  );
}
