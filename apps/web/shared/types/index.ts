import { type components } from "./api";

type Schemas = components["schemas"];

// --- Project Types ---
export type ProjectSummary = Schemas["ProjectSummary"];
export type ProjectAdminRead = Schemas["ProjectAdminRead"];
export type ProjectDetail = Schemas["ProjectDetail"];
export type ProjectCreate = Schemas["ProjectCreate"];
export type ProjectUpdate = Schemas["ProjectUpdate"];

// --- Tag Types ---
export type TagRead = Schemas["TagRead"];
export type TagCreate = Schemas["TagCreate"];
export type TagUpdate = Schemas["TagUpdate"];

// --- Profile Types ---
export type ProfileRead = Schemas["ProfileRead"]
export type ProfileUpdate = Schemas["ProfileUpdate"]