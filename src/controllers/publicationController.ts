import fs from 'fs';
import path from 'path';

import { NextFunction, Request, Response } from 'express';

import { getLimit, getSkip } from '../utils/controllers/utils';
import { followUserIds } from '../utils/followUserIds';

import FailError from '../errors/FailError';

import PaginatedResponse from '../models/responses/PaginatedResponse';
import { IPublication, Publication } from '../models/Publication';

const savePublication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if (!text) throw new FailError('The text was not provided.');

    const newPublication = new Publication({ text: text });
    newPublication.user = req.user.id;

    if (!newPublication) throw new FailError('The publication has not been saved.');

    await newPublication.save();
    return res.status(200).json({
      newPublication,
    });
  } catch (error) {
    next(error);
  }
};

const findAllPublicationByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const limit = getLimit(req);
    const skip = getSkip(req);

    const publications = await Publication.find({ user: id, deleted: false })
      .sort('-createdAt')
      .populate('user', '-password -__v -role -email')
      .skip(skip)
      .limit(limit);
    if (!publications || publications.length <= 0) throw new FailError('User is posts could not be found.');

    const count = await Publication.count({ user: id, deleted: false });

    return res.send(new PaginatedResponse<IPublication>(publications, skip, limit, count));
  } catch (error) {
    next(error);
  }
};

const findOnePublication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const publication = await Publication.findById(id);
    if (!publication || publication.deleted === true) throw new FailError('Error the publication does not exist.');

    return res.status(200).json({ publication });
  } catch (error) {
    next(error);
  }
};

const removePublication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const publication = await Publication.find({ user: req.user.id, _id: id });
    if (!publication || publication[0].deleted === true) throw new FailError('Error the publication does not exist.');

    await Publication.updateOne({ _id: id, deleted: true });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicationId } = req.params;

    const publicationExists = await Publication.findOne({
      _id: publicationId,
      deleted: false,
    });

    if (!req.file) throw new FailError('The request does not include the image.');

    const image = req.file.originalname;
    const imageSplit = image.split('.');
    const extension = imageSplit[1];

    if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg' && extension !== 'gif') {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect file extension',
      });
    }
    const publicationUpdate = await Publication.findOneAndUpdate(
      { user: req.user.id, _id: publicationId, deleted: false },
      { file: req.file.filename },
    );

    if (!publicationUpdate) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);

      throw new FailError('Error uploading file, publication does not exist.');
    }

    if (!publicationExists) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      throw new FailError('Publication does not exist.');
    }

    return res.status(200).json({
      publication: publicationUpdate,
      file: req.file,
    });
  } catch (error) {
    next(error);
  }
};

const findImagePublication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req.params;

    const filePath = './src/uploads/publications/' + file;

    fs.stat(filePath, (error, exist) => {
      if (!exist) {
        return res.status(404).json({
          message: 'The image does not exist',
        });
      }

      return res.status(200).sendFile(path.resolve(filePath));
    });
  } catch (error) {
    next(error);
  }
};

const feedPublications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getLimit(req);
    const skip = getSkip(req);

    const myFollows = await followUserIds(req.user.id);

    const publications = await Publication.find({ user: { $in: myFollows.following }, deleted: false })
      .sort('-createdAt')
      .populate('user', '-password -__v -role -email')
      .skip(skip)
      .limit(limit);
    if (!publications) throw new FailError('User is posts could not be found.');

    const count = await Publication.count({ user: { $in: myFollows.following }, deleted: false });

    const responseData = {
      responseData: new PaginatedResponse<IPublication>(publications, skip, limit, count),
      following: myFollows.following,
    };

    return res.status(200).send(responseData);
  } catch (error) {
    next(error);
  }
};

export {
  savePublication,
  findAllPublicationByUser,
  findOnePublication,
  removePublication,
  uploadImage,
  findImagePublication,
  feedPublications,
};
