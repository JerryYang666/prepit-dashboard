import request from "@/lib/request";
import exp from "constants";

export interface WorkspaceUser {
  user_id: number;
  student_id: string;
  role: "teacher" | "student" | "pending";
  workspace_id: string;
}

export interface ListWorkspaceUsersRequest {
  workspace_id: string;
  page: number;
  page_size: number;
  search?: string;
}

export interface ListWorkspaceUsersResponse {
  users: WorkspaceUser[];
  total: number;
}

export interface AddStudentsToWorkspaceRequest {
  workspace_id: string;
  students: string[];
}

export interface RemoveStudentFromWorkspaceRequest {
  workspace_id: string;
  student_id: string;
  user_id?: number;
}

// API full path: /v1/dev/admin/workspaces/xxx
const path = "workspace";

const api = {
  listUsers: path + "/list_users",
  addStudents: path + "/add_authorized_users",
  removeStudent: path + "/delete_user",
};

// Get a list of users in a workspace (GET)
export function listWorkspaceUsers(
  params: ListWorkspaceUsersRequest,
): Promise<ListWorkspaceUsersResponse> {
  return request({
    url: api.listUsers,
    method: "get",
    params: params,
  });
}

// Add students to a workspace (POST)
export function addStudentsToWorkspace(
  params: AddStudentsToWorkspaceRequest,
): Promise<void> {
  return request({
    url: api.addStudents,
    method: "post",
    data: params,
  });
}

// Remove a student from a workspace (POST)
export function removeStudentFromWorkspace(
  params: RemoveStudentFromWorkspaceRequest,
): Promise<void> {
  return request({
    url: api.removeStudent,
    method: "post",
    data: params,
  });
}
