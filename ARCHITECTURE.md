# Portfolio System Architecture Specification

## 1. Project Overview
A cloud-native portfolio platform featuring a public gallery, an administrative dashboard, and a centralized API.
- **Goal:** Practice Kubernetes (K8s) orchestration and Infrastructure as Code (IaC) with Terraform.
- **Repository Structure:** Monorepo with `/apps` for code and `/infra` for DevOps.

---

## 2. Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Public Frontend** | React (Vite) + TypeScript + Tailwind CSS |
| **Admin Frontend** | React (Vite) + TypeScript + Tailwind CSS |
| **Backend API** | FastAPI (Python 3.11+) + SQLModel (ORMs) |
| **Database** | PostgreSQL (Managed RDS in Cloud / Docker locally) |
| **Media Storage** | AWS S3 (Images/Assets) |
| **Orchestration** | Kubernetes (EKS/GKE or Local Kind/Minikube) |
| **IaC** | Terraform (HCL) |

---

## 3. Database Schema (SQLModel)

### Table: `Project`
- `id`: UUID (Primary Key)
- `title`: String (Unique, Max 100)
- `slug`: String (Unique, Indexed) - URL-friendly name.
- `description_md`: Text - Main content in Markdown.
- `is_public`: Boolean (Default: False) - Visibility toggle.
- `tags`: List[str] (JSONB) - e.g., ["C++", "Nand2Tetris", "DevOps"].
- `created_at`: DateTime (Default: UTC Now).
- `date`: DateTime (Default: UTC Now)

### Table: `MediaAsset`
- `id`: UUID (Primary Key)
- `project_id`: ForeignKey(Project.id)
- `s3_url`: String - Full URL to image.
- `is_thumbnail`: Boolean (Default: False).
- `display_order`: Integer - Sequence for gallery display.

---

## 4. API Endpoints (FastAPI)

### Global / DevOps
- `GET /health`: Returns `{"status": "ok"}` for K8s Liveness/Readiness probes.

### Public (Client-Web)
- `GET /api/v1/projects`: List all `is_public=true` projects (Paginated).
- `GET /api/v1/projects/{slug}`: Get full project details by slug.
- `GET /api/v1/search?q=query`: Search projects by title or tags.

### Admin (Admin-Web)
- `POST /api/v1/admin/projects`: Create new project.
- `PATCH /api/v1/admin/projects/{id}`: Update project metadata/content.
- `DELETE /api/v1/admin/projects/{id}`: Remove project and associated S3 assets.
- `POST /api/v1/admin/projects/{id}/upload`: Handle image upload to S3.

---

## 5. Deployment & DevOps Requirements

### Containerization (Docker)
- Multi-stage builds for all services.
- API must listen on port `8000`.
- React apps served via Nginx on port `80`.

### Infrastructure (Terraform)
- **VPC Module:** Private/Public subnets for security.
- **RDS Module:** PostgreSQL instance.
- **S3 Module:** Bucket with public-read policy for image assets.
- **EKS Module:** The Kubernetes cluster.

### Kubernetes Resources
- **Deployments:** Replicas for high availability.
- **Services:** ClusterIP for internal networking.
- **Ingress:** Route `/admin` to Admin-Web and `/` to Client-Web.
- **Secrets:** Handle DB passwords and AWS keys via K8s Secrets.