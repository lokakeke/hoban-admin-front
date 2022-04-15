FROM nginx:latest

COPY ./dist/ /usr/share/nginx/html

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
