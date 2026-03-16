import os
import uuid
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

def upload_file_to_s3(file_obj, filename: str, content_type: str):
    unique_filename = f"{uuid.uuid4()}_{filename}"

    try:
        s3_client.upload_fileobj(
            file_obj,
            AWS_S3_BUCKET,
            unique_filename,
            ExtraArgs={"ContentType": content_type}
        )

        file_url = f"https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"

        return {
            "file_key": unique_filename,
            "file_url": file_url,
        }

    except (BotoCoreError, ClientError) as e:
        raise Exception(f"S3 upload failed: {str(e)}")