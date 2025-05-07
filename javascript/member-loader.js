// Member Loader Script for CSS Lab Website
// This script loads team member information from Excel files

document.addEventListener('DOMContentLoaded', function() {
  // Load all member categories
  loadMemberCategory('faculty', 'Faculty', 'data/members/Faculty.xlsx');
  loadMemberCategory('postdoc', 'Postdoctoral Researchers', 'data/members/Postdocs.xlsx');
  loadMemberCategory('graduate', 'Graduate Students', 'data/members/Graduate_Students.xlsx');
  loadMemberCategory('undergraduate', 'Undergraduate Students', 'data/members/Undergraduate_Students.xlsx');
  loadMemberCategory('collaborators', 'Collaborators', 'data/members/Collaborators.xlsx');
  loadMemberCategory('others', 'Other Members', 'data/members/Others.xlsx');
  
  // Set up category filter functionality
  setupCategoryFilters();
});

// Function to set up category filters
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.category-button');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      
      // Filter team sections based on category
      const teamSections = document.querySelectorAll('.team-section-container');
      teamSections.forEach(section => {
        if (category === 'all') {
          section.style.display = 'block';
        } else if (section.getAttribute('data-category') === category) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
      
      // Filter individual members if "all" is selected but we need to show
      // members from specific categories
      if (category === 'all') {
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(member => {
          member.style.display = 'block';
        });
      }
    });
  });
}

