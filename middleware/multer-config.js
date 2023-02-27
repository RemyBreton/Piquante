const multer = require("multer"); // importation de multer

const MIME_TYPES = {
  // dictionnaire pour l'extension du fichier
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // configure le chemin et le nom de fichier pour les fichiers entrants.
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // fichier à utiliser par multer
    const name = file.originalname.split(" ").join("_"); // remplacera les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // genere l'extension du fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image"); 
/*crée un middleware qui capture les fichiers d'un certain type (passé en argument), 
et les enregistre au système de fichiers du serveur à l'aide du storage configuré.*/
