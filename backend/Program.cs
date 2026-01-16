using backend.infrastructure;
using System.Text;
using backend.infrastructure.database;
using backend.modules.budget.domain.calculator;
using backend.modules.budget.domain.category;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.budget.infrastructure.repository;
using backend.modules.user.domain;
using backend.modules.user.infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddScoped<DefaultDatabaseContext, DefaultDatabaseContext>();
builder.Services.AddDbContext<DefaultDatabaseContext>();
builder.Services.AddScoped<CategoryMapper, CategoryMapper>();
builder.Services.AddScoped<EntryMapper, EntryMapper>(provider => new EntryMapper(provider.GetService<CategoryMapper>()!));
builder.Services.AddScoped<IEntryRepository, EFEntryRepository>(
    provider => new EFEntryRepository(provider.GetService<DefaultDatabaseContext>()!, provider.GetService<EntryMapper>()!)
);
builder.Services.AddScoped<ICategoryRepository, EFCategoryRepository>(
    provider => new EFCategoryRepository(provider.GetService<DefaultDatabaseContext>()!, provider.GetService<CategoryMapper>()!)
);
builder.Services.AddScoped<IBudgetCalculator, PrimitiveBudgetCalculator>();
builder.Services.AddScoped<IUserRepository, EFUserRepository>();
builder.Services.AddScoped<PasswordManager, PasswordManager>();
builder.Services.AddScoped<AuthService, AuthService>();

var jwtSettings = new JwtSettings();
builder.Configuration.Bind("Jwt", jwtSettings);
builder.Services.AddSingleton(Options.Create(jwtSettings));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    if (string.IsNullOrEmpty(jwtSettings.Key))
    {
        throw new InvalidOperationException("JWT key is not configured.");
    }
    
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            var result = System.Text.Json.JsonSerializer.Serialize(new { error = "You are not authorized." });
            return context.Response.WriteAsync(result);
        }
    };
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("*")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddControllers();
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
