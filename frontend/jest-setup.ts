import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder for jsdom environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

