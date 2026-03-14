FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/HealthGameCurator.Api/HealthGameCurator.Api.csproj", "src/HealthGameCurator.Api/"]
COPY ["src/HealthGameCurator.Application/HealthGameCurator.Application.csproj", "src/HealthGameCurator.Application/"]
COPY ["src/HealthGameCurator.Domain/HealthGameCurator.Domain.csproj", "src/HealthGameCurator.Domain/"]
COPY ["src/HealthGameCurator.Infrastructure/HealthGameCurator.Infrastructure.csproj", "src/HealthGameCurator.Infrastructure/"]
RUN dotnet restore "src/HealthGameCurator.Api/HealthGameCurator.Api.csproj"
COPY . .
WORKDIR "/src/src/HealthGameCurator.Api"
RUN dotnet build "HealthGameCurator.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HealthGameCurator.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
RUN mkdir -p /app/data
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthGameCurator.Api.dll"]
