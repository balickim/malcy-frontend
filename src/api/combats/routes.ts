import { fetchWrapper } from "~/api/fetch";
import { IResponseRecruitmentDto } from "~/api/recruitments/dtos";
import { IJob } from "~/types/common";

export default class CombatsApi {
  private readonly basePath = `${import.meta.env.VITE_API_URL}/combats`;

  startSiege = async (
    body: unknown,
  ): Promise<IJob<IResponseRecruitmentDto>> => {
    return fetchWrapper(`${this.basePath}/start-siege`, {
      body: JSON.stringify(body),
      method: "POST",
    });
  };
}
