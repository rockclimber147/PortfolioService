import { ApiServiceBase } from "./base";
import type { 
  ProjectDetail, ProjectCreate, ProjectUpdate, ProjectAdminRead, 
  TagCreate, TagRead, TagUpdate,
  ProfileRead, ProfileUpdate,
  ExperienceRead,
  ExperienceCreate,
  ExperienceUpdate
} from "../types";

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

  async updateProject(id: string, data: ProjectUpdate): Promise<ProjectDetail> {
    return this.request<ProjectDetail>(`/admin/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/admin/projects/${id}`, {
      method: "DELETE",
    });
  }

  async listProjects(): Promise<ProjectAdminRead[]> {
    return this.request<ProjectAdminRead[]>("/admin/projects/");
  }

  async listTags(): Promise<TagRead[]> {
    return this.request<TagRead[]>("/admin/tags");
  }

  async createTag(data: TagCreate): Promise<TagRead> {
    return this.request<TagRead>("/admin/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: string, data: TagUpdate): Promise<TagRead> {
    return this.request<TagRead>(`/admin/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request<void>(`/admin/tags/${id}`, { method: "DELETE" });
  }

  async uploadImage(file: File): Promise<string> {
    const { upload_url, public_url } = await this.request<{
      upload_url: string;
      public_url: string;
    }>("/admin/assets/upload-url", {
      method: "POST",
      body: JSON.stringify({
        file_name: file.name,
        content_type: file.type,
      }),
    });

    const s3Response = await fetch(upload_url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type, // Must match exactly what was sent to FastAPI
      },
    });

    if (!s3Response.ok) {
      throw new Error(`S3 Upload failed: ${s3Response.statusText}`);
    }

    return public_url;
  }

  async getProfile(): Promise<ProfileRead> {
    return this.request<ProfileRead>("/admin/profile/");
  }

  async updateProfile(data: ProfileUpdate): Promise<ProfileRead> {
    return this.request<ProfileRead>("/admin/profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async listExperiences(): Promise<ExperienceRead[]> {
    return this.request<ExperienceRead[]>("/admin/experience/");
  }

  async getExperience(id: string): Promise<ExperienceRead> {
    // If you added a specific GET by ID endpoint, use this
    return this.request<ExperienceRead>(`/admin/experience/${id}`);
  }

  async createExperience(data: ExperienceCreate): Promise<ExperienceRead> {
    return this.request<ExperienceRead>("/admin/experience/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateExperience(id: string, data: ExperienceUpdate): Promise<ExperienceRead> {
    return this.request<ExperienceRead>(`/admin/experience/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteExperience(id: string): Promise<void> {
    return this.request<void>(`/admin/experience/${id}`, { 
      method: "DELETE" 
    });
  }
}