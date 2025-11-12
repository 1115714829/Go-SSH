package server

import (
    "bufio"
    "encoding/json"
    "io"
    "log"
    "net"
    "go-ssh/proto"
)

// Start 启动 TCP 服务器并处理连接。
// 约定：handler 返回已封装好的 proto.Response。
func Start(addr string, handler func(proto.Message) (proto.Response, error)) error {
    ln, err := net.Listen("tcp", addr)
    if err != nil {
        return err
    }
    log.Printf("TCP server listening on %s", addr)
    for {
        conn, err := ln.Accept()
        if err != nil {
            log.Printf("accept error: %v", err)
            continue
        }
        go handle(conn, handler)
    }
}

func handle(c net.Conn, handler func(proto.Message) (proto.Response, error)) {
    defer c.Close()
    r := bufio.NewReader(c)
    for {
        line, err := r.ReadBytes('\n')
        if err != nil {
            if err != io.EOF {
                log.Printf("read error: %v", err)
            }
            return
        }
        var msg proto.Message
        if err := json.Unmarshal(line, &msg); err != nil {
            log.Printf("json decode error: %v", err)
            _ = writeJSON(c, proto.Response{Ok: false, Code: proto.CodeBadRequest, Message: "invalid json"})
            continue
        }

        resp, err := handler(msg)
        if err != nil {
            _ = writeJSON(c, proto.Response{Ok: false, Code: proto.CodeServerError, Message: err.Error()})
            continue
        }
        // 正常直接返回 handler 已封装好的 Response
        _ = writeJSON(c, resp)
    }
}

func writeJSON(w io.Writer, v any) error {
    b, err := json.Marshal(v)
    if err != nil {
        return err
    }
    b = append(b, '\n')
    _, err = w.Write(b)
    return err
}