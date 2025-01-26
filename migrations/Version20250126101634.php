<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250126101634 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE amenity (id SERIAL NOT NULL, property_id INT NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AB607963549213EC ON amenity (property_id)');
        $this->addSql('ALTER TABLE amenity ADD CONSTRAINT FK_AB607963549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE amenity DROP CONSTRAINT FK_AB607963549213EC');
        $this->addSql('DROP TABLE amenity');
    }
}
