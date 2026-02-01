module.exports = (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    return content
      .replace(/<!DOCTYPE\s+html[^>]*>/i, '<!doctype html>')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }
  return content;
};
