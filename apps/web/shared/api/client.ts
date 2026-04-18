import { ApiServiceBase } from "./base";
import type { ProjectSummary, ProjectDetail } from "../types";

export class ClientApiService extends ApiServiceBase {
  
  async listProjects(): Promise<ProjectSummary[]> {
    return this.request<ProjectSummary[]>("/projects/");
  }

  async getProject(slug: string): Promise<ProjectDetail> {
    return this.request<ProjectDetail>(`/projects/${slug}`);
  }
}