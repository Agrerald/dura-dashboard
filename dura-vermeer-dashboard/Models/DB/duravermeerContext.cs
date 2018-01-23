using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dura_vermeer_dashboard.Models.DB
{
    public partial class duravermeerContext : DbContext
    {
        public virtual DbSet<DataPoint> DataPoint { get; set; }
        public virtual DbSet<Node> Node { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("Server=localhost;Database=duravermeer;User Id=duravermeer;Password=duravermeer;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DataPoint>(entity =>
            {
                entity.HasIndex(e => e.DataPointId)
                    .HasName("dataPointID")
                    .IsUnique();

                entity.HasIndex(e => e.NodeId)
                    .HasName("FKDataPoint318401");

                entity.Property(e => e.DataPointId)
                    .HasColumnName("dataPointID")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Afstand)
                    .HasColumnName("afstand")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Datum)
                    .HasColumnName("datum")
                    .HasColumnType("datetime");

                entity.Property(e => e.Naam)
                    .IsRequired()
                    .HasColumnName("naam")
                    .HasMaxLength(255);

                entity.Property(e => e.NodeId)
                    .HasColumnName("nodeID")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Rssi)
                    .HasColumnName("rssi")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.Node)
                    .WithMany(p => p.DataPoint)
                    .HasForeignKey(d => d.NodeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKDataPoint318401");
            });

            modelBuilder.Entity<Node>(entity =>
            {
                entity.HasIndex(e => e.NodeId)
                    .HasName("nodeID")
                    .IsUnique();

                entity.Property(e => e.NodeId)
                    .HasColumnName("nodeID")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Latitude)
                    .HasColumnName("latitude")
                    .HasMaxLength(300);

                entity.Property(e => e.Locatie)
                    .IsRequired()
                    .HasColumnName("locatie")
                    .HasMaxLength(500);

                entity.Property(e => e.Longtitude)
                    .HasColumnName("longtitude")
                    .HasMaxLength(300);

                entity.Property(e => e.Naam)
                    .IsRequired()
                    .HasColumnName("naam")
                    .HasMaxLength(255);
            });
        }
    }
}
