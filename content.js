// CodeSandbox Logo
const SVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 14H13V3H2V14ZM11.875 12.875V4.125H3.125V12.875H11.875Z" fill="black"/>
</svg>

`;

const addButton = () => {
  // Get the toolbar
  const toolbar = document.querySelector('.file-navigation');

  if (!toolbar) {
    return
  }

  // Get everything after https://github.com/
  const URL = window.location.pathname;

  // Create the button
  const button = document.createElement('a');
  button.setAttribute('href', `https://codesandbox.io/p/github${URL}/`);
  button.setAttribute('target', '_blank');
  button.setAttribute('rel', 'noopener noreferrer');

  button.classList.add('btn', 'ml-2', 'open-codesanbox-chrome-extension');
  button.innerHTML = `
  ${SVG}
  Open in Projects
`;

  // Add it to the DOM
  toolbar.querySelector('get-repo').parentElement.before(button);
};
addButton();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  if (request.type === "screenshot") {
    screenshot();
  } else if (request.type === "screenshot-taken") {
    window.postMessage({
      type: 'extension-screenshot-taken',
      url: request.url
    })
  }

  sendResponse({});
});

function send(request) {
  chrome.runtime.sendMessage(request, function (response) { });
}

function screenshot() {
  const preview = document.querySelector('#sandbox-preview')
  const bounds = preview.getBoundingClientRect()

  send({
    type: "screenshot",
    bounds: {
      left: bounds.left * window.devicePixelRatio,
      top: bounds.top * window.devicePixelRatio,
      width: bounds.width * window.devicePixelRatio,
      height: bounds.height * window.devicePixelRatio
    }
  })
}

window.addEventListener('message', (event) => {
  if (event.source !== window)
    return

  if (event.data.type === 'extension-ping') {
    window.postMessage({
      type: 'extension-pong'
    })
  } else if (event.data.type === 'extension-screenshot') {
    screenshot()
  }
})