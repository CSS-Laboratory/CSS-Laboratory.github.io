// Recruitment Loader Script for CSS Lab Website
// This script loads recruitment information from Excel files

document.addEventListener('DOMContentLoaded', function() {
  // Load recruitment opportunities on members.html (brief version)
  const memberPositionContainer = document.getElementById('member-position-container');
  if (memberPositionContainer) {
    loadRecruitmentBrief(memberPositionContainer);
  }
  
  // Load detailed recruitment on contact_us.html
  const contactPositionContainer = document.getElementById('contact-position-container');
  if (contactPositionContainer) {
    loadRecruitmentDetailed(contactPositionContainer);
  }
});

// Function to load brief recruitment info for members.html
function loadRecruitmentBrief(container) {
  fetch('data/contact/recruitment.xlsx')
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
      
      // Get headers first
      const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
      console.log("Recruitment headers:", headers);
      
      // Parse data with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Clear any existing content
      container.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        container.innerHTML = '<p class="no-positions">No open positions available at this time.</p>';
        return;
      }
      
      // Create position items (brief version)
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Extract title with possible different column headers
        const title = row.title || row.Title || row["Position Title"] || "";
        if (!title || title.trim() === '') {
          // Skip empty rows
          continue;
        }
        
        // Extract brief description
        const brief = row.brief || row.Brief || row["Brief Description"] || row.Summary || "";
        // Extract key requirements
        const requirements = row.requirements || row.Requirements || row["Key Requirements"] || "";
        // Link for application details
        const applyLink = row.apply_link || row["Apply Link"] || row.Link || "contact_us.html";
        
        // Create position item
        const positionDiv = document.createElement('div');
        positionDiv.className = 'open-position';
        
        // Title
        const titleElement = document.createElement('h3');
        titleElement.className = 'position-title';
        titleElement.textContent = title;
        positionDiv.appendChild(titleElement);
        
        // Brief description
        if (brief) {
          const briefElement = document.createElement('p');
          briefElement.textContent = brief;
          positionDiv.appendChild(briefElement);
        }
        
        // Requirements - brief format
        if (requirements) {
          const reqElement = document.createElement('p');
          reqElement.innerHTML = `<strong>Requirements:</strong> ${requirements}`;
          positionDiv.appendChild(reqElement);
        }
        
        // Apply button
        const applyButton = document.createElement('a');
        applyButton.className = 'apply-button';
        applyButton.href = 'contact_us.html#recruitment';
        applyButton.textContent = 'Application Details';
        positionDiv.appendChild(applyButton);
        
        container.appendChild(positionDiv);
      }
    })
    .catch(error => {
      console.error('Error loading recruitment data:', error);
      container.innerHTML = '<p>Error loading open positions. Please check back later.</p>';
    });
}

// Function to load detailed recruitment info for contact_us.html
function loadRecruitmentDetailed(container) {
  fetch('data/contact/recruitment.xlsx')
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
      
      // Parse data with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Clear any existing content
      container.innerHTML = '';
      
      // Check if there's data
      if (jsonData.length === 0) {
        container.innerHTML = '<p class="no-positions">No open positions available at this time. Please check back later or contact us directly for potential opportunities.</p>';
        return;
      }
      
      // Create position items (detailed version)
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Extract title
        const title = row.title || row.Title || row["Position Title"] || "";
        if (!title || title.trim() === '') {
          // Skip empty rows
          continue;
        }
        
        // Extract full description and other fields
        const brief = row.brief || row.Brief || row["Brief Description"] || row.Summary || "";
        const fullDescription = row.description || row.Description || row["Full Description"] || brief;
        const requirements = row.requirements || row.Requirements || row["Key Requirements"] || "";
        const detailedRequirements = row.detailed_requirements || row["Detailed Requirements"] || requirements;
        const qualifications = row.qualifications || row.Qualifications || row["Preferred Qualifications"] || "";
        const applyProcess = row.apply_process || row["Apply Process"] || row["How to Apply"] || "";
        const deadline = row.deadline || row.Deadline || row["Application Deadline"] || "";
        const contact = row.contact || row.Contact || row["Contact Person"] || "";
        const applyLink = row.apply_link || row["Apply Link"] || row.Link || "#";
        
        // Create position item for detailed view
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position-detailed';
        
        // Title
        const titleElement = document.createElement('h3');
        titleElement.className = 'position-title';
        titleElement.textContent = title;
        positionDiv.appendChild(titleElement);
        
        // Full description
        if (fullDescription) {
          const descElement = document.createElement('div');
          descElement.className = 'position-description';
          descElement.innerHTML = `<h4>Description</h4><p>${fullDescription}</p>`;
          positionDiv.appendChild(descElement);
        }
        
        // Detailed requirements
        if (detailedRequirements) {
          const reqElement = document.createElement('div');
          reqElement.className = 'position-requirements';
          reqElement.innerHTML = `<h4>Requirements</h4><p>${detailedRequirements}</p>`;
          positionDiv.appendChild(reqElement);
        }
        
        // Preferred qualifications
        if (qualifications) {
          const qualElement = document.createElement('div');
          qualElement.className = 'position-qualifications';
          qualElement.innerHTML = `<h4>Preferred Qualifications</h4><p>${qualifications}</p>`;
          positionDiv.appendChild(qualElement);
        }
        
        // Application process
        if (applyProcess) {
          const processElement = document.createElement('div');
          processElement.className = 'position-apply-process';
          processElement.innerHTML = `<h4>How to Apply</h4><p>${applyProcess}</p>`;
          positionDiv.appendChild(processElement);
        }
        
        // Deadline
        if (deadline) {
          const deadlineElement = document.createElement('div');
          deadlineElement.className = 'position-deadline';
          deadlineElement.innerHTML = `<h4>Application Deadline</h4><p>${deadline}</p>`;
          positionDiv.appendChild(deadlineElement);
        }
        
        // Contact
        if (contact) {
          const contactElement = document.createElement('div');
          contactElement.className = 'position-contact';
          contactElement.innerHTML = `<h4>Contact</h4><p>${contact}</p>`;
          positionDiv.appendChild(contactElement);
        }
        
        // Apply button
        const applyButton = document.createElement('a');
        applyButton.className = 'apply-button-large';
        applyButton.href = applyLink;
        applyButton.textContent = 'Apply Now';
        positionDiv.appendChild(applyButton);
        
        container.appendChild(positionDiv);
      }
    })
    .catch(error => {
      console.error('Error loading detailed recruitment data:', error);
      container.innerHTML = '<p>Error loading open positions. Please contact us directly for current opportunities.</p>';
    });
}
