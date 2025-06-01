"""
MongoDB Atlas Collection Setup Script

This script connects to MongoDB Atlas and creates a 'paragraphs' collection
with sample data.

Before running this script:
1. Install python-dotenv: pip install python-dotenv
2. Create a .env file in the project root with:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
"""

import os
import random
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from typing import List, Dict, Any

# Load environment variables from .env file
load_dotenv()

# Sample data for generating random content
EMOTIONS = ["sad", "angry", "happy", "excited", "surprised"]

PERSONA_NAMES = [
    "Frodo Baggins",
    "Gandalf the Grey",
    "Aragorn",
    "Legolas",
    "Gimli",
]

SAMPLE_PARAGRAPHS = [
    "The morning sun cast long shadows across the empty street, painting everything in hues of gold and amber.",
    "She couldn't shake the feeling that something was about to change, something profound and irreversible.",
    "The old man sat on the bench, feeding breadcrumbs to the pigeons, lost in memories of days gone by.",
    "Thunder rolled across the darkening sky, promising a storm that would wash away the dust of summer.",
    "In the quiet moments between heartbeats, she found herself wondering if this was all there was to life.",
    "The letter arrived on a Tuesday, unremarkable except for the foreign postmark and the familiar handwriting.",
    "Children's laughter echoed through the park, a reminder of simpler times and uncomplicated joy.",
    "He stared at the blank canvas, brush in hand, waiting for inspiration to strike like lightning.",
    "The coffee shop hummed with conversation, each table a small island of human connection.",
    "Night fell like a velvet curtain, bringing with it the promise of dreams and the fear of nightmares.",
    "The train whistle pierced the silence, announcing arrivals and departures, hellos and goodbyes.",
    "She walked through the autumn leaves, each step a small symphony of crunches and whispers.",
    "The library stood silent and imposing, a fortress of knowledge waiting to be explored.",
    "Rain tapped against the window like tiny fingers, demanding attention and offering comfort.",
    "The photograph yellowed with age told stories that words could never capture.",
    "In the garden, flowers bloomed defiantly against the approaching winter.",
    "The clock on the wall ticked relentlessly, marking time's inexorable march forward.",
    "Waves crashed against the shore, eternal and unchanging, yet never quite the same.",
    "The empty chair at the dinner table spoke volumes about loss and remembrance.",
    "Stars emerged one by one, pinpricks of light in the vast canvas of night.",
]


def generate_justification(emotion: str, emotion_level: int) -> str:
    """Generate a justification based on emotion and level."""
    justifications = {
        "sad": [
            f"The melancholic tone suggests a level {emotion_level} sadness.",
            f"There's an underlying sorrow that reaches intensity {emotion_level}.",
            f"The narrative conveys a profound sadness at level {emotion_level}.",
        ],
        "angry": [
            f"The tension in the text indicates anger at level {emotion_level}.",
            f"There's palpable frustration reaching intensity {emotion_level}.",
            f"The aggressive undertones suggest level {emotion_level} anger.",
        ],
        "happy": [
            f"The joyful atmosphere indicates happiness at level {emotion_level}.",
            f"There's a clear sense of contentment at intensity {emotion_level}.",
            f"The positive tone suggests level {emotion_level} happiness.",
        ],
        "excited": [
            f"The energetic pace shows excitement at level {emotion_level}.",
            f"There's obvious enthusiasm reaching intensity {emotion_level}.",
            f"The dynamic narrative indicates level {emotion_level} excitement.",
        ],
        "surprised": [
            f"The unexpected elements create surprise at level {emotion_level}.",
            f"There's a sense of astonishment at intensity {emotion_level}.",
            f"The sudden revelations suggest level {emotion_level} surprise.",
        ],
    }
    return random.choice(justifications.get(emotion, ["Emotional content detected."]))


def generate_sample_documents(count: int = 50) -> List[Dict[str, Any]]:
    """Generate sample documents for the paragraphs collection."""
    documents = []

    for i in range(count):
        persona_name = random.choice(PERSONA_NAMES)
        persona_id = f"persona_{persona_name.lower().replace(' ', '_')}_{random.randint(1000, 9999)}"
        emotion = random.choice(EMOTIONS)
        emotion_level = random.randint(1, 10)

        document = {
            "id": f"para_{datetime.now().strftime('%Y%m%d')}_{i:04d}",
            "persona_name": persona_name,
            "persona_id": persona_id,
            "book": "LOTR",
            "paragraph_index": random.randint(1, 100),
            "paragraph": random.choice(SAMPLE_PARAGRAPHS),
            "emotion": emotion,
            "emotion_level": emotion_level,
            "justification": generate_justification(emotion, emotion_level),
        }
        documents.append(document)

    return documents


def main():
    """Main function to connect to MongoDB and populate the collection."""
    # Get MongoDB URI from environment variable
    mongodb_uri = os.getenv("MONGODB_URI")

    if not mongodb_uri:
        print("Error: MONGODB_URI not found in environment variables.")
        print("Please create a .env file with your MongoDB Atlas connection string.")
        return

    try:
        # Connect to MongoDB
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(mongodb_uri)

        # Test the connection
        client.admin.command("ping")
        print("Successfully connected to MongoDB Atlas!")

        # Use the 'memorizz' database
        db = client["memorizz"]
        print("Using database: memorizz")

        # Create or get the paragraphs collection
        collection = db["paragraphs"]

        # Clean the collection before inserting new data
        print("Cleaning existing data from the 'paragraphs' collection...")
        delete_result = collection.delete_many({})
        print(f"Deleted {delete_result.deleted_count} existing documents.")

        # Generate sample documents
        print("Generating 50 sample documents...")
        documents = generate_sample_documents(50)

        # Insert documents into the collection
        print("Inserting documents into the 'paragraphs' collection...")
        result = collection.insert_many(documents)

        print(f"Successfully inserted {len(result.inserted_ids)} documents!")

        # Display some statistics
        print("\nCollection statistics:")
        print(f"Total documents: {collection.count_documents({})}")
        print(f"Unique personas: {len(collection.distinct('persona_name'))}")
        print(f"Book: LOTR")
        print(f"Emotion distribution:")
        for emotion in EMOTIONS:
            count = collection.count_documents({"emotion": emotion})
            print(f"  - {emotion}: {count} documents")

    except Exception as e:
        print(f"Error: {e}")
        print("Please check your MongoDB URI and network connection.")
    finally:
        # Close the connection
        if "client" in locals():
            client.close()
            print("\nConnection closed.")


if __name__ == "__main__":
    main()
