import { mount } from 'svelte';
import '@dotzari/design-system/tokens.css';
import '@dotzari/design-system/base.css';
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
