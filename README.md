# Product Microservice

## Dev
1. Clonar el Repositorio
2. Instalar las dependencias con `npm install`
4. Crea un  `.env.develpoment` basado en el `.env.example`
5. Iniciar Prisma con `npx prisma init`
6. Ejecutar el Script con `npm run prisma:migrate:dev` , esto creara la base de datos y le dira a prisma que elija la variable de entorno `.env.development `
7. Ejecutar `npm run start:dev