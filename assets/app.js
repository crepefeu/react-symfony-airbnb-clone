import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './styles/app.scss';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */

// Register all controllers
registerReactControllerComponents(require.context(
    './react/controllers',
    true,
    /\.(j|t)sx?$/
));

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');