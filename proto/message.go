package proto

import "encoding/json"

// Message 统一的协议包（前后端共享）：一行一个 JSON
type Message struct {
    Type string          `json:"type"`
    Data json.RawMessage `json:"data,omitempty"`
}

// PingResponse 用于连接性验证
type PingResponse struct {
    Message string `json:"message"`
}

// ConnectRequest/Response 用于建立与描述连接
type ConnectRequest struct {
    ID       string `json:"id"`
    Host     string `json:"host"`
    Port     int    `json:"port"`
    User     string `json:"user"`
    Password string `json:"password,omitempty"`
    KeyPath  string `json:"keyPath,omitempty"`
}

type ConnectResponse struct {
    ID    string `json:"id"`
    State string `json:"state"` // connected/disconnected
}

type ListConnectionsResponse struct {
    Connections []ConnectResponse `json:"connections"`
}

// 通用响应封装，确保前后端错误处理一致
type Response struct {
    Code    int    `json:"code"`              // 0 表示成功，其它为错误码
    Ok      bool   `json:"ok"`                // 成功/失败标识
    Message string `json:"message,omitempty"` // 错误或提示信息
    Data    any    `json:"data,omitempty"`    // 负载数据
}

// 公共错误码常量
const (
    CodeOK          = 0
    CodeBadRequest  = 400
    CodeUnknownType = 404
    CodeServerError = 500
)