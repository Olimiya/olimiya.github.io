---
title: Flask JWT Extended
date: 2023-07-25 16:37
categories: [通用]
tags: ["技术整理"]
---

[flask_jwt_extended](https://flask-jwt-extended.readthedocs.io/en/stable/)

Flask JWT Extended是一个Flask扩展，用于实现JSON Web Token（JWT）的认证和授权。JWT是一种用于跨网络进行身份验证和授权的开放标准。它由三部分组成：头部、载荷和签名。

Flask JWT Extended提供了一组易于使用的工具，使您可以在Flask应用程序中快速使用JWT。它支持刷新令牌，约旦提取和黑名单等功能，并支持多种身份验证方案，包括HTTP基本身份验证、OAuth和OpenID Connect等。

使用Flask JWT Extended时，您需要设置一些配置选项，如密钥、令牌过期时间、刷新令牌过期时间和请求头名称。然后，您可以使用装饰器来保护您的视图函数，并使用JWT来进行身份验证和授权。

工作流程：




![img](/assets/img/posts/flask-jwt-extended/flask-jwt-extended-1.png)


![img](/assets/img/posts/flask-jwt-extended/flask-jwt-extended-2.png)

flask-jwt-extended：[https://github.com/vimalloc/flask-jwt-extended](https://github.com/vimalloc/flask-jwt-extended)

- 基本用法，登录token、jwt_requirered认证。
- 官方文档的自动用户加载。

第二点的实现过程，碰到数据库的问题。（官方给的例子省略掉数据库的部分）。数据库部分参考：[快速入门](Flask%20SQLAlchemy%2085c1ee6ee73d4f54afb8ac2ff70472d5.md) 

- 基本测试代码
    
    ```python
    # 基于登录创建token进行身份验证
    
    jwt = JWTManager(app)
    
    @app.route('/login', methods=['POST'])
    def login():
        """
        Returns a JWT token.
        """
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if username != 'test' or password != 'test':
            return jsonify({"msg": "Bad username or password"}), 401
    
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    
    @app.route('/protected', methods=['GET'])
    @jwt_required()
    def protected():
        """
        Returns a protected response.
        """
        username = get_jwt_identity()
        return jsonify(logged_in_as=username), 200
    
    if __name__ == '__main__':
        app.run(debug=True)
    # test
    # $ curl -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' http://localhost:5000/login
    # {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2....
    # $ curl -X GET -H "Authorization: Bearer <access_token>" http://localhost:5000/protected
    ```
    

**安装注意：**

[Installation — flask-jwt-extended 4.5.2 documentation](https://flask-jwt-extended.readthedocs.io/en/stable/installation.html)

根据官网安装说明，如果要使用非对称加密解密（RSA。一般都会用的）。

要使用：`$ pip install flask-jwt-extended[asymmetric_crypto]`

否则使用时会出现：Algorithm not supported。
