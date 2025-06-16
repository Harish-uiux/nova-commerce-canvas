
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
