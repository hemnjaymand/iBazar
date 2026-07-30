# Create folders

$folders = @(
"src/app",
"src/features",
"src/shared/ui",
"src/shared/hooks",
"src/shared/utils",
"src/shared/constants",
"src/shared/types",
"src/shared/validation",

"src/server/auth",
"src/server/cache",
"src/server/email",
"src/server/sms",
"src/server/storage",
"src/server/search",
"src/server/permissions",
"src/server/errors",
"src/server/logger",
"src/server/repository",
"src/server/service",

"src/lib",

"src/config",

"prisma",

"docs/architecture",
"docs/database",
"docs/deployment",
"docs/testing",
"docs/adr"
)


foreach ($folder in $folders) {

    New-Item -ItemType Directory -Force -Path $folder

}


# Create files

$files = @(

"src/app/layout.tsx",
"src/app/page.tsx",
"src/app/globals.css",

"src/features/.gitkeep",

"src/shared/types/dto.ts",
"src/shared/types/result.ts",

"src/server/errors/application-error.ts",
"src/server/errors/validation-error.ts",
"src/server/errors/business-error.ts",
"src/server/errors/infrastructure-error.ts",
"src/server/errors/error-codes.ts",

"src/server/logger/logger.ts",

"src/server/repository/base-repository.ts",

"src/server/service/base-service.ts",

"src/lib/prisma.ts",

"src/config/app.ts",
"src/config/pagination.ts",
"src/config/cache.ts",
"src/config/upload.ts",
"src/config/roles.ts",
"src/config/permissions.ts",

"prisma/schema.prisma",
"prisma/seed.ts",

"README.md",
"ARCHITECTURE.md",
"ROADMAP.md",
"CHANGELOG.md",
".env.example"

)


foreach ($file in $files) {

    New-Item -ItemType File -Force -Path $file

}


Write-Host ""
Write-Host "Project structure created successfully!" -ForegroundColor Green