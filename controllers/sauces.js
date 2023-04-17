const fs = require('fs');
const Sauces = require('../models/Sauces');


exports.createSauces = (req, res, next) => {
  console.log (req.body.sauce)
  const saucesObject = JSON.parse(req.body.sauce)
  delete saucesObject._id
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes:0,
    dislikes:0,
    usersLiked:[],
    usersDisliked:[],
  })

  sauces.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}

exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file 
    ? {
      ...JSON.parse(req.body.sauces), 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    : {...req.body}
  
  Sauces.updateOne({_id: req.params.id}, {...saucesObject, _id: req.params.id}).then(
    () => {
      res.status(201).json({
        message: 'Sauces updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id }).then(
        (sauces) => {
            if (!sauces) {
                console.log("error, no 'sauces' have been returned");
                res.status(404).json({
                    error: new Error('No such Sauces!')
                });
            }
            else if (sauces.userId !== req.auth.userId) {
                console.log("error, userId doesn't match\nsauces.userId: "+sauces.userId+" --- req.auth.userId: "+req.auth.userId);
                res.status(400).json({
                    error: new Error('Unauthorized request!')
                });
            }
            else{
                console.log("oh heyn its good, it did match!\nsauces.userId: "+sauces.userId+" --- req.auth.userId: "+req.auth.userId);
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                  Sauces.deleteOne({ _id: req.params.id })
                    .then(
                        () => {
                            res.status(200).json({
                                message: 'Deleted!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                })
            }
        }
    )
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find().then(
    (saucess) => {
      res.status(200).json(saucess);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.likeSauces = (req, res, next) => {
console.log('controller de la route likeSauces')
};