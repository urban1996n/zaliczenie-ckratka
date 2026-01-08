using backend.modules.budget.infrastructure.model;

namespace backend.infrastructure.database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class DefaultDatabaseContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Entry> Entries { get; set; }

    public string DbPath { get; }

    public DefaultDatabaseContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "simple_budget_planner.db");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}