import { model } from '../../models';
import { IModels } from '../../interfaces/IModels';

export const findModelById = async (modelId: string) => {
    return model.findById(modelId);
};

export const createModel = async (modelData: IModels) => {
    return model.create(modelData);
};

export const updateModelById = async (modelId: string, modelData: Partial<IModels>) => {
    return model.findOneAndUpdate({ _id: modelId }, modelData, { new: true });
};

export const deleteModelById = async (modelId: string): Promise<IModels | null> => {
    return model.findByIdAndDelete({ _id: modelId });
};
