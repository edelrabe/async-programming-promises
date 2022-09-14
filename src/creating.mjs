import setText, { appendText } from "./results.mjs";

export function timeout() {
  console.log("timeout");
  // promise takes one 'Executor' function
  let wait = new Promise((resolve) => {
    setTimeout(() => {
      resolve("test");
    }, 1500);
  });

  wait.then((text) => setText(text));
}

export function interval() {
  let counter = 0;
  // promise takes one 'Executor' function
  let wait = new Promise((resolve) => {
    setInterval(() => {
      console.log("interval");
      resolve(`interval ${++counter}`);
    }, 1500);
  });

  wait
    .then((text) => setText(text))
    .finally(() => appendText(` ==> Done ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  // promise takes one 'Executor' function
  let wait = new Promise((resolve) => {
    interval = setInterval(() => {
      console.log("interval");
      resolve(`interval ${++counter}`);
    }, 1500);
  });

  wait
    .then((text) => setText(text))
    .finally(() => {
      appendText(` ==> Done ${counter}`);
      clearInterval(interval);
    });
}

export function xhr() {
  let wait = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3000/users/1`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      }
      else {
        console.error(JSON.stringify(xhr))
        reject(`Status = ${xhr.status}: ${xhr.statusText}`);
      }
    }
    xhr.onerror = () => reject(xhr.responseText);
    xhr.send();
  });

  wait
    .then((resp) => setText('OK: ' + resp))
    .catch((err) => setText('ERROR: ' + err));
}

export function allPromises() {
  let meta = [
    axios.get('http://localhost:3000/itemCategories'),
    axios.get('http://localhost:3000/orderStatuses'),
    axios.get('http://localhost:3000/userTypes')
  ];

  Promise.all(meta)
    .then(([cats, stats, types]) => {
      setText(JSON.stringify(cats));
      appendText(JSON.stringify(stats));
      appendText(JSON.stringify(types));
    })
    .catch(reasons => setText(JSON.stringify(reasons)));
}

export function allSettled() {
  let meta = [
    axios.get('http://localhost:3000/itemCategories'),
    axios.get('http://localhost:3000/orderStatuses'),
    axios.get('http://localhost:3000/userTypes'),
    axios.get('http://localhost:3000/unknown'),
  ];

  Promise.allSettled(meta)
    .then((results) => {
      let text = results.map(result => {
        return result.status === 'fulfilled'
          ? `FULFILLED:  + ${JSON.stringify(result.value.data)}`
          : `REJECTED: ${JSON.stringify(result.reason)}`;
      });
      setText(text);
      throw new Error('smth wrong');
    })
    .catch(reasons => setText('ERROR: ' + JSON.stringify(reasons)));
}

export function race() {
  let users = axios.get('http://localhost:3000/users/1');
  let backup = axios.get('http://localhost:3001/users/1');
  
  Promise.race([users, backup])
    .then((result) => {
      setText(JSON.stringify(result));
    })
    .catch(reasons => setText('ERROR: ' + JSON.stringify(reasons)));
}
