# AWS S3 Storage Setup Guide - INEXT

## 1. Bucket Information
- **Bucket Name:** `inext-media-storage`
- **AWS Region:** `ap-south-1` (Asia Pacific - Mumbai)
- **Base Folder:** `ramjikisena`
- **Bucket Status:** Created, Public Read Enabled, CORS Configured

## 2. Folder Hierarchy Inside Bucket
```
inext-media-storage/
└── ramjikisena/
    ├── mandirs/           (Temple photos & galleries)
    ├── blogs/             (Blog headers & article images)
    ├── pandits/           (Pandit profile photos & galleries)
    ├── katha-vachaks/     (Katha Vachak photos)
    ├── samagri/           (Samagri product images)
    └── profile_avatars/   (User profiles & covers)
```

## 3. Configuration (.env)
The backend `.env` should be configured with:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=inext-media-storage
AWS_S3_BASE_FOLDER=ramjikisena
```

## 4. Features & Architecture
- **Automatic Fallback:** S3 is used as primary storage; if credentials are missing, falls back to Cloudinary.
- **Direct Public URLs:** Images are accessible at `https://inext-media-storage.s3.ap-south-1.amazonaws.com/ramjikisena/...`.
- **CORS Configured:** Allows cross-origin image requests (`GET`, `HEAD`, `PUT`, `POST`) from all origins.
- **Next.js Integration:** `next.config.ts` has been configured to allow images from `inext-media-storage.s3.ap-south-1.amazonaws.com` and `*.amazonaws.com`.
