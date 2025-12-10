const hamburger = document.querySelector('.hamburger');
const nav_items = document.querySelector('.nav');

hamburger.addEventListener('click', ()=>{
    nav_items.style.display = 'block';    
})