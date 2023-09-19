// Button to show chat
const showChatButton = document.createElement('button');
showChatButton.id = 'myExtensionButton';
showChatButton.innerText = 'Open Chat';
document.body.appendChild(showChatButton);

// Chat Div
const chatDiv = document.createElement('div');
chatDiv.id = 'myChatDiv';
chatDiv.innerHTML = `
  <div id="chatLogs"></div>
  <input type="text" id="userInput">
  <button id="sendButton">Send</button>
`;

document.body.appendChild(chatDiv);

// Event listener to show/hide chat
showChatButton.addEventListener('click', () => {
  const chatDiv = document.getElementById('myChatDiv');
  const isChatVisible = chatDiv.style.display === 'block';

  // Show/hide the chat area
  chatDiv.style.display = isChatVisible ? 'none' : 'block';

  // Push down the existing content if the chat is visible
  if (isChatVisible) {
    document.body.style.marginTop = '0px';
  } else {
    const chatHeight = chatDiv.offsetHeight;
    document.body.style.marginTop = `${chatHeight}px`;
  }
});

// Event listener for send button
document.getElementById('sendButton').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value;
  const chatLogs = document.getElementById('chatLogs');

  // Append user's message to chatLogs
  chatLogs.innerHTML += `<div>User: ${userInput}</div>`;

  // Send data to API
  const response = await fetch('https://your-api-endpoint', {
    method: 'POST',
    body: JSON.stringify({ text: userInput }),
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await response.json();

  // Append API's message to chatLogs
  chatLogs.innerHTML += `<div>API: ${responseData.reply}</div>`;
});
