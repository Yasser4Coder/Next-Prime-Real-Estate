const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, '..', 'public', '.htaccess')
const dest = path.join(__dirname, '..', 'dist', '.htaccess')
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest)
  console.log('Copied .htaccess to dist/')
} else {
  console.warn('public/.htaccess not found; dist/.htaccess not copied. Add it manually for SPA routing on Hostinger.')
}
