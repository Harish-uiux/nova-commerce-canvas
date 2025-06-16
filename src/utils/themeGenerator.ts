
import JSZip from 'jszip';

export const generateThemeZip = async (files: Record<string, string>): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add each file to the zip
  Object.entries(files).forEach(([fileName, content]) => {
    // Clean up the file name (remove any extra formatting)
    const cleanFileName = fileName.replace(/^📄\s*/, '').trim();
    zip.file(cleanFileName, content);
  });
  
  // Add a basic screenshot placeholder
  const screenshotContent = `<?php
// This is a placeholder for screenshot.png
// Replace this file with an actual 1200x900 PNG screenshot of your theme
?>`;
  
  zip.file('screenshot.txt', screenshotContent);
  
  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
};
