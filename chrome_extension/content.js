// content.js
const chatDiv = document.createElement('div');
chatDiv.id = 'myChatDiv';
chatDiv.innerHTML = `
  <input type="text" id="userQuestion" placeholder="Type your question">
  <button id="sendQuestion">Send</button>
  <div id="responseText"></div>
`;

document.body.appendChild(chatDiv);

document.getElementById('sendQuestion').addEventListener('click', async () => {
  const userQuestion = document.getElementById('userQuestion').value;
  
  // Send request to the API
  const response = await fetch('https://your-api-endpoint.com', {
    method: 'POST',
    body: JSON.stringify({ question: userQuestion }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const responseData = await response.json();
  
  // Display the response
  document.getElementById('responseText').innerText = responseData.answer;
});
