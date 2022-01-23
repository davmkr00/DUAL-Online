let modal = document.getElementById("myModal");


const close = document.getElementById('close')
close.addEventListener('click', () => {
  modal.style.display = "none";
})


const play = document.getElementById('play')
play.addEventListener('click', () => {
  const num = document.getElementById('input_field').value
  if (!num) {
    alert("Please Enter Code To Join")
    return
  }
  document.location = `../game.html?room=${num}`
})


const multiplayer = document.getElementById('play_online')
multiplayer.addEventListener('click', () => {
  const num = Math.floor(Math.random() * 10000);
  document.getElementById('generate').innerHTML = `Generate code: ${num}`
  document.getElementById('input_field').value = num
})
