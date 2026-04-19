import { ApiServiceBase } from "./base";
import type { ProjectDetail, ProjectCreate, ProjectUpdate, ProjectAdminRead } from "../types";

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

  async verifyKey(): Promise<boolean> {
    try {
        await this.request<{status: string}>("/admin/verify", {
          method: "POST",
        });
        return true;
      } catch (error) {
        return false;
      }
    }

  async createProject(data: ProjectCreate): Promise<ProjectDetail> {
    return this.request<ProjectDetail>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Updates an existing project.
   * @param id The UUID of the project
   * @param data ProjectUpdate DTO (partial fields)
   */
  async updateProject(id: string, data: ProjectUpdate): Promise<ProjectDetail> {
    return this.request<ProjectDetail>(`/admin/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Deletes a project by UUID.
   */
  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/admin/projects/${id}`, {
      method: "DELETE",
    });
  }

  async listProjects(): Promise<ProjectAdminRead[]> {
    // Note: Ensure your FastAPI router has this endpoint mapped 
    // to the logic that returns all projects.
    return this.request<ProjectAdminRead[]>("/admin/projects/");
  }
}