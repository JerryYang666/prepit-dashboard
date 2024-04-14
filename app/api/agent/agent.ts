import request from "@/lib/request";
import exp from "constants";
import { string } from "zod";

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
  }>;
  total: number;
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
}

export interface DeleteAgent {
  agent_id: string;
}

export interface GetAgent {
  page: number;
  page_size: number;
  search: string;
}

// API paths
const path = "agents";

const api = {
  addAgent: path + "/add_agent",
  deleteAgent: path + "/delete_agent",
  updateAgent: path + "/update_agent",
  getAgentbyID: path + "",
  getAgents: path + "/agents",
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

// update agent
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
