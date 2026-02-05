import { Framework } from '../types';

export function convertReactToVue(reactCode: string): string {
  let vueCode = reactCode;

  // Convert useState
  vueCode = vueCode.replace(
    /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\((.*?)\)/g,
    'const $1 = ref($3)'
  );

  // Convert className to class
  vueCode = vueCode.replace(/className=/g, 'class=');

  // Convert onClick, onChange, etc. to @click, @change
  vueCode = vueCode.replace(/on(\w+)=/g, (_, event) => `@${event.toLowerCase()}=`);

  // Convert JSX curly braces to Vue interpolation
  vueCode = vueCode.replace(/\{(\w+)\}/g, '{{ $1 }}');

  // Wrap in Vue SFC structure
  const template = extractJSX(reactCode);
  const script = extractLogic(reactCode);

  return `<template>
  ${template}
</template>

<script setup lang="ts">
import { ref } from 'vue';

${script}
</script>

<style scoped>
/* Add your styles here */
</style>`;
}

export function convertReactToSvelte(reactCode: string): string {
  let svelteCode = reactCode;

  // Convert useState to Svelte reactive declarations
  svelteCode = svelteCode.replace(
    /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\((.*?)\)/g,
    'let $1 = $3'
  );

  // Convert className to class
  svelteCode = svelteCode.replace(/className=/g, 'class=');

  // Convert onClick to on:click
  svelteCode = svelteCode.replace(/on(\w+)=/g, (_, event) => `on:${event.toLowerCase()}=`);

  const template = extractJSX(reactCode);
  const script = extractLogic(reactCode);

  return `<script lang="ts">
${script}
</script>

${template}

<style>
/* Add your styles here */
</style>`;
}

export function convertToHTML(code: string): string {
  // Remove React-specific syntax and convert to plain HTML
  let html = extractJSX(code);
  
  // Remove JSX expressions
  html = html.replace(/\{.*?\}/g, '');
  
  // Convert className to class
  html = html.replace(/className=/g, 'class=');
  
  // Remove event handlers
  html = html.replace(/\s+on\w+={[^}]+}/g, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Component</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${html}
</body>
</html>`;
}

function extractJSX(code: string): string {
  // Extract the return statement JSX
  const returnMatch = code.match(/return\s*\(([\s\S]*?)\);?\s*\}/);
  if (returnMatch) {
    return returnMatch[1].trim();
  }
  
  // If no return found, try to find JSX directly
  const jsxMatch = code.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
  return jsxMatch ? jsxMatch[0] : code;
}

function extractLogic(code: string): string {
  // Extract everything except imports and the return statement
  let logic = code;
  
  // Remove imports
  logic = logic.replace(/import\s+.*?from\s+['"].*?['"];?\n/g, '');
  
  // Remove export statements
  logic = logic.replace(/export\s+(default\s+)?/g, '');
  
  // Remove function declaration and return
  logic = logic.replace(/^.*?(?:function|const)\s+\w+.*?\{/s, '');
  logic = logic.replace(/return\s*\(([\s\S]*?)\);?\s*\}[\s\S]*$/s, '');
  
  return logic.trim();
}

export function convertFramework(
  code: string,
  fromFramework: Framework,
  toFramework: Framework
): string {
  if (fromFramework === toFramework) {
    return code;
  }

  if (fromFramework === 'react') {
    switch (toFramework) {
      case 'vue':
        return convertReactToVue(code);
      case 'svelte':
        return convertReactToSvelte(code);
      case 'html':
        return convertToHTML(code);
      default:
        return code;
    }
  }

  // For other conversions, return original for now
  return `<!-- Conversion from ${fromFramework} to ${toFramework} not yet implemented -->\n\n${code}`;
}
