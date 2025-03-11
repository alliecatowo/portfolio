#!/usr/bin/env python3
import requests
import json
import sys
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DIRECTUS_URL = "https://directus.allisons.dev"


def login(email, password):
    """Login to Directus and get access token"""
    url = f"{DIRECTUS_URL}/auth/login"
    payload = {"email": email, "password": password}

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()["data"]["access_token"]
    except requests.exceptions.RequestException as e:
        logger.error(f"Login failed: {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Response: {e.response.text}")
        sys.exit(1)


def create_collection(token, name, comment):
    """Create a collection in Directus"""
    url = f"{DIRECTUS_URL}/collections"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"collection": name, "meta": {"comment": comment}, "schema": {"name": name, "comment": comment}}

    try:
        # Check if collection exists
        check_response = requests.get(f"{DIRECTUS_URL}/collections/{name}", headers=headers)
        if check_response.status_code == 200:
            logger.info(f"Collection {name} already exists. Skipping creation.")
            return True

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Collection {name} created successfully")
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to create collection {name}: {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Response: {e.response.text}")
        return False


def create_field(token, collection, field_name, field_type, options):
    """Create a field in a collection"""
    url = f"{DIRECTUS_URL}/fields/{collection}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"field": field_name, "type": field_type, "meta": options}

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Field {field_name} created in collection {collection}")
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to create field {field_name} in collection {collection}: {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Response: {e.response.text}")
        return False


def set_permissions(token, collection, fields, action="read", role=None):
    """Set permissions for a collection"""
    url = f"{DIRECTUS_URL}/permissions"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "collection": collection,
        "role": role,  # None for public access
        "action": action,
        "permissions": {},
        "fields": fields,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Permissions set for collection {collection}")
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to set permissions for collection {collection}: {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Response: {e.response.text}")
        return False


def create_test_item(token, collection, data):
    """Create a test item in a collection"""
    url = f"{DIRECTUS_URL}/items/{collection}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        logger.info(f"Test item created in collection {collection}")
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to create test item in collection {collection}: {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Response: {e.response.text}")
        return False


def main():
    if len(sys.argv) not in [2, 3]:
        print("Usage: python setup_directus.py <admin_token>")
        print("   or: python setup_directus.py <email> <password>")
        sys.exit(1)

    # Get token either directly or through login
    if len(sys.argv) == 2:
        token = sys.argv[1]
    else:
        email = sys.argv[1]
        password = sys.argv[2]
        token = login(email, password)

    logger.info(f"Setting up Directus collections, fields, and permissions at {DIRECTUS_URL}")

    # Create collections
    collections = [
        ("gallery", "Gallery items including tattoo works and other visual content"),
        ("blog_posts", "Blog articles for both dev and tattoo portfolios"),
        ("projects", "Development projects and portfolio items"),
        ("categories", "Categories for blog posts and projects"),
        ("styles", "Tattoo styles"),
    ]

    for name, comment in collections:
        create_collection(token, name, comment)

    # Wait for collections to be created
    time.sleep(2)

    # Create fields for gallery collection
    gallery_fields = [
        (
            "title",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter title"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 1,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "description",
            "text",
            {
                "interface": "input-multiline",
                "options": {"placeholder": "Enter description"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 2,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "image",
            "uuid",
            {
                "interface": "file-image",
                "options": {},
                "display": "image",
                "display_options": {"crop": True},
                "readonly": False,
                "hidden": False,
                "sort": 3,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
                "special": ["file"],
            },
        ),
        (
            "type",
            "string",
            {
                "interface": "select-dropdown",
                "options": {
                    "choices": [
                        {"text": "Tattoo", "value": "tattoo"},
                        {"text": "Art", "value": "art"},
                        {"text": "Testimonial", "value": "testimonial"},
                    ]
                },
                "display": "labels",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 4,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "featured",
            "boolean",
            {
                "interface": "boolean",
                "options": {"label": "Featured"},
                "display": "boolean",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 5,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "client_testimonial",
            "text",
            {
                "interface": "input-multiline",
                "options": {"placeholder": "Enter client testimonial"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 6,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "date",
            "timestamp",
            {
                "interface": "datetime",
                "options": {},
                "display": "datetime",
                "display_options": {"relative": True},
                "readonly": False,
                "hidden": False,
                "sort": 7,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "slug",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter slug"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 8,
                "width": "full",
                "translations": None,
                "note": "Used in URLs, should be unique",
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "category",
            "string",
            {
                "interface": "select-dropdown",
                "options": {
                    "choices": [
                        {"text": "Art", "value": "art"},
                        {"text": "Tattoo", "value": "tattoo"},
                        {"text": "Testimonial", "value": "testimonial"},
                    ]
                },
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 9,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "sort",
            "integer",
            {
                "interface": "input",
                "options": {},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 10,
                "width": "half",
                "translations": None,
                "note": "Used for custom ordering",
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
    ]

    for field_name, field_type, options in gallery_fields:
        create_field(token, "gallery", field_name, field_type, options)

    # Create fields for blog_posts collection
    blog_post_fields = [
        (
            "title",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter title"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 1,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "content",
            "text",
            {
                "interface": "input-rich-text-md",
                "options": {},
                "display": "formatted-value",
                "display_options": {"format": True},
                "readonly": False,
                "hidden": False,
                "sort": 2,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "slug",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter slug"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 3,
                "width": "full",
                "translations": None,
                "note": "Used in URLs, should be unique",
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "cover_image",
            "uuid",
            {
                "interface": "file-image",
                "options": {},
                "display": "image",
                "display_options": {"crop": True},
                "readonly": False,
                "hidden": False,
                "sort": 4,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
                "special": ["file"],
            },
        ),
        (
            "excerpt",
            "text",
            {
                "interface": "input-multiline",
                "options": {"placeholder": "Enter excerpt"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 5,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "portfolio_type",
            "string",
            {
                "interface": "select-dropdown",
                "options": {
                    "choices": [
                        {"text": "Developer", "value": "dev"},
                        {"text": "Tattoo", "value": "tattoo"},
                        {"text": "Both", "value": "both"},
                    ]
                },
                "display": "labels",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 6,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "date_published",
            "timestamp",
            {
                "interface": "datetime",
                "options": {},
                "display": "datetime",
                "display_options": {"relative": True},
                "readonly": False,
                "hidden": False,
                "sort": 7,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "featured",
            "boolean",
            {
                "interface": "boolean",
                "options": {"label": "Featured"},
                "display": "boolean",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 8,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
    ]

    for field_name, field_type, options in blog_post_fields:
        create_field(token, "blog_posts", field_name, field_type, options)

    # Create fields for projects collection
    project_fields = [
        (
            "title",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter title"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 1,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "description",
            "text",
            {
                "interface": "input-multiline",
                "options": {"placeholder": "Enter description"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 2,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "slug",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter slug"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 3,
                "width": "full",
                "translations": None,
                "note": "Used in URLs, should be unique",
                "conditions": None,
                "required": True,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "cover_image",
            "uuid",
            {
                "interface": "file-image",
                "options": {},
                "display": "image",
                "display_options": {"crop": True},
                "readonly": False,
                "hidden": False,
                "sort": 4,
                "width": "full",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
                "special": ["file"],
            },
        ),
        (
            "technologies",
            "json",
            {
                "interface": "list",
                "options": {},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 5,
                "width": "full",
                "translations": None,
                "note": "List of technologies used",
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "github",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter GitHub URL"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 6,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "live_url",
            "string",
            {
                "interface": "input",
                "options": {"placeholder": "Enter live URL"},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 7,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "featured",
            "boolean",
            {
                "interface": "boolean",
                "options": {"label": "Featured"},
                "display": "boolean",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 8,
                "width": "half",
                "translations": None,
                "note": None,
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
        (
            "sort",
            "integer",
            {
                "interface": "input",
                "options": {},
                "display": "formatted-value",
                "display_options": {},
                "readonly": False,
                "hidden": False,
                "sort": 9,
                "width": "half",
                "translations": None,
                "note": "Used for custom ordering",
                "conditions": None,
                "required": False,
                "group": None,
                "validation": None,
                "validation_message": None,
            },
        ),
    ]

    for field_name, field_type, options in project_fields:
        create_field(token, "projects", field_name, field_type, options)

    # Set public permissions for all collections
    all_fields_gallery = [
        "id",
        "title",
        "description",
        "image",
        "type",
        "featured",
        "client_testimonial",
        "date",
        "slug",
        "category",
        "sort",
    ]
    all_fields_blog_posts = [
        "id",
        "title",
        "content",
        "slug",
        "cover_image",
        "excerpt",
        "portfolio_type",
        "date_published",
        "featured",
    ]
    all_fields_projects = [
        "id",
        "title",
        "description",
        "slug",
        "cover_image",
        "technologies",
        "github",
        "live_url",
        "featured",
        "sort",
    ]

    set_permissions(token, "gallery", all_fields_gallery)
    set_permissions(token, "blog_posts", all_fields_blog_posts)
    set_permissions(token, "projects", all_fields_projects)

    # Add some test data
    logger.info("Adding test data to collections")

    # Add test project
    project_data = {
        "title": "Portfolio Website",
        "description": "A personal portfolio website built with Nuxt.js and Directus.",
        "slug": "portfolio-website",
        "technologies": ["Vue.js", "Nuxt.js", "Tailwind CSS", "Directus"],
        "github": "https://github.com/username/portfolio",
        "live_url": "https://allisons.dev",
        "featured": True,
        "sort": 1,
    }
    create_test_item(token, "projects", project_data)

    # Add test blog post
    blog_post_data = {
        "title": "Getting Started with Directus",
        "content": "# Getting Started with Directus\n\nThis is a sample blog post about how to get started with Directus, a fantastic headless CMS.\n\n## Introduction\n\nDirectus is an open-source headless CMS that gives you the freedom to manage your content however you want.",
        "slug": "getting-started-with-directus",
        "excerpt": "Learn how to set up and use Directus as a headless CMS for your projects.",
        "portfolio_type": "dev",
        "date_published": "2025-03-11T12:00:00Z",
        "featured": True,
    }
    create_test_item(token, "blog_posts", blog_post_data)

    # Add test gallery item
    gallery_data = {
        "title": "Sample Tattoo Design",
        "description": "A beautiful floral design with fine line work.",
        "type": "tattoo",
        "featured": True,
        "client_testimonial": "I love my new tattoo! The design is exactly what I wanted.",
        "date": "2025-03-10T15:30:00Z",
        "slug": "sample-tattoo-design",
        "category": "tattoo",
        "sort": 1,
    }
    create_test_item(token, "gallery", gallery_data)

    logger.info("Setup complete!")
    logger.info("You can now access the collections through the Directus API.")
    logger.info(
        "Remember to upload images for the projects, blog posts, and gallery items through the Directus admin interface."
    )


if __name__ == "__main__":
    main()
