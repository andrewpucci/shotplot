module.exports = (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    let sanitized = content
      .replace(/<!DOCTYPE\s+html[^>]*>/i, '<!doctype html>')
      .replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '><');

    // Repeatedly remove HTML comments to prevent injection
    const commentRegex = /<!--[\s\S]*?-->/g;
    while (commentRegex.test(sanitized)) {
      sanitized = sanitized.replace(commentRegex, '');
      commentRegex.lastIndex = 0;
    }

    return sanitized.trim();
  }
  return content;
};
