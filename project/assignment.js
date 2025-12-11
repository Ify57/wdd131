const hamburger = document.querySelector('.hamburger');
const nav_items = document.querySelector('.nav');

hamburger.addEventListener('click', ()=>{
    nav_items.style.display = 'block';    
})
// ---------- Lazy Loading Image ----------
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy-img");

  lazyImages.forEach(img => {
    const src = img.getAttribute("data-src");
    if (src) {
      img.src = src;
      img.onload = () => img.classList.add("loaded");
    }
  });
}
lazyLoadImages();

// ---------- Contact Form  ----------
const form = document.querySelector("#contactForm");
const responseBox = document.querySelector("#responseMessage");

// Store submissions in an array using localStorage
let submissions = JSON.parse(localStorage.getItem("contactMessages")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const reason = document.querySelector("#reason").value;
  const message = document.querySelector("#message").value.trim();

  // Simple validation with conditionals
  if (!name || !email || !reason || !message) {
    responseBox.textContent = "Please fill out all fields before submitting.";
    responseBox.style.color = "red";
    return;
  }

  // Create message object
  const submission = {
    name,
    email,
    reason,
    message,
    date: new Date().toLocaleString()
  };

  // Add to array and save
  submissions.push(submission);
  localStorage.setItem("contactMessages", JSON.stringify(submissions));

  // Output using template literals
  responseBox.innerHTML = `
    <p style="color:green;">
      Thank you, <strong>${name}</strong>! Your message has been submitted.
    </p>
  `;

  form.reset();
});

// ---------- Example of array methods in action ----------
function logSubmissionReasons() {
  const reasons = submissions.map(entry => entry.reason);
  console.log("Reasons submitted:", reasons);
}
logSubmissionReasons();

