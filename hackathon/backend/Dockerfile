FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/HealthGameCurator.Api/HealthGameCurator.Api.csproj", "src/HealthGameCurator.Api/"]
COPY ["src/HealthGameCurator.Application/HealthGameCurator.Application.csproj", "src/HealthGameCurator.Application/"]
COPY ["src/HealthGameCurator.Domain/HealthGameCurator.Domain.csproj", "src/HealthGameCurator.Domain/"]
COPY ["src/HealthGameCurator.Infrastructure/HealthGameCurator.Infrastructure.csproj", "src/HealthGameCurator.Infrastructure/"]
RUN dotnet restore "src/HealthGameCurator.Api/HealthGameCurator.Api.csproj"
COPY . .
WORKDIR "/src/src/HealthGameCurator.Api"
RUN dotnet publish "HealthGameCurator.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
RUN mkdir -p /data
COPY --from=build /app/publish .
# Railway는 PORT 환경변수를 자동 주입함
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080
ENTRYPOINT ["dotnet", "HealthGameCurator.Api.dll"]
