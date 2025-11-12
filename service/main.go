package main

import (
    "log"
    "go-ssh/proto"
    "go-ssh/service/server"
)

// main 启动后端服务进程，接入统一的 TCP+JSON 服务器。
func main() {
    if err := server.Start(":8089", handleMessage); err != nil {
        log.Fatalf("server start error: %v", err)
    }
}

// handleMessage 路由消息类型并返回统一响应。
func handleMessage(msg proto.Message) (proto.Response, error) {
    switch msg.Type {
    case "ping":
        return proto.Response{Ok: true, Code: proto.CodeOK, Data: proto.PingResponse{Message: "pong"}}, nil
    case "list_connections":
        // TODO: 真实实现从连接管理器拉取现有连接列表
        return proto.Response{Ok: true, Code: proto.CodeOK, Data: proto.ListConnectionsResponse{Connections: []proto.ConnectResponse{}}}, nil
    default:
        // 未知类型时返回标准错误响应
        return proto.Response{Ok: false, Code: proto.CodeUnknownType, Message: "unknown type: " + msg.Type}, nil
    }
}