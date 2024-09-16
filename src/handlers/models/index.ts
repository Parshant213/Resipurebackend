import { Request, Response, NextFunction } from 'express';
import * as ModelService from '../../services/models';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IModels } from '../../interfaces/IModels';
import csvtojson from 'csvtojson';

export const getModelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { modelId } = req.params;
        const model = await ModelService.findModelById(modelId);

        if (!model) {
            throw new APIError('Model not found', HttpStatusCode.NOT_FOUND);
        }

        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const createModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, manufacturer, registersCSV } = req.body;

        if (!name || !manufacturer || !registersCSV) {
            throw new APIError('Name, Manufacturer, Model ID, and Registers CSV are required fields', HttpStatusCode.BAD_REQUEST);
        }

        const registers = await csvtojson().fromString(registersCSV);

        const modelData: IModels = {
            name,
            manufacturer,
            registers
        };

        const createdModel = await ModelService.createModel(modelData);
        res.status(201).json({"message": " Model created successfully", createdModel});
    } catch (error) {
        next(error);
    }
};

export const updateModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { modelId } = req.params;
        const { name, manufacturer, registersCSV } = req.body;
        if(!name && !manufacturer){
           throw new APIError('At least one field (name or manufacturer) is required to update', HttpStatusCode.BAD_REQUEST);
        }

        let registers = undefined;
        if (registersCSV) {
            registers = await csvtojson().fromString(registersCSV);
        }

        const modelData: Partial<IModels> = {
            ...(name && { name }),
            ...(manufacturer && { manufacturer }),
            ...(registers && { registers })
        };

        const updatedModel = await ModelService.updateModelById(modelId, modelData);

        if (!updatedModel) {
            throw new APIError('Model not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json({"message":"Model updated successfully", updatedModel});
    } catch (error) {
        next(error);
    }
};

export const deleteModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { modelId } = req.params;

        if (!modelId) {
            throw new APIError('Model ID is required', HttpStatusCode.BAD_REQUEST);
        }

        const deletedModel = await ModelService.deleteModelById(modelId);

        if (!deletedModel) {
            throw new APIError('Model not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json({ message: 'Model deleted successfully', deletedModel });
    } catch (error) {
        next(error);
    }
};
