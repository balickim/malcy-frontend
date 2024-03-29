import { fetchWrapper } from "~/api/fetch";
import {
  IRequestRecruitmentDto,
  ISettlementDetailsDto,
  ISettlementDto,
  IResponseRecruitmentDto,
} from "~/api/settlements/dtos";
import { IApiResponse, IJob } from "~/types/common";
import { IBounds } from "~/types/settlement";
import { convertBoundsToSearchParams } from "~/utils/formatters";

export const getSettlements = async (
  bounds: IBounds,
): Promise<IApiResponse<ISettlementDto>> => {
  const data = new URLSearchParams(convertBoundsToSearchParams(bounds));
  return fetchWrapper(
    `${import.meta.env.VITE_API_URL}/settlements/bounds?${data}`,
  );
};

export const getSettlementById = async (
  id: string,
): Promise<IApiResponse<ISettlementDetailsDto>> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/settlements/${id}`);
};

export const startRecruitment = async (
  body: IRequestRecruitmentDto,
): Promise<IApiResponse<ISettlementDetailsDto>> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/recruit`, {
    body: JSON.stringify(body),
    method: "POST",
  });
};

export const getAllRecruitmentsBySettlementId = async (
  id: string,
): Promise<IApiResponse<IJob<IResponseRecruitmentDto>[]>> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/recruit/${id}`);
};

export const cancelRecruitment = async (
  settlementId: string,
  jobId: number,
): Promise<IApiResponse<IJob<IResponseRecruitmentDto>[]>> => {
  return fetchWrapper(
    `${import.meta.env.VITE_API_URL}/recruit/${settlementId}/${jobId}`,
    { method: "DELETE" },
  );
};
