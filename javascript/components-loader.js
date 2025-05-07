// Components Loader for CSS Lab Website
// This script loads shared components like navbar and footer

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing components...");
  
  // Load navbar and footer components
  loadComponent('navbar-container', 'components/navbar.html', setActiveNavLink);
  loadComponent('footer-container', 'components/footer.html', loadFooterAnimation);
});

// Function to load a component into a container
function loadComponent(containerId, componentPath, callback = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container #${containerId} not found`);
    return;
  }
  
  console.log(`Loading component into #${containerId} from ${componentPath}`);
  
  fetch(componentPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      console.log(`Component loaded into #${containerId}`);
      
      // Execute callback if provided
      if (callback && typeof callback === 'function') {
        console.log(`Running callback for #${containerId}`);
        callback();
      }
    })
    .catch(error => {
      console.error(`Error loading component ${componentPath}:`, error);
      container.innerHTML = `<p>Error loading component. Please refresh the page.</p>`;
    });
}

// Function to set the active navigation link based on current page
function setActiveNavLink() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  console.log(`Current page: ${currentPage}`);
  
  // Find the corresponding navigation link
  let navLinkId;
  switch(currentPage) {
    case 'index.html':
      navLinkId = 'nav-home';
      break;
    case 'research.html':
      navLinkId = 'nav-research';
      break;
    case 'members.html':
      navLinkId = 'nav-members';
      break;
    case 'resources.html':
      navLinkId = 'nav-resources';
      break;
    case 'blog.html':
      navLinkId = 'nav-blog';
      break;
    case 'contact_us.html':
      navLinkId = 'nav-contact';
      break;
    default:
      // If not one of the main pages, try to determine based on name
      if (currentPage.includes('research')) {
        navLinkId = 'nav-research';
      } else if (currentPage.includes('member')) {
        navLinkId = 'nav-members';
      } else if (currentPage.includes('resource')) {
        navLinkId = 'nav-resources';
      } else if (currentPage.includes('blog')) {
        navLinkId = 'nav-blog';
      } else if (currentPage.includes('contact')) {
        navLinkId = 'nav-contact';
      }
  }
  
  // Add active class to the corresponding link
  if (navLinkId) {
    const navLink = document.getElementById(navLinkId);
    if (navLink) {
      console.log(`Setting active link: ${navLinkId}`);
      navLink.classList.add('active');
    } else {
      console.warn(`Nav link #${navLinkId} not found`);
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