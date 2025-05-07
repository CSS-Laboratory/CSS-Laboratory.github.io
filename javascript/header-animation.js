// javascript/header-animation.js

// --- Function to set up the navigation toggle ---
function setupMobileNavToggle() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle && navLinks) { // Check if elements exist
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
    // console.log("Mobile nav toggle listener attached."); // Optional: for debugging
  } else {
    // console.warn("Mobile nav toggle elements (navToggle/navLinks) not found for setup."); // Optional: for debugging
  }
}
// --- End navigation toggle function ---

document.addEventListener('DOMContentLoaded', function() {
  // The call to setupMobileNavToggle() will now be handled by components-loader.js
  // after the navbar is loaded. So, we don't call it directly here anymore.

  // Scroll to content when clicking the scroll indicator (This part is fine)
  const scrollButton = document.getElementById('scroll-to-content');
  if (scrollButton) {
    scrollButton.addEventListener('click', function() {
      const aboutSection = document.getElementById('about'); // Ensure 'about' ID exists on index.html for this to work there
      const researchProjectsSection = document.querySelector('.research-projects'); // A more generic target for other pages

      if (aboutSection) { // Primarily for index.html
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      } else if (researchProjectsSection) { // For pages like research.html
        researchProjectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else { // Fallback if specific sections aren't found
        window.scrollTo({
          top: window.innerHeight * 0.8, // Scroll down most of the viewport height
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Handle form submission (This part is fine, specific to contactForm)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }
  
  // Language toggle (This part is fine, if you use it)
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    // ... your language toggle logic ...
  }
  
  // Header Particle Animation (This part is fine)
  setupHeaderAnimation(); // Assuming this function is defined below in your script
});

function setupHeaderAnimation() {
  const container = document.getElementById('particles-container');
  const header = document.getElementById('css-lab-header');
  
  if(!container || !header) return;
  
  // Create particles
  createParticles();
  
  // Create data tags
  createDataTags();
  
  // Animate particles
  animateParticles();
}

function createParticles() {
  const container = document.getElementById('particles-container');
  if(!container) return;
  
  const particleCount = 30;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const size = Math.random() * 3 + 1;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    
    container.appendChild(particle);
    
    particles.push({
      element: particle,
      x: x,
      y: y,
      size: size,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1
    });
  }
  
  // Create connections between particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      // Only connect some particles (not all)
      if (Math.random() > 0.7) continue;
      
      const connection = document.createElement('div');
      connection.className = 'connection';
      container.appendChild(connection);
      
      const p1 = particles[i];
      const p2 = particles[j];
      
      updateConnection(connection, p1, p2);
    }
  }
  
  return particles;
}

function updateConnection(connection, p1, p2) {
  const x1 = p1.x;
  const y1 = p1.y;
  const x2 = p2.x;
  const y2 = p2.y;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Set length and position
  connection.style.width = `${distance}%`;
  connection.style.left = `${x1}%`;
  connection.style.top = `${y1}%`;
  
  // Calculate angle
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  connection.style.transform = `rotate(${angle}deg)`;
}

function createDataTags() {
  const container = document.getElementById('particles-container');
  if(!container) return;
  
  const dataTags = [
    "Social Network Analysis",
    "Machine Learning",
    "LLMs",
    "Sentiment Analysis",
    "Data Visualization",
    "Complex Systems",
    "Agent-Based Modeling",
    "Computational Methods",
    "Social Dynamics",
    "Human Behavior",
    "Text Analytics",
    "Quantitative Research"
  ];
  
  dataTags.forEach((tag, index) => {
    const dataTag = document.createElement('div');
    dataTag.className = 'data-tag';
    dataTag.textContent = tag;
    
    // Random position
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 70 + 15; // 15% to 85%
    
    dataTag.style.left = `${x}%`;
    dataTag.style.top = `${y}%`;
    dataTag.style.setProperty('--delay', `${index * 0.8}s`);
    
    container.appendChild(dataTag);
  });
}

function animateParticles() {
  const container = document.getElementById('particles-container');
  if(!container) return;
  
  const particles = Array.from(document.querySelectorAll('.particle')).map(element => {
    return {
      element,
      x: parseFloat(element.style.left),
      y: parseFloat(element.style.top),
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1
    };
  });
  
  const connections = Array.from(document.querySelectorAll('.connection'));
  
  function updateParticles() {
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Boundary check
      if (particle.x < 0 || particle.x > 100) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > 100) {
        particle.speedY *= -1;
      }
      
      // Apply new position
      particle.element.style.left = `${particle.x}%`;
      particle.element.style.top = `${particle.y}%`;
    });
    
    // Update connections
    let connectionIndex = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        // Skip if we've used all connections
        if (connectionIndex >= connections.length) continue;
        
        updateConnection(connections[connectionIndex], particles[i], particles[j]);
        connectionIndex++;
      }
    }
    
    requestAnimationFrame(updateParticles);
  }
  
  updateParticles();
}