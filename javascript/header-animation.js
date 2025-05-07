document.addEventListener('DOMContentLoaded', function() {
  // Navigation toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if(navToggle) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Scroll to content when clicking the scroll indicator
  const scrollButton = document.getElementById('scroll-to-content');
  if(scrollButton) {
    scrollButton.addEventListener('click', function() {
      const aboutSection = document.getElementById('about');
      if(aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    });
  }
  
  
  // Language toggle (for demonstration)
  const languageToggle = document.getElementById('language-toggle');
  if(languageToggle) {
    languageToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const currentLang = languageToggle.textContent;
      
      if(currentLang === '日本語') {
        languageToggle.textContent = 'English';
        // In a real implementation, you'd change the language
        alert('Sorry, Japanese version is under development.');
      } else {
        languageToggle.textContent = '日本語';
      }
    });
  }
  
  // Header Animation
  setupHeaderAnimation();
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