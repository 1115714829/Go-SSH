package client

import (
    "bufio"
    "encoding/json"
    "fmt"
    "net"
    "time"
    "go-ssh/proto"
)

// APIClient 轻量级后端通信客户端。
type APIClient struct {
    Addr         string
    DialTimeout  time.Duration
    ReadTimeout  time.Duration
    WriteTimeout time.Duration
    Retries      int
}

// Send 发送统一的协议消息并返回标准响应，包含超时与重试机制。
func (c *APIClient) Send(msg proto.Message) (proto.Response, error) {
    start := time.Now()
    // 默认参数
    dialTimeout := c.DialTimeout
    if dialTimeout == 0 {
        dialTimeout = 2 * time.Second
    }
    readTimeout := c.ReadTimeout
    if readTimeout == 0 {
        readTimeout = 3 * time.Second
    }
    writeTimeout := c.WriteTimeout
    if writeTimeout == 0 {
        writeTimeout = 3 * time.Second
    }
    retries := c.Retries
    if retries <= 0 {
        retries = 3
    }

    var lastErr error
    var respBytes []byte
    for attempt := 0; attempt < retries; attempt++ {
        conn, err := net.DialTimeout("tcp", c.Addr, dialTimeout)
        if err != nil {
            lastErr = err
            time.Sleep(backoff(attempt))
            continue
        }
        // 设置读写超时
        _ = conn.SetDeadline(time.Now().Add(readTimeout))

        // 编码并发送
        b, err := json.Marshal(msg)
        if err != nil {
            _ = conn.Close()
            return proto.Response{}, err
        }
        b = append(b, '\n')
        if err := conn.SetWriteDeadline(time.Now().Add(writeTimeout)); err != nil {
            _ = conn.Close()
            return proto.Response{}, err
        }
        if _, err := conn.Write(b); err != nil {
            lastErr = err
            _ = conn.Close()
            time.Sleep(backoff(attempt))
            continue
        }

        // 读取响应
        r := bufio.NewReader(conn)
        respBytes, err = r.ReadBytes('\n')
        _ = conn.Close()
        if err != nil {
            lastErr = err
            time.Sleep(backoff(attempt))
            continue
        }
        // 成功读到响应，跳出重试
        break
    }
    if respBytes == nil {
        return proto.Response{}, fmt.Errorf("request failed after %d retries: %w", retries, lastErr)
    }

    var out proto.Response
    if err := json.Unmarshal(respBytes, &out); err != nil {
        return proto.Response{}, err
    }

    // 统一日志输出
    elapsed := time.Since(start)
    if out.Ok {
        fmt.Printf("[API] ok code=%d elapsed=%s type=%s\n", out.Code, elapsed, msg.Type)
    } else {
        fmt.Printf("[API] err code=%d msg=%s elapsed=%s type=%s\n", out.Code, out.Message, elapsed, msg.Type)
    }
    return out, nil
}

// Ping 封装的测试接口
func (c *APIClient) Ping() (proto.Response, error) {
    return c.Send(proto.Message{Type: "ping"})
}

// 简单指数退避
func backoff(attempt int) time.Duration {
    if attempt <= 0 {
        return 100 * time.Millisecond
    }
    d := time.Duration(1<<attempt) * 100 * time.Millisecond
    if d > 2*time.Second {
        d = 2 * time.Second
    }
    return d
}