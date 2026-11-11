# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_API_KEY
ARG VITE_APP_NAME=Ayurnexaa
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_SECRET_KEY
ARG VITE_SUPABASE_BUCKET
ARG SUPABASE_S3_ENDPOINT
ARG SupabaseS3acceskeyid
ARG supabaseS3accesssecretkey
ARG supabaseS3region

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_SECRET_KEY=$VITE_SUPABASE_SECRET_KEY
ENV VITE_SUPABASE_BUCKET=$VITE_SUPABASE_BUCKET
ENV SUPABASE_S3_ENDPOINT=$SUPABASE_S3_ENDPOINT
ENV SupabaseS3acceskeyid=$SupabaseS3acceskeyid
ENV supabaseS3accesssecretkey=$supabaseS3accesssecretkey
ENV supabaseS3region=$supabaseS3region

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache jq
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 docker-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
