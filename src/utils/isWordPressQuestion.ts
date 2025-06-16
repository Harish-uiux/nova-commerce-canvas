
export const isWordPressQuestion = (input: string): boolean => {
  const wpKeywords = [
    "wordpress",
    "wp",
    "theme",
    "plugin",
    "shortcode",
    "functions.php",
    "elementor",
    "woocommerce",
    "hook",
    "filter",
    "action",
    "acf",
    "wp-admin",
    "custom post type",
    "wp_query",
    "wp_enqueue",
    "wp_head",
    "wp_footer",
    "gutenberg",
    "block editor",
    "wp-cli",
    "multisite",
    "wp_mail",
    "wp_insert_post",
    "wp_get_posts",
    "the_loop",
    "wp_nav_menu",
    "wp_customize",
    "rest api",
    "wp-json"
  ];

  const lowerInput = input.toLowerCase();
  return wpKeywords.some(keyword => lowerInput.includes(keyword));
};

export const getWordPressPrompt = (userInput: string): string => {
  return `You are a WordPress development expert assistant. Answer the following WordPress-related question with detailed, accurate information. Include code examples when relevant and explain best practices. Focus only on WordPress development topics.

Question: ${userInput}

Please provide a comprehensive answer that would help a WordPress developer.`;
};

export const getThemeGenerationPrompt = (userInput: string): string => {
  return `You are a professional WordPress theme developer. Generate a complete WordPress theme based on this request: "${userInput}"

Create a modern WordPress theme with the following requirements:
- Proper file and folder structure following WordPress standards
- Include style.css with valid theme header comment
- functions.php should enqueue styles/scripts, register menus, support featured images, and follow modern WordPress practices
- index.php should include basic loop and template structure with proper HTML5 semantics
- Include header.php, footer.php with standard HTML5 layout and WordPress hooks
- Include page.php, single.php for better template hierarchy
- Use modern WordPress features like wp_head(), wp_footer(), body_class(), etc.
- Include proper CSS with responsive design
- Follow WordPress coding standards and security best practices

Format your response EXACTLY like this with file emoji:

📄 style.css
[complete CSS code with theme header]

📄 functions.php
[complete PHP code with all functions]

📄 index.php
[complete PHP template code]

📄 header.php
[complete PHP header template]

📄 footer.php
[complete PHP footer template]

📄 page.php
[complete PHP page template]

📄 single.php
[complete PHP single post template]

Make sure each file contains complete, production-ready code that follows WordPress best practices. The theme should be modern, responsive, and include proper WordPress hooks and filters.`;
};
