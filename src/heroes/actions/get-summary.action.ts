import { heroesApi } from "../api/heroesApi";
import type { SummaryInformationResponse } from "../interfaces/get-summary.response";

export const getSummaryAction = async(): Promise<SummaryInformationResponse> => {

    const { data } = await heroesApi.get<SummaryInformationResponse>('/summary');

    return data;
};