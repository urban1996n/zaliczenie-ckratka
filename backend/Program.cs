using backend.infrastructure.database;
using backend.modules.budget.domain.calculator;
using backend.modules.budget.domain.category;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mappers;
using backend.modules.budget.infrastructure.repository;

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

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.MapControllers();

app.Run();
app.UseHttpsRedirection();

app.Run();
