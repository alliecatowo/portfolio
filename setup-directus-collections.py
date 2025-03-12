#!/usr/bin/env python3
import requests
import json
import time
import logging
import sys
import os
from datetime import datetime
from getpass import getpass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("directus_setup.log"), logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("directus-setup")

# Base URL of your Directus installation
DIRECTUS_URL = "https://directus.allisons.dev"

# Admin token or email/password for authentication
# If you use TOKEN, set it as environment variable or put it here (less secure)
ADMIN_TOKEN = os.environ.get("DIRECTUS_ADMIN_TOKEN")
ADMIN_EMAIL = os.environ.get("DIRECTUS_ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("DIRECTUS_ADMIN_PASSWORD")


def login(email, password):
    """Authenticate with Directus and get a JWT token"""
    url = f"{DIRECTUS_URL}/auth/login"
    payload = {"email": email, "password": password}

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        logger.info("Successfully logged in with provided email/password")
        return data["data"]["access_token"]
    except requests.RequestException as e:
        logger.error(f"Failed to authenticate: {e}")
        sys.exit(1)


def collection_exists(token, collection_name):
    """Check if a collection already exists"""
    url = f"{DIRECTUS_URL}/collections/{collection_name}"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(url, headers=headers)
        return response.status_code == 200
    except requests.RequestException:
        return False


def create_collection(token, name, comment):
    """Create a new collection in Directus"""
    if collection_exists(token, name):
        logger.info(f"Collection '{name}' already exists, skipping creation.")
        return

    url = f"{DIRECTUS_URL}/collections"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "collection": name,
        "meta": {"collection": name, "icon": "article", "note": comment, "display_template": "{{title}}"},
        "schema": {"name": name, "comment": comment},
        "fields": [
            {
                "field": "id",
                "type": "integer",
                "meta": {
                    "interface": "input",
                    "readonly": True,
                    "hidden": True,
                    "width": "full",
                    "note": "Unique identifier for the record",
                },
                "schema": {"is_primary_key": True, "has_auto_increment": True},
            },
            {
                "field": "status",
                "type": "string",
                "meta": {
                    "width": "full",
                    "interface": "select-dropdown",
                    "options": {
                        "choices": [
                            {"text": "Published", "value": "published"},
                            {"text": "Draft", "value": "draft"},
                            {"text": "Archived", "value": "archived"},
                        ]
                    },
                    "display": "labels",
                },
                "schema": {"default_value": "draft"},
            },
            {
                "field": "sort",
                "type": "integer",
                "meta": {"interface": "input", "hidden": True},
                "schema": {"is_nullable": True},
            },
            {
                "field": "user_created",
                "type": "string",
                "meta": {
                    "special": ["user-created"],
                    "interface": "select-dropdown-m2o",
                    "options": {"template": "{{first_name}} {{last_name}}"},
                    "display": "user",
                    "readonly": True,
                    "hidden": True,
                    "width": "half",
                },
                "schema": {"is_nullable": True},
            },
            {
                "field": "date_created",
                "type": "timestamp",
                "meta": {
                    "special": ["date-created"],
                    "interface": "datetime",
                    "readonly": True,
                    "hidden": True,
                    "width": "half",
                    "display": "datetime",
                },
                "schema": {"is_nullable": True},
            },
            {
                "field": "user_updated",
                "type": "string",
                "meta": {
                    "special": ["user-updated"],
                    "interface": "select-dropdown-m2o",
                    "options": {"template": "{{first_name}} {{last_name}}"},
                    "display": "user",
                    "readonly": True,
                    "hidden": True,
                    "width": "half",
                },
                "schema": {"is_nullable": True},
            },
            {
                "field": "date_updated",
                "type": "timestamp",
                "meta": {
                    "special": ["date-updated"],
                    "interface": "datetime",
                    "readonly": True,
                    "hidden": True,
                    "width": "half",
                    "display": "datetime",
                },
                "schema": {"is_nullable": True},
            },
        ],
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Collection '{name}' created successfully!")
        return response.json()["data"]
    except requests.RequestException as e:
        logger.error(f"Failed to create collection '{name}': {e}")
        if hasattr(e, "response") and e.response:
            logger.error(f"Response content: {e.response.text}")
        return None


def field_exists(token, collection, field_name):
    """Check if a field already exists in a collection"""
    url = f"{DIRECTUS_URL}/fields/{collection}/{field_name}"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(url, headers=headers)
        return response.status_code == 200
    except requests.RequestException:
        return False


def create_field(token, collection, field_name, field_type, options=None):
    """Add a field to a collection"""
    if field_exists(token, collection, field_name):
        logger.info(f"Field '{field_name}' already exists in collection '{collection}', skipping creation.")
        return

    if options is None:
        options = {}

    url = f"{DIRECTUS_URL}/fields/{collection}"
    headers = {"Authorization": f"Bearer {token}"}

    # Set default meta options
    meta = {"interface": "input", "width": "full", "display": "raw"}

    # Update with provided options
    if "meta" in options:
        meta.update(options["meta"])
        del options["meta"]

    # Default schema options
    schema = {"is_nullable": True}

    # Update with provided schema options
    if "schema" in options:
        schema.update(options["schema"])
        del options["schema"]

    payload = {"field": field_name, "type": field_type, "meta": meta, "schema": schema}

    # Additional options
    for key, value in options.items():
        payload[key] = value

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Field '{field_name}' created in collection '{collection}'")
        return response.json()["data"]
    except requests.RequestException as e:
        logger.error(f"Failed to create field '{field_name}' in collection '{collection}': {e}")
        if hasattr(e, "response") and e.response:
            logger.error(f"Response content: {e.response.text}")
        return None


def set_permissions(token, collection, fields=None, action="read", role=None):
    """Set permissions for a collection"""
    url = f"{DIRECTUS_URL}/permissions"
    headers = {"Authorization": f"Bearer {token}"}

    # Default to public role if none specified
    if role is None:
        # Get the public role ID
        try:
            roles_url = f"{DIRECTUS_URL}/roles"
            roles_response = requests.get(roles_url, headers=headers)
            roles_response.raise_for_status()
            roles_data = roles_response.json()["data"]

            # Find the public role
            public_role = next((role for role in roles_data if role.get("name", "").lower() == "public"), None)
            if public_role:
                role = public_role["id"]
            else:
                logger.error("Public role not found")
                return None
        except requests.RequestException as e:
            logger.error(f"Failed to get roles: {e}")
            return None

    # If fields is None, allow all fields
    if fields is None:
        fields = ["*"]
    elif not isinstance(fields, list):
        fields = [fields]

    payload = {
        "role": role,
        "collection": collection,
        "action": action,
        "fields": fields,
        "permissions": {},
        "validation": {},
        "presets": {},
        "policy": None,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200 or response.status_code == 204:
            logger.info(f"Permissions set for '{collection}' with action '{action}'")
            return True
        else:
            logger.error(f"Failed to set permissions for '{collection}': {response.text}")
            return False
    except requests.RequestException as e:
        logger.error(f"Failed to set permissions for '{collection}': {e}")
        return None


def create_test_item(token, collection, data):
    """Insert a test item into a collection"""
    url = f"{DIRECTUS_URL}/items/{collection}"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        logger.info(f"Test item created in collection '{collection}'")
        return response.json()["data"]
    except requests.RequestException as e:
        logger.error(f"Failed to create test item in collection '{collection}': {e}")
        if hasattr(e, "response") and e.response:
            logger.error(f"Response content: {e.response.text}")
        return None


def main():
    # Login to get a token
    logger.info("Starting Directus collections setup...")

    # You can either use token or email/password
    token = None

    if ADMIN_TOKEN:
        token = ADMIN_TOKEN
        logger.info("Using provided admin token for authentication")
    elif ADMIN_EMAIL and ADMIN_PASSWORD:
        token = login(ADMIN_EMAIL, ADMIN_PASSWORD)
        logger.info("Successfully logged in with provided email/password")
    else:
        logger.error(
            "No authentication credentials provided. Please set DIRECTUS_ADMIN_TOKEN or DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD environment variables"
        )
        sys.exit(1)

    if not token:
        logger.error("Failed to obtain authentication token.")
        return

    # Create Gallery Collection
    create_collection(token, "gallery", "Portfolio gallery items")
    create_field(token, "gallery", "title", "string", {"meta": {"interface": "input", "display": "raw"}})
    create_field(
        token, "gallery", "description", "text", {"meta": {"interface": "input-multiline", "display": "formatted-text"}}
    )
    create_field(
        token,
        "gallery",
        "image",
        "uuid",
        {"meta": {"interface": "file-image", "display": "image", "special": ["file"]}},
    )
    create_field(
        token,
        "gallery",
        "type",
        "string",
        {
            "meta": {
                "interface": "select-dropdown",
                "options": {
                    "choices": [{"text": "Tattoo", "value": "tattoo"}, {"text": "Development", "value": "dev"}]
                },
            }
        },
    )
    create_field(
        token, "gallery", "featured", "boolean", {"meta": {"interface": "boolean", "special": ["cast-boolean"]}}
    )

    # Create Blog Posts Collection
    create_collection(token, "blog_posts", "Blog posts for the portfolio")
    create_field(token, "blog_posts", "title", "string")
    create_field(
        token,
        "blog_posts",
        "content",
        "text",
        {"meta": {"interface": "input-rich-text-html", "display": "formatted-text-html"}},
    )
    create_field(token, "blog_posts", "summary", "text", {"meta": {"interface": "input-multiline"}})
    create_field(
        token,
        "blog_posts",
        "featured_image",
        "uuid",
        {"meta": {"interface": "file-image", "display": "image", "special": ["file"]}},
    )
    create_field(
        token, "blog_posts", "date_published", "date", {"meta": {"interface": "datetime", "display": "datetime"}}
    )
    create_field(
        token,
        "blog_posts",
        "portfolio_type",
        "string",
        {
            "meta": {
                "interface": "select-dropdown",
                "options": {
                    "choices": [{"text": "Tattoo", "value": "tattoo"}, {"text": "Development", "value": "dev"}]
                },
            }
        },
    )

    # Create Projects Collection
    create_collection(token, "projects", "Portfolio projects")
    create_field(token, "projects", "title", "string")
    create_field(
        token,
        "projects",
        "description",
        "text",
        {"meta": {"interface": "input-rich-text-html", "display": "formatted-text-html"}},
    )
    create_field(token, "projects", "summary", "text", {"meta": {"interface": "input-multiline"}})
    create_field(
        token,
        "projects",
        "featured_image",
        "uuid",
        {"meta": {"interface": "file-image", "display": "image", "special": ["file"]}},
    )
    create_field(
        token,
        "projects",
        "github_url",
        "string",
        {"meta": {"interface": "input", "options": {"placeholder": "https://github.com/username/repo"}}},
    )
    create_field(token, "projects", "demo_url", "string", {"meta": {"interface": "input"}})
    create_field(
        token,
        "projects",
        "category",
        "string",
        {"meta": {"interface": "select-dropdown-m2o", "options": {"collection": "categories"}}},
    )
    create_field(
        token, "projects", "featured", "boolean", {"meta": {"interface": "boolean", "special": ["cast-boolean"]}}
    )

    # Create Categories Collection
    create_collection(token, "categories", "Project categories")
    create_field(token, "categories", "name", "string")
    create_field(token, "categories", "description", "text")

    # Create Styles Collection (for tattoo styles)
    create_collection(token, "styles", "Tattoo styles")
    create_field(token, "styles", "name", "string")
    create_field(token, "styles", "description", "text")
    create_field(
        token, "styles", "image", "uuid", {"meta": {"interface": "file-image", "display": "image", "special": ["file"]}}
    )

    # Create Testimonials Collection
    create_collection(token, "testimonials", "Client testimonials")
    create_field(token, "testimonials", "client_name", "string")
    create_field(token, "testimonials", "text", "text")
    create_field(
        token, "testimonials", "rating", "integer", {"meta": {"interface": "input", "options": {"min": 1, "max": 5}}}
    )
    create_field(
        token,
        "testimonials",
        "portfolio_type",
        "string",
        {
            "meta": {
                "interface": "select-dropdown",
                "options": {
                    "choices": [{"text": "Tattoo", "value": "tattoo"}, {"text": "Development", "value": "dev"}]
                },
            }
        },
    )

    # Set public read permissions for all collections
    collections = ["gallery", "blog_posts", "projects", "categories", "styles", "testimonials"]
    for collection in collections:
        set_permissions(token, collection, fields=["*"], action="read")

    # Add sample data if needed
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Sample blog post
    create_test_item(
        token,
        "blog_posts",
        {
            "title": "Welcome to My Portfolio",
            "content": "<p>This is a sample blog post to demonstrate the functionality of my portfolio site.</p>",
            "summary": "A sample blog post to demonstrate the functionality.",
            "date_published": current_date,
            "portfolio_type": "dev",
            "status": "published",
        },
    )

    # Sample project
    create_test_item(
        token,
        "projects",
        {
            "title": "Sample Portfolio Project",
            "description": "<p>This is a sample project description with details about the technologies used and the challenges faced.</p>",
            "summary": "A sample project to demonstrate the functionality.",
            "github_url": "https://github.com/example/sample-project",
            "demo_url": "https://example.com/demo",
            "featured": True,
            "status": "published",
        },
    )

    # Sample testimonial
    create_test_item(
        token,
        "testimonials",
        {
            "client_name": "John Doe",
            "text": "Working with this professional was an amazing experience. The results exceeded my expectations!",
            "rating": 5,
            "portfolio_type": "tattoo",
            "status": "published",
        },
    )

    logger.info("Directus collections setup completed successfully!")


if __name__ == "__main__":
    main()
