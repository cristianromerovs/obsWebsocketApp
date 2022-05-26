import './style.css'
import ObsWebSocket from 'obs-websocket-js'

// Script creado para ser usado con OBS Websocket version: 4.9.1
// Si se usa la version mas nueva da problemas de conexion

const app = document.querySelector('#app');

const generateAuthForm = () => {
  app.innerHTML = "";
  app.innerHTML = `
<form>
  <input type="text" id="adress" name="adress" placeholder="IP Adress:">
  <input type="text" id="password" name="password" placeholder="Password:">
  <button id="auth-submit">Connect</button>
</form>`
}

generateAuthForm();

let authSubmit = document.querySelector('#auth-submit');


authSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  // const formData = new FormData(app);
  const adress = document.querySelector('#adress').value;
  const password = document.querySelector('#password').value;
  const userData = {
    adress,
    password
  }
  main(userData.adress, userData.password);
});

async function main(adress, password) {
  const obs = new ObsWebSocket();
  try {
    await obs.connect({
      address: `${adress}:4444`,
      password: `${password}`
    });
    console.log('Connected to OBS');
    app.innerHTML = "";
    const data = await obs.send('GetSceneList');
    for (const scene of data.scenes) {
      const btnScene = document.createElement('button');
      btnScene.innerText = scene.name;
      btnScene.addEventListener('click', function (e) {
        e.preventDefault();
        obs.send('SetCurrentScene', {
          "scene-name": scene.name
        });
      });
      app.appendChild(btnScene);
    }

    const btnDisconnect = document.createElement('button');
    btnDisconnect.innerText = "Disconnect";
    btnDisconnect.addEventListener('click', function (e) {
      try {
        e.preventDefault();
        obs.disconnect();
        generateAuthForm();
      } catch (error) {
        console.log(error);
      }
    });
    app.appendChild(btnDisconnect);
  } catch (error) {
    console.log(error)
  }

}