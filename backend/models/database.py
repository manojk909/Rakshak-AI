"""MongoDB async connection (motor)."""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "rakshak_ai")


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db = None


mongo = MongoDB()


async def connect_to_mongo():
    mongo.client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=8000)
    mongo.db = mongo.client[DATABASE_NAME]
    # Indexes for hot query paths
    await mongo.db.fraud_cases.create_index([("timestamp", -1)])
    await mongo.db.fraud_cases.create_index("urgency_level")
    await mongo.db.fraud_cases.create_index("status")
    await mongo.db.crime_locations.create_index("h3_index")
    await mongo.db.graph_nodes.create_index("node_id", unique=True)
    await mongo.db.graph_edges.create_index("edge_id", unique=True)
    await mongo.db.token_blacklist.create_index("token")
    return mongo.db


async def close_mongo_connection():
    if mongo.client:
        mongo.client.close()


def get_db():
    return mongo.db
