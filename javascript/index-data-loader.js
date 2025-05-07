// Data Loader Script for CSS Lab Website
// This script loads content from Excel files in the data folder

document.addEventListener('DOMContentLoaded', function() {
  // Load about section content
  loadAboutContent();
  
  // Load research focus content
  loadResearchFocusContent();
  
  // Load latest news content
  loadLatestNewsContent();
});

// Function to load about section content from Excel
function loadAboutContent() {
  const aboutSection = document.getElementById('about-content');
  if (!aboutSection) return;
  
  fetch('data/homepage/about.xlsx')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {skipHeader: true, origin: "A2"});
      
      // Clear loading indicator
      aboutSection.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        aboutSection.innerHTML = '<p>No content available.</p>';
        return;
      }
      
      // First row goes into h2
      if (jsonData[0] && jsonData[0].text) {
        const heading = document.createElement('h2');
        heading.textContent = jsonData[0].text;
        aboutSection.appendChild(heading);
      }
      
      // Subsequent rows go into paragraphs, until blank row
      for (let i = 1; i < jsonData.length; i++) {
        // Stop if we encounter an empty row
        if (!jsonData[i] || !jsonData[i].text || jsonData[i].text.trim() === '') {
          break;
        }
        
        const paragraph = document.createElement('p');
        paragraph.textContent = jsonData[i].text;
        aboutSection.appendChild(paragraph);
      }
    })
    .catch(error => {
      console.error('Error loading about content:', error);
      aboutSection.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
}

// Function to load research focus content from Excel
// Function to load research focus content from Excel
function loadResearchFocusContent() {
  const researchAreas = document.getElementById('research-areas');
  if (!researchAreas) return;
  
  fetch('data/research/research_focus.xlsx')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['icon', 'title', 'description', 'anchor', 'detailed_description', 'team_members', 'tags', 'image_path', 'read_more_link']});
      
      // Clear loading indicator
      researchAreas.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        researchAreas.innerHTML = '<p>No research areas available.</p>';
        return;
      }
      
      // Create research area items
      for (let i = 1; i < jsonData.length; i++) {
        // Stop if we encounter an empty row (checking title as it's required)
        if (!jsonData[i] || !jsonData[i].title || jsonData[i].title.trim() === '') {
          break;
        }
        
        // Create a clickable card that links to the research page with an anchor
        const areaDiv = document.createElement('div');
        areaDiv.className = 'research-area';
        areaDiv.style.cursor = 'pointer';
        
        // Add click event to navigate to the research page with the specific anchor
        areaDiv.addEventListener('click', function() {
          window.location.href = 'research.html#' + (jsonData[i].anchor || '');
        });
        
        // Icon
        const icon = document.createElement('i');
        icon.className = jsonData[i].icon || 'fas fa-flask'; // Default icon if not provided
        areaDiv.appendChild(icon);
        
        // Title
        const title = document.createElement('h3');
        title.textContent = jsonData[i].title;
        areaDiv.appendChild(title);
        
        // Description
        const description = document.createElement('p');
        description.textContent = jsonData[i].description || '';
        areaDiv.appendChild(description);
        
        researchAreas.appendChild(areaDiv);
      }
    })
    .catch(error => {
      console.error('Error loading research focus content:', error);
      researchAreas.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
}


// Function to load latest news content from Excel
function loadLatestNewsContent() {
  const newsItems = document.getElementById('news-items');
  if (!newsItems) return;
  
  fetch('data/news/latest_news.xlsx')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['date', 'title', 'description', 'read_more_link']});
      
      // Clear loading indicator
      newsItems.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        newsItems.innerHTML = '<p>No news items available.</p>';
        return;
      }
      
      // Create news items
      for (let i = 1; i < jsonData.length; i++) {
        // Stop if we encounter an empty row (checking title as it's required)
        if (!jsonData[i] || !jsonData[i].title || jsonData[i].title.trim() === '') {
          break;
        }
        
        const newsDiv = document.createElement('div');
        newsDiv.className = 'news-item';
        
        // Date
        const dateDiv = document.createElement('div');
        dateDiv.className = 'news-date';
        dateDiv.textContent = jsonData[i].date || 'No date';
        newsDiv.appendChild(dateDiv);
        
        // Title
        const title = document.createElement('h3');
        title.textContent = jsonData[i].title;
        newsDiv.appendChild(title);
        
        // Description
        const description = document.createElement('p');
        description.textContent = jsonData[i].description || '';
        newsDiv.appendChild(description);
        
        // Read more link
        const readMore = document.createElement('a');
        readMore.className = 'read-more';
        readMore.href = jsonData[i].read_more_link ||'#';
        readMore.textContent = 'Read More';
        newsDiv.appendChild(readMore);
        
        newsItems.appendChild(newsDiv);
      }
    })
    .catch(error => {
      console.error('Error loading news content:', error);
      newsItems.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
}
