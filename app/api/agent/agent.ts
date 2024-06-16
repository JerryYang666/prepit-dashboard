import request from "@/lib/request";

export interface AgentsResponse {
  agents: Array<{
    agent_id: string;
    agent_name: string;
    agent_description: string;
    agent_cover: string;
    creator: string;
    status: number;
    allow_model_choice: boolean;
    model?: string;
    updated_at: string;
    workspace_id: string;
  }>;
  total: number;
}

export interface SingleAgentResponse {
  agent_id: string;
  agent_name: string;
  agent_description: string;
  agent_cover: string;
  creator: string;
  cat_id: string;
  status: number;
  allow_model_choice: boolean;
  model?: string;
  system_prompt: {
    [key: number]: string;
  };
  updated_at: string;
  files: {};
  workspace_id: string;
}

export interface NewAgent {
  agent_name: string;
  agent_description: string;
  agent_cover: string;
  creator: string;
  status: number;
  allow_model_choice: boolean;
  model?: string;
  system_prompt: {
    [key: number]: {
      [key: string]: string;
    };
  };
  files: {};
  workspace_id: string;
}

export interface UpdateAgent {
  agent_id: string;
  agent_name: string;
  agent_description: string;
  agent_cover: string;
  creator: string;
  status: number;
  allow_model_choice: boolean;
  model?: string;
  system_prompt: {
    [key: number]: {
      [key: string]: string;
    };
  };
  files: {};
  workspace_id: string;
}

export interface DeleteAgent {
  agent_id: string;
}

export interface GetAgent {
  page: number;
  page_size: number;
  search?: string;
  workspace_id?: string;
}

export interface GetAgentbyID {
  agent_id: string;
}

export interface FileUpload {
  file: File;
  file_name: string;
}

export interface FileUploadResponse {
  file_url: string;
}

// API paths
const path = "agents";

const api = {
  addAgent: path + "/add_agent",
  deleteAgent: path + "/delete_agent",
  updateAgent: path + "/update_agent",
  getAgentbyID: path + "/agent",
  getAgents: path + "/agents",
  fileUpload: "/upload_file",
};

// add agent
export function addAgent(data: NewAgent): Promise<NewAgent> {
  return request({
    url: api.addAgent,
    method: "post",
    data,
  });
}

// update agent
export function updateAgent(data: UpdateAgent): Promise<UpdateAgent> {
  return request({
    url: api.updateAgent,
    method: "post",
    data,
  });
}

// delete agent
export function deleteAgent(data: DeleteAgent): Promise<DeleteAgent> {
  return request({
    url: api.deleteAgent,
    method: "post",
    data,
  });
}

// get agent lists
export function getAgents(params: GetAgent): Promise<AgentsResponse> {
  return request({
    url: api.getAgents,
    method: "get",
    params: params,
  });
}

// get agent by ID
export function getAgentbyID(params: GetAgentbyID): Promise<SingleAgentResponse> {
  return request({
    url: api.getAgentbyID+"/"+params.agent_id,
    method: "get",
  });
}

// file upload
export function fileUpload(data: FileUpload | FormData): Promise<FileUploadResponse> {
  return request({
    url: api.fileUpload,
    method: "post",
    data,
  });
}
