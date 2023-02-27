const Sauce = require("../models/Sauce");
const fs = require("fs"); // permettra de cree, lire, renommer, supprimer... des fichiers

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce); // envoi l'objet de la requete sous forme JSON (chaine de caractere)
  delete thingObject._id;
  delete thingObject._userId;
  const sauce = new Sauce({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${ // PROTOCOL = HTTP + FILENAME = NOM DU FICHIER
      req.file.filename
    }`, // generation de l'url de l'image
  });

  sauce
    .save() // enregistrement dans la bdd
    .then(() => { // OK
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => { // KO
      res.status(400).json({ error });
    });
};

exports.getOneThing = (req, res, next) => {
  // recuperation de l'id pour ouvrir "la page produit"
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyThing = (req, res, next) => {
  // modification du "produit"
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // recuperation de l'objet en recreant l'url de l'image
      }
    : { ...req.body }; // sinon recuperation de l'objet directement dans le corp de la requete

  delete thingObject._userId;
  Sauce.findOne({ _id: req.params.id }) // recuperation de l'objet dans la bdd
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
        ) // mettra à jour les modifications de l'objet
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteThing = (req, res, next) => {
  // suppression du 'produit' dans la bdd
  Sauce.findOne({ _id: req.params.id }) // recuperation de l'objet dans la bdd
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1]; // suppression de l'image dans son dossier 
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => {
  // recuperation de tout les "produits"
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createLike = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    // Recuperation de la sauce selectionné 
    .then((sauce) => {
      // la personne aime à la sauce
      if (req.body.like == 1) {
        sauce.likes++;  // +1 like
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
      }

      if (req.body.like == -1) {
        // La personne n'aime pas la sauce
        sauce.dislikes++; // +1 dislike
        sauce.usersDisliked.push(req.body.userId);
        sauce.save();
      }
      // si erreur de la personne
      if (req.body.like == 0) {
        if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
          // condition de suppression du like en fonction de l'id de la personne
          sauce.likes--; // retrait du like
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
        } else {
          // condition de suppression du dislike en fonction de l'id de la personne
          sauce.dislikes--; // retrait du dislike
          sauce.usersDisliked.splice(
            sauce.usersDisliked.indexOf(req.body.userId),
            1
          );
        }
        sauce.save();
      }
      // OK
      res.status(200).json({ message: "♥" });
    })
    .catch((error) => {
      // KO code 500
      res.status(500).json({ error });
    });
};
