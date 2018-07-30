const _ = require('lodash');
mongoose = require('mongoose');
cardModel = require('../card/card.model');
listModel = require('../list/list.model');

exports.getList  = function(req,res,next) {
    listModel.find({})
    .populate('cards')
    .then(lists => res.status(200).json(lists))
    .catch(error => next(error))
};

exports.createList = function(req, res ,next) {
    const newItem = new listModel({ title, position } = req.body )
    newItem.save()
	.then(list => {
		res.status(200).json(list)
	})
	.catch(error => next(error))
};

exports.editList = function(req, res ,next) {
    const listId = req.params.id;
    const update = req.body;
    const options = { new: true }
	listModel.findByIdAndUpdate(listId, update, options)
	.then(list => {
            if(list) res.status(200).json(list)
            else res.status(404).json({message: 'list not found'})
		})
	.catch(error => next(error))
};


exports.removeList = function (req, res) {
	const listId = req.params.id;
		listModel.findByIdAndRemove(listId)
		.then(response => {
			listModel.findOneAndUpdate(listId)
			.then(list => {
				res.status(200).json({message: "List removed!"})
			})
		})
		.catch(error => next(error))
};

