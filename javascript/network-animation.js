// Social Network Simulation for Footer Background
// This script creates an animated network visualization in the footer

// Wait for page to be fully loaded
window.addEventListener('load', function() {
  // Initialize the simulation when all resources are loaded
  console.log("Initializing network simulation...");
  setTimeout(initNetworkSimulation, 500); // Slight delay to ensure footer is loaded
});

function initNetworkSimulation() {
  // Get the canvas and check if it exists
  const canvas = document.getElementById('network-simulation');
  if (!canvas) {
    console.warn("Network simulation canvas not found");
    return;
  }
  
  console.log("Canvas found, setting up context");
  const ctx = canvas.getContext('2d');
  
  // Set canvas to full width/height of footer
  function resizeCanvas() {
    const footer = canvas.parentElement;
    if (!footer) return;
    
    // Set display dimensions
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Set actual canvas dimensions (accounting for device pixel ratio for retina displays)
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = footer.offsetWidth * pixelRatio;
    canvas.height = footer.offsetHeight * pixelRatio;
    
    // Scale context to match device pixel ratio
    ctx.scale(pixelRatio, pixelRatio);
    
    console.log(`Canvas resized to ${footer.offsetWidth}x${footer.offsetHeight}`);
  }
  
  // Call resize initially and on window resize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Simulation parameters
  const nodeCount = 15;  // Number of nodes in the network
  const connectionProbability = 0.3; // Probability of connection between nodes
  const nodeRadius = 10;  // Size of nodes
  const minDistance = 60; // Minimum distance for connections
  const maxDistance = 160; // Maximum distance for drawing connections
  
  // Colors
  const nodeColor = '#4e9af1';  // Blue nodes
  const connectionColor = 'rgba(255, 255, 255, 0.2)';  // White connections
  const activeNodeColor = '#64ffda';  // Teal for active nodes
  const activeConnectionColor = 'rgba(100, 255, 218, 0.4)';  // Teal connections
  
  // Node class for simulation
  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.2; // Horizontal velocity
      this.vy = (Math.random() - 0.5) * 0.2; // Vertical velocity
      this.radius = nodeRadius;
      this.connections = [];
      this.active = false;
      this.activationTime = 0;
      this.activeDuration = 0;
    }
    
    activate() {
      this.active = true;
      this.activationTime = Date.now();
      this.activeDuration = 2000 + Math.random() * 1500; // 2-3.5 seconds
    }
    
    update(canvasWidth, canvasHeight) {
      // Move node
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < this.radius || this.x > canvasWidth - this.radius) {
        this.vx *= -1;
        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
      }
      if (this.y < this.radius || this.y > canvasHeight - this.radius) {
        this.vy *= -1;
        this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));
      }
      
      // Check if activation should end
      if (this.active && Date.now() - this.activationTime > this.activeDuration) {
        this.active = false;
      }
    }
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.active ? activeNodeColor : nodeColor;
      ctx.fill();
    }
  }
  
  // Generate nodes
  const footer = canvas.parentElement;
  const footerWidth = footer.offsetWidth;
  const footerHeight = footer.offsetHeight;
  
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const x = Math.random() * footerWidth;
    const y = Math.random() * footerHeight;
    nodes.push(new Node(x, y));
  }
  
  // Generate connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < connectionProbability) {
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);
      }
    }
  }
  
  // Ensure each node has at least one connection
  nodes.forEach((node, index) => {
    if (node.connections.length === 0) {
      // Connect to closest node
      let closestDist = Infinity;
      let closestIndex = -1;
      
      for (let i = 0; i < nodes.length; i++) {
        if (i === index) continue;
        
        const dx = nodes[i].x - node.x;
        const dy = nodes[i].y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }
      
      if (closestIndex !== -1) {
        node.connections.push(closestIndex);
        nodes[closestIndex].connections.push(index);
      }
    }
  });
  
  // Simulation state
  let lastActivationTime = Date.now();
  const activationInterval = 2000; // Time between node activations
  let animationFrameId = null;
  
  // Animation loop
  function animate() {
    // Check if canvas is still in the DOM (might be removed during page transitions)
    if (!document.contains(canvas)) {
      console.log("Canvas no longer in DOM, stopping animation");
      cancelAnimationFrame(animationFrameId);
      return;
    }
    
    const footer = canvas.parentElement;
    const footerWidth = footer.offsetWidth;
    const footerHeight = footer.offsetHeight;
    
    ctx.clearRect(0, 0, footerWidth, footerHeight);
    
    // Check if we should activate a new node
    const currentTime = Date.now();
    if (currentTime - lastActivationTime > activationInterval) {
      // Select a random node to activate
      const randomIndex = Math.floor(Math.random() * nodes.length);
      nodes[randomIndex].activate();
      
      // Also activate connected nodes with a delay
      setTimeout(() => {
        nodes[randomIndex].connections.forEach(connectedIndex => {
          if (Math.random() < 0.6) { // 60% chance to activate connected node
            nodes[connectedIndex].activate();
            
            // Sometimes activate second-level connections
            if (Math.random() < 0.3) {
              setTimeout(() => {
                nodes[connectedIndex].connections.forEach(secondLevelIndex => {
                  if (Math.random() < 0.3 && secondLevelIndex !== randomIndex) {
                    nodes[secondLevelIndex].activate();
                  }
                });
              }, 200 + Math.random() * 200);
            }
          }
        });
      }, 300 + Math.random() * 300); // Delay by 300-600ms
      
      lastActivationTime = currentTime;
    }
    
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      for (let j = 0; j < node.connections.length; j++) {
        const connectedNode = nodes[node.connections[j]];
        
        // Only draw each connection once (avoid duplicates)
        if (node.connections[j] < i) continue;
        
        // Calculate distance
        const dx = connectedNode.x - node.x;
        const dy = connectedNode.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw connections within certain distance
        if (distance > maxDistance || distance < minDistance) continue;
        
        // Determine if connection should be active
        const isActive = node.active && connectedNode.active;
        
        // Calculate opacity based on distance
        const opacity = isActive ? 
          0.5 * (1 - (distance - minDistance) / (maxDistance - minDistance)) : 
          0.2 * (1 - (distance - minDistance) / (maxDistance - minDistance));
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connectedNode.x, connectedNode.y);
        
        if (isActive) {
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
        }
        
        ctx.stroke();
      }
    }
    
    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update(footerWidth, footerHeight);
      nodes[i].draw(ctx);
    }
    
    // Continue animation
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Start the animation
  console.log("Starting animation");
  animate();
  
  // Log success
  console.log("Network simulation initialized successfully");
}

// Add to network-animation.js
const DEBUG_MODE = false; // Set to false in production

if (DEBUG_MODE) {
  // Add debug info to the page
  const debugDiv = document.createElement('div');
  debugDiv.style.position = 'fixed';
  debugDiv.style.bottom = '10px';
  debugDiv.style.right = '10px';
  debugDiv.style.background = 'rgba(0,0,0,0.7)';
  debugDiv.style.color = 'white';
  debugDiv.style.padding = '5px';
  debugDiv.style.fontSize = '12px';
  debugDiv.style.zIndex = '9999';
  
  function updateDebugInfo() {
    debugDiv.textContent = `Canvas: ${canvas.width}x${canvas.height}, Nodes: ${nodes.length}`;
    requestAnimationFrame(updateDebugInfo);
  }
  
  document.body.appendChild(debugDiv);
  updateDebugInfo();
}