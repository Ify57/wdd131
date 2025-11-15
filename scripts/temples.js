const menu = document.getElementById('hamburger');
const small_ul = document.querySelector('.small_ul');

menu.addEventListener('click', () =>{
        small_ul.classList.toggle('small_ul_show');
})