<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250116095854 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE address ADD location geometry(GEOMETRY, 0) NOT NULL');
        $this->addSql('ALTER TABLE property ADD latitude DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE property ADD longitude DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE property ALTER location DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE property DROP latitude');
        $this->addSql('ALTER TABLE property DROP longitude');
        $this->addSql('ALTER TABLE property ALTER location SET NOT NULL');
        $this->addSql('ALTER TABLE address DROP location');
    }
}
