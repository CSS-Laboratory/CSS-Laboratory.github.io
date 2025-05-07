// javascript/research-loader.js

// --- Lightbox Functions (can be global or part of a module if you organize further) ---
function openLightbox(imageSrc, imageAlt) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightboxImage.alt = imageAlt || "Enlarged research image";
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore background scrolling
  }
}
// --- End Lightbox Functions ---

document.addEventListener('DOMContentLoaded', function() {
  // Load research projects
  loadResearchProjects();
  
  // Load publications
  loadPublications();
  
  // --- Lightbox Setup ---
  const lightbox = document.getElementById('lightbox');
  const lightboxCloseButton = document.querySelector('.lightbox-close'); // Get close button from lightbox div

  if (lightbox && lightboxCloseButton) {
      // Close lightbox when clicking on the close button
      lightboxCloseButton.addEventListener('click', closeLightbox);

      // Close lightbox when clicking on the overlay itself (outside the image)
      lightbox.addEventListener('click', function(event) {
          // If the clicked target is the overlay itself (not its children like the image)
          if (event.target === lightbox) { 
              closeLightbox();
          }
      });
  }
  // --- End Lightbox Setup ---
  
  // Check for hash in URL (for direct linking to a specific research area)
  // This part of your code remains the same
  setTimeout(function() {
      if (window.location.hash) {
          const targetElement = document.getElementById(window.location.hash.substring(1));
          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
              
              targetElement.classList.add('highlight-project');
              
              setTimeout(function() {
                  targetElement.classList.remove('highlight-project');
              }, 2000);
          }
      }
  }, 1000); // Delay to ensure content is loaded
});

// Function to load research projects from Excel
function loadResearchProjects() {
  const projectsContainer = document.getElementById('research-projects-container');
  if (!projectsContainer) {
      console.warn("Element with ID 'research-projects-container' not found.");
      return;
  }
  
  fetch('data/research/research_focus.xlsx')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok for research_focus.xlsx');
          }
          return response.arrayBuffer();
      })
      .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Adjusted parsing based on your original script (assuming headers are icon, title, etc.)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['icon', 'title', 'description', 'anchor', 'detailed_description', 'team_members', 'tags', 'image_path', 'read_more_link'] });
          
          projectsContainer.innerHTML = ''; // Clear loading indicator
          
          if (jsonData.length <= 1) { // Check if only header row or no data
              projectsContainer.innerHTML = '<p>No research projects available.</p>';
              return;
          }
          
          for (let i = 1; i < jsonData.length; i++) { // Start from 1 to skip header row
              const project = jsonData[i];
              if (!project || !project.title || project.title.trim() === '') {
                  continue; // Skip empty rows or rows without a title
              }
              
              const projectDiv = document.createElement('div');
              projectDiv.className = 'research-project';
              projectDiv.id = project.anchor || 'project-' + i;
              
              const contentDiv = document.createElement('div');
              contentDiv.className = 'project-content';
              
              const textDiv = document.createElement('div');
              textDiv.className = 'project-text';
              
              const titleDiv = document.createElement('h3');
              titleDiv.className = 'project-title';
              
              if (project.icon) {
                  const icon = document.createElement('i');
                  icon.className = project.icon;
                  icon.style.marginRight = '10px';
                  titleDiv.appendChild(icon);
              }
              titleDiv.appendChild(document.createTextNode(project.title));
              textDiv.appendChild(titleDiv);
              
              if (project.detailed_description) {
                  const descriptionElement = document.createElement('div');
                  descriptionElement.innerHTML = project.detailed_description; // USE INNERHTML
                  textDiv.appendChild(descriptionElement);
              } else if (project.description) { // Fallback to brief description if no detailed one
                  const descriptionElement = document.createElement('div');
                  descriptionElement.innerHTML = project.description; // USE INNERHTML
                  textDiv.appendChild(descriptionElement);
              }
              
              if (project.team_members) {
                  const teamDiv = document.createElement('div');
                  teamDiv.className = 'team-members';
                  const teamMembers = project.team_members.split(';').map(member => member.trim());
                  teamMembers.forEach(member => {
                      if (member) {
                          const span = document.createElement('span');
                          span.textContent = member;
                          teamDiv.appendChild(span);
                      }
                  });
                  textDiv.appendChild(teamDiv);
              }
              
              if (project.tags) {
                  const tagsDiv = document.createElement('div');
                  tagsDiv.className = 'project-tags';
                  const tags = project.tags.split(';').map(tag => tag.trim());
                  tags.forEach(tag => {
                      if (tag) {
                          const span = document.createElement('span');
                          span.textContent = tag;
                          tagsDiv.appendChild(span);
                      }
                  });
                  textDiv.appendChild(tagsDiv);
              }
              
              if (project.read_more_link && project.read_more_link.trim() !== '#') {
                  const readMoreLink = document.createElement('a');
                  readMoreLink.className = 'read-paper-btn';
                  readMoreLink.href = project.read_more_link;
                  readMoreLink.target = '_blank';
                  readMoreLink.innerHTML = 'Learn More <i class="fas fa-arrow-right"></i>';
                  textDiv.appendChild(readMoreLink);
              }
              
              contentDiv.appendChild(textDiv);
              
              // Project image part
              const imageDiv = document.createElement('div');
              imageDiv.className = 'project-image';
              
              if (project.image_path && project.image_path.trim() !== '') {
                  const imgElement = document.createElement('img');
                  let imageSrc = project.image_path.trim();

                  // Image path logic (same as we discussed for member-loader.js)
                  if (imageSrc.match(/^(https?:\/\/|\/|\.\/)/)) {
                      imgElement.src = imageSrc;
                  } else if (imageSrc.startsWith('images/')) {
                      imgElement.src = imageSrc;
                  } else {
                      imgElement.src = 'images/' + imageSrc; // Assumes images are in an 'images' subdirectory relative to project root
                  }
                  imgElement.alt = project.title + ' Visualization';

                  // === ADD CLICK LISTENER FOR LIGHTBOX ===
                  imgElement.addEventListener('click', function() {
                      openLightbox(this.src, this.alt);
                  });
                  // === END CLICK LISTENER ===

                  imageDiv.appendChild(imgElement);
                  contentDiv.appendChild(imageDiv); // Append image div only if image exists
              } else {
                  // Optionally, add a placeholder or leave empty if no image_path
                  // For now, if no image_path, the imageDiv won't be added
              }
              
              projectDiv.appendChild(contentDiv);
              projectsContainer.appendChild(projectDiv);
          }
      })
      .catch(error => {
          console.error('Error loading research projects:', error);
          if (projectsContainer) { // Ensure projectsContainer exists before setting innerHTML
              projectsContainer.innerHTML = '<p>Error loading content. Please try again later.</p>';
          }
      });
}

