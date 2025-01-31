<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250127203634 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE property_amenities (property_id INT NOT NULL, amenity_id INT NOT NULL, PRIMARY KEY(property_id, amenity_id))');
        $this->addSql('CREATE INDEX IDX_9A9F56CA549213EC ON property_amenities (property_id)');
        $this->addSql('CREATE INDEX IDX_9A9F56CA9F9F1305 ON property_amenities (amenity_id)');
        $this->addSql('ALTER TABLE property_amenities ADD CONSTRAINT FK_9A9F56CA549213EC FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_amenities ADD CONSTRAINT FK_9A9F56CA9F9F1305 FOREIGN KEY (amenity_id) REFERENCES amenity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE topology.topology_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE property_amenities DROP CONSTRAINT FK_9A9F56CA549213EC');
        $this->addSql('ALTER TABLE property_amenities DROP CONSTRAINT FK_9A9F56CA9F9F1305');
        $this->addSql('DROP TABLE property_amenities');
    }
}
