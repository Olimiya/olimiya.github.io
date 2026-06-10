---
title: Flask SQLAlchemy
date: 2023-07-25 16:37
categories: [通用]
tags: ["技术整理"]
---

create_engine

[flask_sqlalchemy](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/)

## 快速入门

[QuickStart](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/quickstart/)

- SQLAlchemy、ORM的增删改查示例代码
    
    ```python
    import click
    from flask import Flask
    from flask_sqlalchemy import SQLAlchemy
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    db = SQLAlchemy(app)
    
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(50), nullable=False)
        age = db.Column(db.Integer)
    
    @app.route('/create_user')
    def create_user():
        # 创建一个新的用户
        user = User(name='John', age=25)
        db.session.add(user)
        db.session.commit()
        return 'User created successfully!'
    
    @app.route('/get_user/<int:user_id>')
    def get_user(user_id):
        # 根据用户ID查询用户信息
        user = User.query.get(user_id)
        if user:
            return f'User name: {user.name}, age: {user.age}'
        else:
            return 'User not found!'
    
    @app.route('/update_user/<int:user_id>')
    def update_user(user_id):
        # 根据用户ID更新用户信息
        user = User.query.get(user_id)
        if user:
            user.age = 30
            db.session.commit()
            return 'User updated successfully!'
        else:
            return 'User not found!'
    
    @app.route('/delete_user/<int:user_id>')
    def delete_user(user_id):
        # 根据用户ID删除用户信息
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return 'User deleted successfully!'
        else:
            return 'User not found!'
    
    with app.app_context():
        db.create_all()
    
    if __name__ == '__main__':
        app.run()
    
    @app.cli.command()  # 注册为命令，可以传入 name 参数来自定义命令
    @click.option('--drop', is_flag=True, help='Create after drop.')  # 设置选项
    def initdb(drop):
        """Initialize the database."""
        if drop:  # 判断是否输入了选项
            db.drop_all()
        db.create_all()
        click.echo('Initialized database.')  # 输出提示信息
    ```
    

**注意1：`create_all` 的使用**

<aside>
💡 You must be in an active Flask application context to execute queries and to access the session and engine.
您必须处于活动的 Flask 应用程序上下文中才能执行查询并访问会话和引擎。

</aside>

即，如果不在flask的route响应的上下文中，比如项目启动时使用create_all。要求：

```python
with app.app_context():
    db.create_all()
```

**注意2：更新模型**

`create_all` 不会更新表中的表，如果它们已经在数据库中。如果更改模型的列，请使用迁移库（如带有 Flask-Alembic 或 Flask-Migrate 的 Alembic）来生成更新数据库架构的迁移。

因此更改ORM后，考虑直接dropall然后重建。

