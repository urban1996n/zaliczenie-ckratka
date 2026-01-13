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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
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
