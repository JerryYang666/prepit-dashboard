import request from "@/lib/request";

interface GetNewThreadRequest {
    agent_id: string;
};

interface GetNewThreadResponse {
    thread_id: string;
};

interface GetThreadListRequest {
    page: number;
    page_size: number;
    search: string;
    workspace_id: string;
};

export interface ThreadListItem {
    thread_id: string;
    user_id: string;
    created_at: string;
    agent_id: string;
    agent_name: string;
    workspace_id: string;
    last_trial_timestamp: string;
    status: "Finished" | "In Progress";
};

interface GetThreadListResponse {
    threads: ThreadListItem[];
    total: number;
};

// API full path: /v1/dev/admin/threads/xxx
const path = "threads";

const api = {
    getNewThread: path + "/new_thread",
    getThreadList: path + "/get_thread_list",
};

// get new thread (GET)
export function getNewThread(params: GetNewThreadRequest): Promise<GetNewThreadResponse> {
    return request({
        url: api.getNewThread,
        method: "get",
        params: params,
    });
}

// get thread list (GET)
export function getThreadList(params: GetThreadListRequest): Promise<GetThreadListResponse> {
    return request({
        url: api.getThreadList,
        method: "get",
        params: params,
    });
}