**注意3：sqlite路径中的/**

标准用法是：

1. 绝对路径（绝对路径区分win、linux）

```python
WIN = sys.platform.startswith('win')
if WIN:  # 如果是 Windows 系统，使用三个斜线
    prefix = 'sqlite:///'
else:  # 否则使用四个斜线
    prefix = 'sqlite:////'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = prefix + os.path.join(app.root_path, 'data.db')
```

1. 相对路径

```python
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test1.db"
```

## 高级特性

### **meta和engine**

SQLAlchemy中metadata和engine的概念和示例。

metadata是SQLAlchemy中的一种对象，它可以被用来存储表(table)、列(column)和其他相关的数据库对象的元数据。传统上，metadata对象被用来创建、修改和删除表和列。

在SQLAlchemy中，metadata对象的创建应该在创建engine对象之前。通常情况下，metadata对象和其相关的table对象一起使用，相互配合实现数据库的创建与操作。

下面是一个使用metadata对象的例子：

```python
from sqlalchemy import create_engine, MetaData

# 创建engine对象
engine = create_engine('postgresql://user:password@host:port/database_name')

# 创建metadata对象
metadata = MetaData()

# 创建一个数据表，并将其关联到metadata对象
table = Table(
    'my_table', metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String),
    Column('age', Integer)
)

# 创建所有绑定到metadata的数据表
metadata.create_all(engine)

```

engine对象在SQLAlchemy中代表数据库连接。通过engine对象，我们可以执行SQL语句，注册监听器，以及拼接查询条件等。

下面是一个用engine对象创建表并执行插入操作的例子：

```python
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData

# 创建engine对象
engine = create_engine('postgresql://user:password@host:port/database_name')

# 创建metadata对象
metadata = MetaData()

# 构造my_table数据表
table = Table(
    'my_table', metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String),
    Column('age', Integer)
)

# 创建所有绑定到metadata的数据表
metadata.create_all(engine)

# 插入数据
conn = engine.connect()
ins = table.insert().values(name='Alice', age=25)
conn.execute(ins)

```

在上面的例子中，我们使用了engine对象创建了数据库表，并执行了插入数据操作。可以看出，metadata和engine这两个概念在SQLAlchemy中的关键作用。

### **flask_sqlalchemy.config.SQLALCHEMY_BINDS**

flask_sqlalchemy.config.SQLALCHEMY_BINDS的配置示例

`SQLALCHEMY_BINDS`是Flask SQLAlchemy中的一个配置项，用于配置多个数据库连接。它是一个字典，其中每个键都是一个数据库连接的名称，对应的值是一个数据库连接的URI或配置字典。

下面是一个示例，展示如何使用`SQLALCHEMY_BINDS`配置多个数据库连接：

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Multi Conn Test
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///multi-test1.db'
app.config['SQLALCHEMY_BINDS'] = {
    'db1': 'sqlite:///multi-test2.db',
    'db2': {
        'url': 'sqlite:///multi-test3.db',
    }
}

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120))

class User1(db.Model):
    __bind_key__ = 'db1'
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120))

class User2(db.Model):
    __bind_key__ = 'db2'
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120))

# create tables, drop tables before create
with app.app_context():
    db.drop_all()
    db.create_all()

```

在上面的示例中，我们定义了三个数据库连接：默认连接、名为`db1`的连接和名为`db2`的连接。`db1`和`db2`连接的URI分别为`sqlite:///multi-test2.db`和`sqlite:///multi-test3.db`。

我们还定义了三个模型类：`User`、`User1`和`User2`。`User`模型类使用默认连接，`User1`模型类使用`db1`连接，`User2`模型类使用`db2`连接。我们可以通过`__bind_key__`属性指定模型类使用的连接名称。

通过这样的配置，我们可以在一个Flask应用中同时连接多个数据库，并且可以方便地在不同的模型类中使用不同的数据库连接。

### flask_sqlalchemy.config.**SQLALCHEMY_ECHO**

`SQLALCHEMY_ECHO`是Flask SQLAlchemy中的一个配置项，用于开启SQLAlchemy的调试模式，可以将所有的SQL语句输出到控制台，方便调试和排查问题。

### 反射

通过反射获得已有数据库的模型。

```python
# 反射数据库表格
with app.app_context():
    db.reflect()

# 获取表格模型信息
class User(db.Model):
    __table__ = db.metadata.tables['user']
```

### 高级自定义

- 自定义Model Class，作为所有模型的共同基类。
- 抽象模型和Mixin Class，对于部分模型的共同抽象。
- 自定义QueryClass，添加自定义的方法。
- 自定义Model MetaClass，默认的有**`NameMetaMixin`、`BindMetaMixin` ,**分别添加默认的表名和默认的Bind。

### 水平分片Sharding

水平分片（Sharding）是一种将数据库水平划分为多个部分的技术，每个部分可以独立地扩展和管理。水平分片可以提高数据库的性能和可伸缩性，特别是在处理大量数据时。

在水平分片中，数据被分成多个分片（Shard），每个分片存储一部分数据。分片可以根据不同的规则进行划分，例如按照数据的ID、按照数据的地理位置、按照数据的时间等。每个分片都可以独立地扩展和管理，例如可以将分片部署在不同的服务器上，或者使用不同的数据库引擎来管理不同的分片。

下面是一个使用SQLAlchemy的水平分片示例代码：

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.horizontal_shard import ShardedSession

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)

class CustomSession(ShardedSession):
    def get_bind(self, mapper=None, clause=None):
        if mapper is not None and issubclass(mapper.class_, User):
            shard_id = mapper.attrs['id'].value % 2
            return self.shards[shard_id]
        else:
            return super().get_bind(mapper, clause)

engine1 = create_engine('sqlite:///shard1.db')
engine2 = create_engine('sqlite:///shard2.db')

Base.metadata.create_all(engine1)
Base.metadata.create_all(engine2)

Session1 = sessionmaker(bind=engine1)
Session2 = sessionmaker(bind=engine2)

session_options = {
    'shards': {
        0: Session1(),
        1: Session2()
    },
    'class_': CustomSession
}

session = sessionmaker(**session_options)()

user1 = User(name='Alice')
user2 = User(name='Bob')

session.add(user1)
session.add(user2)
session.commit()

users = session.query(User).all()
print(users)

```

在这个示例中，我们定义了一个`User`模型类，它表示用户信息，包括`id`和`name`两个字段。我们使用`ShardedSession`来实现水平分片，每个分片使用不同的SQLite数据库来存储数据。我们定义了一个`CustomSession`类，它继承自`ShardedSession`，并重写了`get_bind`方法，用于根据`User`模型类的`id`字段的值来选择分片。

我们创建了两个SQLite数据库引擎`engine1`和`engine2`，并使用`Base.metadata.create_all`方法来创建相应的表格。我们创建了两个`Session`对象`Session1`和`Session2`，分别绑定到`engine1`和`engine2`上。我们将这两个`Session`对象作为字典传递给`session_options`，并将`CustomSession`设置为会话类。最后，我们创建了一个会话对象`session`，并使用它来添加两个用户信息，并查询所有用户信息。

需要注意的是，这个示例中的水平分片规则非常简单，只是根据`User`模型类的`id`字段的值来选择分片。在实际应用中，水平分片的规则可能更加复杂，需要根据具体的业务需求来设计。

扩展数据库分片阅读：[How does database sharding work? (planetscale.com)](https://planetscale.com/blog/how-does-database-sharding-work)

## SQLAlchemy

快速入门：[SQLAlchemy Unified Tutorial — SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/tutorial/)

使用和上述的基本类似。

- ORM使用
    
    ```python
    # region 创建数据库连接
    # 创建数据库连接
    engine = create_engine('sqlite:///SQLAlchemy.db')
    # 创建Session
    Session = sessionmaker(bind=engine)
    session = Session()
    # endregion
    
    # region 创建表
    # 创建表
    Base = sqlalchemy.orm.declarative_base()
    
    class User(Base):
        __tablename__ = 'users'
    
        id = Column(Integer, primary_key=True)
        name = Column(String(50))
        age = Column(Integer)
        email = Column(String(120))
    
        def __repr__(self):
            return "<User(name='%s', age='%d', email='%s')>" % (self.name, self.age, self.email)
    
    Base.metadata.create_all(engine)
    # endregion
    
    # region CURD
    # 插入数据
    new_user = User(name='John Doe', age=30, email='john@example.com')
    session.add(new_user)
    
    session.commit()
    
    # 查询数据
    users = session.query(User).filter_by(age=30)
    
    for user in users:
        print(user)
    
    # 更新数据
    userToUpdate = session.query(User).filter_by(name='John Doe').first()
    userToUpdate.age = 35
    
    session.commit()
    ```
    
- 基本使用
    
    ```python
    with test_conn.connect() as conn:
            users = conn.execute(text('SELECT * FROM user'))
            return jsonify([user.id for user in users])
    ```
    

一些注意的：

- SQLAlchemy的create_engine传入URL的相对路径中，默认从执行的脚本（python xx.py）为基准，Flask SQLAlchemy由该脚本目录的instance目录为基准。
- 注意SQL返回Result，需要在with的上下文语境中使用。
1. **Engine（引擎）**：Engine 是 SQLAlchemy 的核心组件之一，用于与数据库建立连接并执行 SQL 语句。它负责管理数据库连接池、执行 SQL 语句并处理与数据库的交互。通过 Engine，你可以执行原始的 SQL 查询和操作。
2. **Connection（连接）**：Connection 是 Engine 创建的数据库连接对象。它表示与数据库的单个连接，并提供了执行 SQL 语句和事务管理的方法。你可以使用 Connection 执行原始的 SQL 查询、插入、更新和删除操作，并手动管理事务的提交和回滚。
    
    ```python
    from sqlalchemy import create_engine
    
    # 创建引擎
    engine = create_engine('sqlite:///mydatabase.db')
    
    # 获取连接对象
    connection = engine.connect()
    
    # 执行SQL语句
    result = connection.execute("SELECT * FROM users")
    for row in result:
        print(row)
    
    # 关闭连接
    connection.close()
    ```
    
3. **Session（会话）**：Session 是 SQLAlchemy 提供的高级数据库交互接口，用于管理对象关系映射（ORM）。它提供了一种更高级、更抽象的方法来执行数据库操作，使得操作更容易、更直观。Session 封装了 Connection，提供了事务管理、缓存和高级查询等功能。
    
    ```python
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    
    # 创建引擎和会话工厂
    engine = create_engine('sqlite:///mydatabase.db')
    Session = sessionmaker(bind=engine)
    
    # 创建会话对象
    session = Session()
    
    # 查询数据
    result = session.execute("SELECT * FROM users")
    for row in result:
        print(row)
    
    # 关闭会话
    session.close()
    ```
    
4. **MetaData（元数据）**：MetaData 是描述数据库结构的对象，包括表、列、约束等。它允许你定义和管理数据库模式，并在 ORM 中与对象模型进行映射。MetaData 可以通过声明式基类或手动定义表结构来创建。
    
    ```python
    from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
    
    # 创建引擎和元数据对象
    engine = create_engine('sqlite:///mydatabase.db')
    metadata = MetaData(bind=engine)
    
    # 定义表结构
    users_table = Table('users', metadata,
                        Column('id', Integer, primary_key=True),
                        Column('name', String),
                        Column('age', Integer)
                    )
    
    # 创建表
    metadata.create_all()
    
    # 执行查询
    result = engine.execute(users_table.select())
    for row in result:
        print(row)
    ```
    
5. **ORM（对象关系映射）**：ORM 是 SQLAlchemy 的核心特性之一，它允许你将数据库表和查询结果映射到 Python 对象。通过定义 ORM 模型类和映射关系，你可以使用面向对象的方式进行数据库操作，将数据库中的行和列转换为对象的属性和关系。示例见前面的使用。