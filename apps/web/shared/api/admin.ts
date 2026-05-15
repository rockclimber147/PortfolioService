import { ApiServiceBase } from "./base";
import type { 
  ProjectDetail, ProjectCreate, ProjectUpdate, ProjectAdminRead, 
  TagCreate, TagRead, TagUpdate,
  ProfileRead, ProfileUpdate,
  ExperienceRead, ExperienceCreate, ExperienceUpdate,
  EducationRead, EducationCreate, EducationUpdate
} from "../types";

export class AdminApiService extends ApiServiceBase {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Override the base request to ensure cookies are always sent.
   * Note: If your base class already handles 'credentials', you can skip this.
   */
  protected override async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return super.request<T>(endpoint, {
      ...options,
      credentials: "include", // Required for HttpOnly cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  /**
   * New Login Method: Sets the HttpOnly cookie on the backend
   */
  async login(apiKey: string): Promise<boolean> {
    try {
      await this.request("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ api_key: apiKey }),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * New Logout Method: Clears the cookie
   */
  async logout(): Promise<void> {
    await this.request("/admin/auth/logout", { method: "POST" });
  }

  /**
   * Verifies if the current session cookie is valid
   */
  async verifyKey(): Promise<boolean> {
    try {
      await this.request<{ status: string }>("/admin/auth/verify", {
        method: "POST",
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /* --- CRUD Methods (ApiKey injection removed) --- */

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

    // S3 uploads usually don't want your session cookies
    const s3Response = await fetch(upload_url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
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

  async listEducation(): Promise<EducationRead[]> {
    return this.request<EducationRead[]>("/admin/education/");
  }

  async createEducation(data: EducationCreate): Promise<EducationRead> {
    return this.request<EducationRead>("/admin/education/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEducation(id: string, data: EducationUpdate): Promise<EducationRead> {
    return this.request<EducationRead>(`/admin/education/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: string): Promise<void> {
    return this.request<void>(`/admin/education/${id}`, { 
      method: "DELETE" 
    });
  }
}