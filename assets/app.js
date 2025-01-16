import './bootstrap.js';
import './styles/app.css';

// Import React components
import './react/controllers/Hello';
import './react/controllers/Map';

import { registerReactControllerComponents } from '@symfony/ux-react';

// Register React controllers
registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');