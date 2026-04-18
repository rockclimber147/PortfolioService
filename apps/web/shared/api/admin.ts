import { ApiServiceBase } from "./base";
import type { ProjectDetail, ProjectCreate } from "../types";

export class AdminApiService extends ApiServiceBase {
  private readonly apiKey: string;
  constructor(baseUrl: string, apiKey: string) {
    super(baseUrl);
    // 2. Assign the value manually
    this.apiKey = apiKey;
  }

  // Override the request method or just pass headers in each call
  protected override async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return super.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        "X-API-KEY": this.apiKey, // Admin secret is injected here
      },
    });
  }

  async createProject(data: ProjectCreate): Promise<ProjectDetail> {
    return this.request<ProjectDetail>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}