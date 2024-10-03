const date = new Date();
const year = document.getElementById('year').innerHTML = date.getFullYear();
const day = document.getElementById('day').innerHTML = date.getDay()
const month = document.getElementById('month').innerHTML = date.getMonth()
const year2 = document.getElementById('year2').innerHTML = date.getFullYear()
const hour = document.getElementById('hour').innerHTML = date.getHours()
const minute = document.getElementById('minute').innerHTML = date.getMinutes()
const seconds = document.getElementById('seconds').innerHTML = date.getSeconds()