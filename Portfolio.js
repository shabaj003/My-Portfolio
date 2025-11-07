gsap.registerPlugin(ScrollTrigger);
function valueSetters(){
    gsap.set ("#nav a",{y:"-100%",opacity:0});
    gsap.set ("#home .parent .child",{y:"100%"});
    gsap.set ("#home .row img",{opacity:0});
}
function revealToSpan() {
  document.querySelectorAll(".reveal").forEach(function (elem) {
    let parent = document.createElement("span");
    let child = document.createElement("span");

    parent.classList.add("parent");
    child.classList.add("child");

    child.innerHTML = elem.innerHTML;
    parent.appendChild(child);

    elem.innerHTML = "";
    elem.appendChild(parent);
  });
}

function loaderanimation(){
    let tl = gsap.timeline();

    tl.from("#loader .child span", {
        yPercent: 100,    
        duration: 1,
        stagger: 0.2,
        delay: 0.5,
        ease: "expo.inOut"
    })
        .to("#loader .parent .child", {
        yPercent: -100, 
        duration: 1,
        ease: "expo.inOut"
    })
    .to("#loader",{
        height:0,
        duration:1,
        ease:"expo.inOut"
    })
    .to("#green", {
        height: "100%",
        top: 0,
        delay: -0.8,
        duration: 1,
        ease: "expo.inOut"
    })
    .to("#green", {
        height: "0%",
        duration: 1,
        delay: -0.5,
        ease: "expo.inOut",
        onComplete: function(){
            animateHomepage();
        }
    });
}

function animateHomepage(){

    var tl=gsap.timeline();

    tl
    .to("#nav a",{
        y:0,
        opacity:1,
        stagger:.05,
        duration:2,
        ease: "expo.inOut"
    })
    .to("#home .parent .child",{
        y:0,
        stagger:.1,
        duration:2,
        ease: "expo.inOut"
    })
    .to("#home .row img",{
        opacity:1,
        ease: "expo.inOut"
    })
    .from(".reveal-text", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
    });
}
function Project(){
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        
        document.querySelectorAll('.card').forEach(c => {
          if (c !== card) c.classList.remove('flip');
        });
        
        card.classList.toggle('flip');
      });
    });
}
function handleForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';

    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Message sent successfully!';
        form.reset();
      } else {
        status.textContent = 'Oops! Something went wrong.';
      }
    } catch (error) {
      status.textContent = 'Network error. Try again later.';
    }
  });
}

function animeCarousel() {
  const container = document.querySelector('.carousel-container');
  const cards = document.querySelectorAll('.card1');


  function getDynamicRadius() {
    const width = window.innerWidth;
    if (width > 1200) return 400;
    if (width > 992) return 350; 
    if (width > 768) return 300; 
    return 200; 
  }

  let radius = getDynamicRadius();
  const total = cards.length;

  function setCardPositions() {
    radius = getDynamicRadius();
    cards.forEach((card, i) => {
      const angle = (i / total) * 360;
      card.style.transform = `
        rotateY(${angle}deg)
        translateZ(${radius}px)
      `;
    });
  }

  setCardPositions();

  window.addEventListener('resize', setCardPositions);

  let angleOffset = 0;
  function animate() {
    angleOffset += 0.2;
    container.style.transform = `rotateY(${angleOffset}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
}



revealToSpan();
valueSetters();
loaderanimation(); 
animeCarousel();
Project();
handleForm();