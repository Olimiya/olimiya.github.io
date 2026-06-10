---
title: Flask Prometheus Metrics
date: 2023-07-25 16:37
categories: [通用]
tags: ["技术整理"]
---

[flask_prometheus_metrics](https://github.com/pilosus/flask_prometheus_metrics)

1. flask prometheus metrics: https://github.com/pilosus/flask_prometheus_metrics
2. prometheus: [Getting started | Prometheus --- 入门 |普罗 米修斯](https://prometheus.io/docs/prometheus/latest/getting_started/)

`flask_prometheus_metrics`是一个用于将***Prometheus***监控指标集成到Flask Web应用程序中的工具库。其中，`register_metrics`是模块中的一个函数，可以使用它来注册自定义的Prometeus指标。

`register_metrics`的常用语法如下：

```
register_metrics(app, app_version=None, additional_buckets=None, counter_metrics=[], histogram_metrics=[])
```

参数说明：

- `app`：Flask应用程序实例。
- `app_version`：应用程序的版本号，可以是一个字符串，也可以是一个返回字符串的函数。
- `additional_buckets`：指定自定义的histogram_metrics缺省bucket。
- `counter_metrics`：用于存储一组Counter型的`Metric`数据结构。
- `histogram_metrics`：用于存储一组Histogram型的`Metric`数据结构。

示例：

假设我们有一个简单的Flask应用程序，用于提供用户管理功能，示例代码如下：

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

users = ['Alice', 'Bob', 'Charlie']

@app.route('/users')
def get_users():
    return jsonify(users=users)

@app.route('/users', methods=['POST'])
def add_user():
    username = request.json.get('username')
    if username is None:
        return jsonify(error='Username is required'), 400
    if username in users:
        return jsonify(error='User already exists'), 409
    users.append(username)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run()

```

现在，我们想要使用Prometheus监控该应用程序的指标。我们可以使用`register_metrics`函数将某些自定义指标注册到应用程序中。例如，我们可以为用户数量、添加用户请求数量和添加用户处理时间三个指标分别创建一个Counter和两个Histogram，示例代码如下：

```python
from flask import Flask, jsonify, request
from flask_prometheus_metrics import register_metrics
from prometheus_client import Counter, Histogram

app = Flask(__name__)

users = ['Alice', 'Bob', 'Charlie']

# define custom metrics
metrics = {}

metrics['users'] = Counter(
    'users_total', 'Number of users')

metrics['add_user_requests'] = Counter(
    'add_user_requests_total', 'Number of add user requests.')

metrics['add_user_processing_time'] = Histogram(
    'add_user_processing_seconds', 'Add user request processing time', ['status'])

@app.route('/users')
def get_users():
    return jsonify(users=users)

@app.route('/users', methods=['POST'])
def add_user():
    username = request.json.get('username')
    if username is None:
        return jsonify(error='Username is required'), 400
    if username in users:
        return jsonify(error='User already exists'), 409
    users.append(username)
    # increment the custom metrics
    metrics['users'].inc()
    metrics['add_user_requests'].inc()
    processing_time = 0.1  # dummy value
    metrics['add_user_processing_time'].labels('success').observe(processing_time)
    return jsonify(success=True)

# register the custom metrics
register_metrics(app, counter_metrics=list(metrics.values()))

if __name__ == '__main__':
    app.run()

```

在上面的代码中，我们首先定义了三个自定义指标，分别使用Counter和Histogram类型创建。然后，在添加用户的Flask处理函数中，我们更新了三个自定义指标的值，每次成功添加用户时，增加用户计数器（users），增加添加用户请求数量计数器（add_user_requests），并记录添加用户处理时间直方图（add_user_processing_time）。最后，我们调用`register_metrics`函数将自定义指标注册到Flask应用程序中。注意，我们需要将Counter和Histogram对象作为参数传递到`register_metrics`函数中。

使用上面的代码启动Flask应用程序后，即可在Prometheus监控指标中看到这几个自定义指标的值。例如，可以使用以下表达式查询用户计数指标的值：

```
users_tota
```

除了自定义指标外，`flask_prometheus_metrics`还提供了一些默认指标，例如请求数（requests_total）、HTTP方法数（http_requests_total）、请求处理时间（flask_http_request_duration_seconds）、HTTP请求大小（http_request_size_bytes）和HTTP响应大小（http_response_size_bytes）等。这些指标在应用程序启动时会自动注册到Prometheus监控器中。

可以使用以下表达式查询这些默认指标的值：

```
requests_total         # 请求总数
http_requests_total    # 支持的HTTP方法数量
flask_http_request_duration_seconds    # Flask请求处理时间
http_request_size_bytes # HTTP请求大小
http_response_size_bytes    # HTTP响应大小

```

使用`flask_prometheus_metrics`，可以方便地将Prometheus监控指标集成到Flask应用程序中，并对应用程序的性能进行监控和优化。