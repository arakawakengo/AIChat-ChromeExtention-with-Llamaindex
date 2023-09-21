import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './ChatWidget';

document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage({ action: "text_selected", selectedText });
    }
});

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<ChatWidget />, root);
