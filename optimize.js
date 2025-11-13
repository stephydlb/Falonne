const fs = require('fs');
const path = require('path');
const { minify: minifyJs } = require('uglify-js');

// Configuration pour la minification HTML
const htmlMinifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyJS: true,
  minifyCSS: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  sortAttributes: true,
  sortClassName: true
};

// Créer le dossier dist s'il n'existe pas
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Fonction pour copier les fichiers
async function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// Minifier le CSS (version simplifiée)
function minifyCss() {
  try {
    const cssFile = path.join(__dirname, 'styles.css');
    let css = fs.readFileSync(cssFile, 'utf8');
    
    // Suppression des commentaires
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Suppression des espaces inutiles
    css = css.replace(/\s+/g, ' ');
    css = css.replace(/\s*([:;{},>+])\s*/g, '$1');
    css = css.replace(/;}/g, '}');
    
    fs.writeFileSync(path.join(distDir, 'styles.min.css'), css.trim());
    console.log('✅ CSS minifié avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la minification du CSS:', error);
    return false;
  }
}

// Minifier le JavaScript
function minifyJsFiles() {
  const jsFiles = ['script.js'];
  
  jsFiles.forEach(file => {
    try {
      const jsFile = path.join(__dirname, file);
      const jsCode = fs.readFileSync(jsFile, 'utf8');
      
      // Utiliser uglify-js pour la minification
      const result = minifyJs(jsCode, {
        compress: true,
        mangle: true,
        output: {
          comments: false
        }
      });
      
      if (result.error) {
        console.error(`Erreur lors de la minification de ${file}:`, result.error);
        return;
      }
      
      // Écrire le fichier minifié
      fs.writeFileSync(
        path.join(distDir, file.replace('.js', '.min.js')), 
        result.code
      );
      console.log(`✅ ${file} minifié avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de la minification de ${file}:`, error);
    }
  });
}

// Minifier les fichiers HTML (version simplifiée)
function minifyHtmlFiles() {
  const htmlFiles = ['index.html', 'contact.html', 'reservation.html', 'confirmation.html'];
  
  htmlFiles.forEach(file => {
    try {
      const htmlFile = path.join(__dirname, file);
      let html = fs.readFileSync(htmlFile, 'utf8');
      
      // Suppression des commentaires HTML
      html = html.replace(/<!--[\s\S]*?-->/g, '');
      
      // Suppression des espaces inutiles
      html = html.replace(/\s+/g, ' ');
      html = html.replace(/>\s+</g, '><');
      
      // Mettre à jour les références aux fichiers minifiés
      html = html.replace(/\.css/g, '.min.css')
                 .replace(/\.js/g, '.min.js');
      
      fs.writeFileSync(path.join(distDir, file), html.trim());
      console.log(`✅ ${file} minifié avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de la minification de ${file}:`, error);
    }
  });
}

// Copier les images (sans optimisation pour l'instant)
function copyImages() {
  const imgDirs = ['assets', 'pictures'];
  
  imgDirs.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(distDir, dir);
    
    if (!fs.existsSync(srcDir)) return;
    
    // Créer la structure de dossiers
    function processDirectory(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src, { withFileTypes: true });
      
      files.forEach(file => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        
        if (file.isDirectory()) {
          processDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    processDirectory(srcDir, destDir);
    console.log(`✅ Images copiées depuis ${dir}`);
  });
}

// Copier les autres fichiers nécessaires
function copyMiscFiles() {
  const filesToCopy = [
    'robots.txt',
    'sitemap.xml',
    'manifest.json'
  ];
  
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(distDir, file));
      console.log(`✅ ${file} copié avec succès`);
    }
  });
  
  // Copier le dossier assets s'il existe
  const assetsDir = path.join(__dirname, 'assets');
  if (fs.existsSync(assetsDir)) {
    // Créer une fonction récursive pour copier les dossiers
    function copyRecursiveSync(src, dest) {
      const exists = fs.existsSync(src);
      const stats = exists && fs.statSync(src);
      const isDirectory = exists && stats.isDirectory();
      
      if (isDirectory) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
          copyRecursiveSync(
            path.join(src, childItemName),
            path.join(dest, childItemName)
          );
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    
    copyRecursiveSync(assetsDir, path.join(distDir, 'assets'));
    console.log('✅ Dossier assets copié avec succès');
  }
}

// Fonction principale
function optimize() {
  console.log('🚀 Début de l\'optimisation...');
  
  try {
    // Créer le dossier dist s'il n'existe pas
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Exécuter les optimisations
    minifyCss();
    minifyJsFiles();
    minifyHtmlFiles();
    copyImages();
    copyMiscFiles();
    
    console.log('✨ Optimisation terminée avec succès !');
    console.log(`📁 Le site optimisé se trouve dans le dossier: ${distDir}`);
    console.log('🚀 Pour tester le site optimisé, exécutez: npm start');
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
    process.exit(1);
  }
}

// Exécuter l'optimisation
optimize();
