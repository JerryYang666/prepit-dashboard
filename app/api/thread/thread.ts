import request from "@/lib/request";

interface GetNewThreadRequest {
  agent_id: string;
}

interface GetNewThreadResponse {
  thread_id: string;
}

export interface GetThreadListRequest {
  page: number;
  page_size: number;
  search: string;
  workspace_id: string;
  admin_mode?: boolean;
}

export interface ThreadListItem {
  thread_id: string;
  user_id: string;
  created_at: string;
  agent_id: string;
  agent_name: string;
  workspace_id: string;
  last_trial_timestamp: string;
  status: "Finished" | "In Progress";
  student_id?: string;
  user_name?: string;
}

interface GetThreadListResponse {
  threads: ThreadListItem[];
  total: number;
}

export interface ChatMessage {
  thread_id: string;
  created_at: string;
  msg_id: string;
  user_id: string;
  role: "human" | "openai" | "anthropic";
  content: string;
  step_id: number;
  trial_id: string;
  has_audio?: boolean;
}

export interface StepFeedback {
  thread_id: string;
  step_id: number;
  step_title: string;
  agent_id: string;
  feedback: string;
}

interface GetChatHistoryRequest {
  thread_id: string;
}

interface GetChatHistoryResponse {
  thread_id: string;
  messages: ChatMessage[];
  feedback: StepFeedback[];
}

// API full path: /v1/dev/admin/threads/xxx
const path = "threads";

const api = {
  getNewThread: path + "/new_thread",
  getThreadList: path + "/get_thread_list",
  getSingleThread: path + "/get_thread",
};

// get new thread (GET)
export function getNewThread(
  params: GetNewThreadRequest,
): Promise<GetNewThreadResponse> {
  return request({
    url: api.getNewThread,
    method: "get",
    params: params,
  });
}

// get thread list (GET)
export function getThreadList(
  params: GetThreadListRequest,
): Promise<GetThreadListResponse> {
  return request({
    url: api.getThreadList,
    method: "get",
    params: params,
  });
}

// get chat history for single thread (GET)
export function getChatHistory(
  params: GetChatHistoryRequest,
): Promise<GetChatHistoryResponse> {
  return request({
    url: api.getSingleThread + "/" + params.thread_id,
    method: "get",
  });
}
