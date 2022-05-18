import './style.css'
import ObsWebSocket from 'obs-websocket-js'

const app = document.querySelector('#app');

app.innerHTML = "";
app.innerHTML = `
<form class="auth-data">
  <input type="text" id="adress" name="adress" placeholder="IP Adress:">
  <input type="text" id="password" name="password" placeholder="Password:">
  <button>Connect</button>
</form>`

let authForm = document.querySelector(".auth-data");

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(authForm);
  const adress = formData.get('adress');
  const password = formData.get('password'); 

  const userData = {
    adress,
    password
  }

  main(userData.adress, userData.password);
});


async function main(adress, password) {
  console.log(adress, password);
  const obs = new ObsWebSocket();
  await obs.connect({ address: `${adress}:4444`, password: `${password}` });
  console.log('Connected to OBS');
  authForm.style.display = "none"; 
  const data = await obs.send('GetSceneList');
  for (const scene of data.scenes) {
    const button = document.createElement('button');
    button.innerText = scene.name;
    button.addEventListener('click', function(e) {
      e.preventDefault();
      obs.send('SetCurrentScene', {"scene-name": scene.name});
    });
    app.appendChild(button);
  }
}