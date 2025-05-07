// javascript/components-loader.js

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing components...");
  
  // --- Combined callback function for after navbar loads ---
  function afterNavbarLoaded() {
    if (typeof setActiveNavLink === 'function') {
      setActiveNavLink(); // Your existing callback
    }
    if (typeof setupMobileNavToggle === 'function') {
      setupMobileNavToggle(); // Call the nav toggle setup
    } else {
      console.warn("setupMobileNavToggle function is not defined. Mobile menu may not work.");
    }
  }
  // --- End combined callback ---
  
  // Load navbar and footer components
  loadComponent('navbar-container', 'components/navbar.html', afterNavbarLoaded); // Use the new combined callback
  loadComponent('footer-container', 'components/footer.html', loadFooterAnimation);
});

// Function to load a component into a container
function loadComponent(containerId, componentPath, callback = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container #${containerId} not found`);
    return;
  }
  
  fetch(componentPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      // console.log(`Component loaded into #${containerId}`); // Optional debug
      
      // Execute callback if provided
      if (callback && typeof callback === 'function') {
        // console.log(`Running callback for #${containerId}`); // Optional debug
        callback();
      }
    })
    .catch(error => {
      console.error(`Error loading component ${componentPath}:`, error);
      container.innerHTML = `<p>Error loading component. Please refresh the page.</p>`;
    });
}

// Function to set the active navigation link based on current page
// (Your existing setActiveNavLink function - ensure it's defined if not in this file)
// Example:
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  let navLinkId;
  // ... (your existing switch case or logic for navLinkId) ...
  // (This should already be in your components-loader.js or accessible to it)
  switch(currentPage) {
    case 'index.html': navLinkId = 'nav-home'; break;
    case 'research.html': navLinkId = 'nav-research'; break;
    case 'members.html': navLinkId = 'nav-members'; break;
    case 'resources.html': navLinkId = 'nav-resources'; break;
    case 'blog.html': navLinkId = 'nav-blog'; break;
    case 'contact_us.html': navLinkId = 'nav-contact'; break;
    // Add more cases as needed
  }
  if (navLinkId) {
    const navLink = document.getElementById(navLinkId);
    if (navLink) {
      navLink.classList.add('active');
    }
  }
}

// Function to load the footer animation script
function loadFooterAnimation() {
  console.log("Loading footer animation script");
  
  // Check if the script is already loaded
  if (document.querySelector('script[src*="network-animation.js"]')) {
    console.log("Animation script already loaded");
    return;
  }
  
  // Create script element
  const script = document.createElement('script');
  script.src = 'javascript/network-animation.js';
  script.async = true;
  script.onload = function() {
    console.log("Footer animation script loaded successfully");
  };
  script.onerror = function() {
    console.error("Failed to load footer animation script");
  };
  
  // Append to document
  document.body.appendChild(script);
}