// Function to load a category of members from Excel
function loadMemberCategory(category, titleText, filePath) {
  // Create section container
  const sectionContainer = document.createElement('div');
  sectionContainer.className = 'team-section-container';
  sectionContainer.setAttribute('data-category', category);
  
  // Create section title
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'team-section-title';
  sectionTitle.textContent = titleText;
  sectionContainer.appendChild(sectionTitle);
  
  // Create grid for members
  const teamGrid = document.createElement('div');
  teamGrid.className = 'team-grid';
  teamGrid.id = `${category}-grid`;
  sectionContainer.appendChild(teamGrid);
  
  // Add loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = `Loading ${titleText.toLowerCase()}...`;
  teamGrid.appendChild(loadingIndicator);
  
  // Append the section to the team section container
  document.querySelector('.team-section .container').appendChild(sectionContainer);
  
  // Load data from Excel file
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${titleText}: ${response.status} ${response.statusText}`);
      }
      return response.arrayBuffer();
    })
    .then(data => {
      // Parse Excel data
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get headers first for proper mapping
      const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
      console.log(`${category} headers:`, headers);
      
      // Parse data with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Clear loading indicator
      teamGrid.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        // Show a "Waiting to join" message instead of hiding the section
        teamGrid.innerHTML = `<p class="waiting-message">Waiting for ${titleText.toLowerCase()} to join.</p>`;
        return;
      }
      
      let memberCount = 0; // Track how many valid members we've added
      // Create member cards
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Extract name with possible different column headers
        const name = row.name || row.Name || row["Member Name"] || "";
        if (!name || name.trim() === '') {
          // Skip empty rows
          continue;
        }
        
        // Extract other fields with possible column variations
        const role = row.role || row.Role || row.Position || row.Title || "";
        const bio = row.bio || row.Bio || row.Biography || row.Description || "";
        const imagePath = row.image || row.Image || row["Image Path"] || "";
        
        // Social links (only display if provided)
        const emailLink = row.email || row.Email || row["Email Link"] || "";
        const websiteLink = row.website || row.Website || row["Website Link"] || "";
        const twitterLink = row.twitter || row.Twitter || row["Twitter Link"] || "";
        const linkedinLink = row.linkedin || row.LinkedIn || row["LinkedIn Link"] || "";
        const githubLink = row.github || row.GitHub || row["GitHub Link"] || "";
        const googleScholarLink = row.google_scholar || row["Google Scholar"] || row["Scholar Link"] || "";
        
        // Create team member card
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.setAttribute('data-category', category);
        
        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'member-image';
        
        const image = document.createElement('img');
        if (imagePath && imagePath.trim() !== '') {
          // Check if path has protocol or starts with / or ./
          if (imagePath.match(/^(https?:\/\/|\/|\.\/)/)) {
            image.src = imagePath;
          } else {
            // Assume path relative to images folder
            image.src = 'images/' + imagePath;
          }
          
          // Error handling for image loading
          image.onerror = function() {
            console.warn(`Failed to load image: ${this.src}`);
            this.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(name);
            this.alt = 'Placeholder for ' + name;
          };
        } else {
          // Use placeholder if no image specified
          image.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(name);
        }
        
        image.alt = name;
        imageContainer.appendChild(image);
        memberCard.appendChild(imageContainer);
        
        // Member info container
        const infoContainer = document.createElement('div');
        infoContainer.className = 'member-info';
        
        // Name
        const nameElement = document.createElement('h3');
        nameElement.textContent = name;
        infoContainer.appendChild(nameElement);
        
        // Role/Position
        if (role) {
          const roleElement = document.createElement('p');
          roleElement.className = 'member-role';
          roleElement.textContent = role;
          infoContainer.appendChild(roleElement);
        }
        
        // Bio
        if (bio) {
          const bioElement = document.createElement('p');
          bioElement.className = 'member-bio';
          bioElement.innerHTML = bio;
          infoContainer.appendChild(bioElement);
        }
        
        // Social links - only if provided
        const hasAnySocialLinks = emailLink || websiteLink || twitterLink || linkedinLink || githubLink || googleScholarLink;
        
        if (hasAnySocialLinks) {
          const linksContainer = document.createElement('div');
          linksContainer.className = 'member-links';
          
          // Email
          if (emailLink) {
            const email = document.createElement('a');
            email.href = emailLink.includes('@') ? `mailto:${emailLink}` : emailLink;
            email.innerHTML = '<i class="fas fa-envelope"></i>';
            email.title = 'Email';
            linksContainer.appendChild(email);
          }
          
          // Website
          if (websiteLink) {
            const website = document.createElement('a');
            website.href = websiteLink;
            website.target = '_blank';
            website.innerHTML = '<i class="fas fa-globe"></i>';
            website.title = 'Website';
            linksContainer.appendChild(website);
          }
          
          // Twitter
          if (twitterLink) {
            const twitter = document.createElement('a');
            twitter.href = twitterLink;
            twitter.target = '_blank';
            twitter.innerHTML = '<i class="fab fa-twitter"></i>';
            twitter.title = 'Twitter';
            linksContainer.appendChild(twitter);
          }
          
          // LinkedIn
          if (linkedinLink) {
            const linkedin = document.createElement('a');
            linkedin.href = linkedinLink;
            linkedin.target = '_blank';
            linkedin.innerHTML = '<i class="fab fa-linkedin"></i>';
            linkedin.title = 'LinkedIn';
            linksContainer.appendChild(linkedin);
          }
          
          // GitHub
          if (githubLink) {
            const github = document.createElement('a');
            github.href = githubLink;
            github.target = '_blank';
            github.innerHTML = '<i class="fab fa-github"></i>';
            github.title = 'GitHub';
            linksContainer.appendChild(github);
          }
          
          // Google Scholar
          if (googleScholarLink) {
            const googleScholar = document.createElement('a');
            googleScholar.href = googleScholarLink;
            googleScholar.target = '_blank';
            googleScholar.innerHTML = '<i class="fab fa-google"></i>';
            googleScholar.title = 'Google Scholar';
            linksContainer.appendChild(googleScholar);
          }
          
          infoContainer.appendChild(linksContainer);
        }
        
        memberCard.appendChild(infoContainer);
        teamGrid.appendChild(memberCard);
        memberCount++; // Increment counter after adding a valid member
      }
      
      // Check if there are any members after processing
      if (memberCount === 0) {
        // Show a "Waiting to join" message instead of hiding the section
        teamGrid.innerHTML = `<p class="waiting-message">Waiting for ${titleText.toLowerCase()} to join.</p>`;
      }
    })
    .catch(error => {
      console.error(`Error loading ${category} members:`, error);
      
      // For file not found errors, show "Waiting to join" message
      if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        teamGrid.innerHTML = `<p class="waiting-message">Waiting for ${titleText.toLowerCase()} to join.</p>`;
      } else {
        // For other errors, show an error message
        teamGrid.innerHTML = `<p>Error loading data. Please try again later.</p>`;
      }
    });
}