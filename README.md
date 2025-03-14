## 1️⃣ Replica Set (Replication) in MongoDB

### 🔹 **What is a Replica Set?**
A **MongoDB Replica Set** is a group of MongoDB instances that **maintain the same dataset**, providing **high availability, fault tolerance, and automatic failover**.

### ✅ **Components of Replica Set**
1. **Primary Node** – Handles all **write & read** operations.
2. **Secondary Nodes** – Replicates data from the primary node (can handle **read operations** if configured).
3. **Arbiter (Optional)** – Participates in **election** but **does not store data**.

### 🔹 **How Replica Set Works?**
1. The **primary node** processes all write requests.
2. **Secondary nodes** continuously replicate data from the primary.
3. If the primary fails, an **automatic election** happens, and a **new primary** is chosen.

### 🔹 **Commands to Set Up a Replica Set**
#### **Step 1: Start MongoDB Instances**
```sh
mongod --replSet "myReplicaSet" --port 27017 --dbpath /data/db1 --oplogSize 128 --fork --logpath /data/logs/mongo1.log
mongod --replSet "myReplicaSet" --port 27018 --dbpath /data/db2 --oplogSize 128 --fork --logpath /data/logs/mongo2.log
mongod --replSet "myReplicaSet" --port 27019 --dbpath /data/db3 --oplogSize 128 --fork --logpath /data/logs/mongo3.log
```

#### **Step 2: Initiate Replica Set**
```sh
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})
```

#### **Useful Commands**
- Check Replica Set Status: `rs.status()`
- View Current Primary Node: `rs.isMaster()`
- Force an Election: `rs.stepDown()`
- Add a New Node: `rs.add("new-node-ip:27020")`
- Remove a Node: `rs.remove("localhost:27019")`

---
## 2️⃣ Sharding in MongoDB

### 🔹 **What is Sharding?**
Sharding is a method of **distributing data** across multiple servers to improve **scalability and performance**.

### ✅ **Components of Sharding**
1. **Shard Servers** – Stores data.
2. **Config Servers** – Stores metadata and cluster configuration.
3. **Query Routers (mongos)** – Routes client requests.

### 🔹 **Sharding Setup Commands**
#### **Step 1: Start Config Servers**
```sh
mongod --configsvr --replSet configReplSet --port 27019 --dbpath /data/configdb --logpath /data/logs/config.log --fork
```

#### **Step 2: Initiate Config Replica Set**
```sh
rs.initiate({ _id: "configReplSet", members: [{ _id: 0, host: "localhost:27019" }] })
```

#### **Step 3: Start Shard Servers**
```sh
mongod --shardsvr --port 27018 --dbpath /data/shard1 --fork --logpath /data/logs/shard1.log
```

#### **Step 4: Start Mongos Query Router**
```sh
mongos --configdb configReplSet/localhost:27019 --port 27017 --fork --logpath /data/logs/mongos.log
```

#### **Step 5: Enable Sharding for Database**
```sh
sh.enableSharding("myDatabase")
```

#### **Step 6: Shard a Collection**
```sh
sh.shardCollection("myDatabase.myCollection", { user_id: 1 })
```
