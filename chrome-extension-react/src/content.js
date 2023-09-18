import React from 'react';
import ReactDOM from 'react-dom';

function MyComponent() {
  return <div>Hello, world!</div>;
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<MyComponent />, root);
