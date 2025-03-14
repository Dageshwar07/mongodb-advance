#!/bin/bash

# Create required directories with proper permissions
sudo mkdir -p /data/conf /data/rconf /data/s1 /data/s1r /data/s2 /data/s2r
sudo chown -R $(whoami) /data

# Start Config Servers
mongod --configsvr --port 27018 --replSet rs1 --dbpath /data/conf --fork --logpath /data/conf/mongod.log
mongod --configsvr --port 27019 --replSet rs1 --dbpath /data/rconf --fork --logpath /data/rconf/mongod.log

# Initiate Config Server Replica Set
mongosh --port 27018 --eval "rs.initiate({_id:'rs1',members:[{_id:0,host:'localhost:27018'},{_id:1,host:'localhost:27019'}]})"

# Start Shard 1 Servers
mongod --shardsvr --port 27020 --replSet rs2 --dbpath /data/s1 --fork --logpath /data/s1/mongod.log
mongod --shardsvr --port 27021 --replSet rs2 --dbpath /data/s1r --fork --logpath /data/s1r/mongod.log

# Initiate Shard 1 Replica Set
mongosh --port 27020 --eval "rs.initiate({_id:'rs2',members:[{_id:0,host:'localhost:27020'},{_id:1,host:'localhost:27021'}]})"

# Start Shard 2 Servers
mongod --shardsvr --port 27022 --replSet rs3 --dbpath /data/s2 --fork --logpath /data/s2/mongod.log
mongod --shardsvr --port 27023 --replSet rs3 --dbpath /data/s2r --fork --logpath /data/s2r/mongod.log

# Initiate Shard 2 Replica Set
mongosh --port 27022 --eval "rs.initiate({_id:'rs3',members:[{_id:0,host:'localhost:27022'},{_id:1,host:'localhost:27023'}]})"

# Start Mongos Router
mongos --configdb rs1/localhost:27018,localhost:27019 --port 27050 --fork --logpath /data/mongos.log

# Add Shards to Mongos Router
mongosh --port 27050 --eval "sh.addShard('rs2/localhost:27020,localhost:27021')"
mongosh --port 27050 --eval "sh.addShard('rs3/localhost:27022,localhost:27023')"

# Enable Sharding on Database 'xyz'
mongosh --port 27050 --eval "use xyz; sh.enableSharding('xyz'); sh.status();"


#1. Check sharding status
#    sh.status()
#2. Add a Shard
#    sh.addShard("rs2/localhost:27020,localhost:27021")
#3. Enable sharding for a database
#    sh.enableSharding("xyz")
#4. Remove a shard from a cluster
#    sh.removeShard("rs2")
#5. Lsit all shards
#    sh.getShards()