// Function to load publications from Excel (your existing function)
function loadPublications() {
const publicationList = document.querySelector('.publication-list');
if (!publicationList) {
    console.warn("Element with class '.publication-list' not found.");
    return;
}

fetch('data/research/paper_info.xlsx') // Assuming this is the correct path and file
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok for paper_info.xlsx');
    }
    return response.arrayBuffer();
  })
  .then(data => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Your original script used: {skipHeader: true, origin: "A2"}
    // Let's assume headers are title, authors, journal, year, link
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // Simpler parsing, adjust if headers are complex
    
    publicationList.innerHTML = ''; // Clear loading indicator
    
    if (jsonData.length === 0) {
      publicationList.innerHTML = '<p>No publications available.</p>';
      return;
    }
    
    jsonData.forEach(pub => {
      if (!pub || !pub.title || pub.title.trim() === '') {
          return; // Skip if no title
      }
      
      const publicationDiv = document.createElement('div');
      publicationDiv.className = 'publication-item';
      
      if (pub.research_area) {
        publicationDiv.setAttribute('data-research-area', pub.research_area);
      }
      
      const titleElement = document.createElement('h3');
      titleElement.className = 'publication-title';
      
      if (pub.link && pub.link.trim() !== '#') {
        const titleLink = document.createElement('a');
        titleLink.href = pub.link;
        titleLink.target = '_blank';
        titleLink.textContent = pub.title;
        titleElement.appendChild(titleLink);
      } else {
        titleElement.textContent = pub.title;
      }
      publicationDiv.appendChild(titleElement);
      
      const authorsElement = document.createElement('div');
      authorsElement.className = 'publication-authors';
      authorsElement.textContent = pub.authors || '';
      publicationDiv.appendChild(authorsElement);
      
      const journalElement = document.createElement('div');
      journalElement.className = 'publication-journal';
      journalElement.textContent = pub.journal || '';
      
      if (pub.year) {
        const yearSpan = document.createElement('span');
        yearSpan.className = 'publication-year';
        yearSpan.textContent = " (" + pub.year + ")"; // Adding parentheses for clarity
        journalElement.appendChild(yearSpan);
      }
      publicationDiv.appendChild(journalElement);
      
      // Links (DOI, PDF etc. if you add more columns to your Excel)
      // For now, main link is on title.
      
      publicationList.appendChild(publicationDiv);
    });
  })
  .catch(error => {
    console.error('Error loading publications:', error);
    if (publicationList) { // Ensure publicationList exists
      publicationList.innerHTML = '<p>Error loading publications. Please try again later.</p>';
    }
  });
}